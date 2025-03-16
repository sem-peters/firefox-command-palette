import {Action} from "./index.ts";
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

function recursivelyAddBookmarkActions(bookmarkEntry: BookmarkTreeNode, folderPath: string, bookmarkActions: Action[]) {

    if (bookmarkEntry.type === "bookmark") {
        bookmarkActions.push({
            name: folderPath + bookmarkEntry.title,
            callback: async () => {
                await browser.tabs.create({
                    active: true,
                    url: bookmarkEntry.url,
                })
            }
        })
    }

    bookmarkEntry.children?.forEach((subChild) => {
        recursivelyAddBookmarkActions(subChild, folderPath + bookmarkEntry.title + ' > ', bookmarkActions)
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