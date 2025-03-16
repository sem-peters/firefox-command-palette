import {getBookmarkActions} from "./BookmarkActions.ts";
import {getMiscActions} from "./CustomActions.ts";

export type Action = {
    name: string;
    callback: () => Promise<void>
}

export const getActions = async () => {
    return [
        ...await getMiscActions(),
        ...await getBookmarkActions(),
    ]
}
