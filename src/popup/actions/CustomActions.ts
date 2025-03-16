import {Action} from "./index.ts";

export const getMiscActions: () => Promise<Action[]> = async () => [
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
        name: "Restore Previous Session",
        callback: async () => {
            await browser.sessions.restore();
        }
    }


]