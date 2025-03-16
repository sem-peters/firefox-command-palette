export type Action = {
    name: string;
    callback: () => Promise<void>
}

export const ACTIONS = [
    {
        name: "New Tab",
        callback: async () => {
            await browser.tabs.create({
                active: true,
                url: "about:blank"
            })
        }
    },
    {
        name: "Go to Google",
        callback: async () => {
            const tabs = await browser.tabs.query({currentWindow: true})
            const googleTabs = tabs.filter((tab) => tab.url?.includes('https://') && tab.url?.includes('google'))
            if (googleTabs && googleTabs.length > 0) {
                console.log('moving to googletab ', googleTabs[0])

                await browser.windows.update(googleTabs[0].windowId!, {
                    focused: true
                })
                await browser.tabs.update(googleTabs[0].id!, {
                    active: true,
                })
            } else {
                console.log('Creating google tab')
                await browser.tabs.create({
                    url: "https://google.com",
                    active: true
                })
            }
        }
    }

]