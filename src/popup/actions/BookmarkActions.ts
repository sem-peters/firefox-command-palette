import {Action} from "./index.ts";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

async function handleDefaultBookmark(url: string) {
    await browser.tabs.create({
        active: true,
        url: url,
    })
}

async function handleJavascriptBookmark(url: string) {
    url = url.substring('javascript:'.length);

    const currentTab = (await browser.tabs.query({active: true}))[0]?.id;
    if (!currentTab) {
        console.error("No current tab");
        return;
    }

    await browser.scripting.executeScript({
        target: { tabId: currentTab },
        // @ts-expect-error Incorrect typing from the library. It takes the 'url' argument from the [args] array.
        func: (url) => {
            const script = document.createElement('script')
            script.innerHTML = url
            document.body.appendChild(script)
            script.remove();
        },
        args: [url]
    });

}

function recursivelyAddBookmarkActions(bookmarkEntry: BookmarkTreeNode, folderPath: string, bookmarkActions: Action[]) {
    if (bookmarkEntry.type === "bookmark") {
        if (!bookmarkEntry.url) return;
        const bookmarkName = folderPath + bookmarkEntry.title
        let callback;
        if (bookmarkEntry.url.startsWith('javascript:')) {
            callback = async () => await handleJavascriptBookmark(bookmarkEntry.url!)
        } else {
            callback = async () => {
                await handleDefaultBookmark(bookmarkEntry.url!);
            }
        }

        bookmarkActions.push({
            name: bookmarkName,
            callback
        })
    }

    bookmarkEntry.children?.forEach(child => {
        recursivelyAddBookmarkActions(child, folderPath + bookmarkEntry.title + " > ", bookmarkActions)
    })
}

export const getBookmarkActions = async () => {
    const bookmarkActions: Action[] = [];
    await browser.bookmarks.getTree().then((tree) => {
        const root = tree[0]
        const toolbar = root?.children?.find((childNode) => childNode.title.toLowerCase().includes('toolbar'));
        toolbar?.children?.forEach(toolbarItem => {
            recursivelyAddBookmarkActions(toolbarItem, 'Bookmark > ', bookmarkActions)
        })
    })

    return bookmarkActions;
}