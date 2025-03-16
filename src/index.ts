import "./index.css";

import {configurePopup} from "./popup/config.ts";
import {defineActionsMenuElement} from "./popup/ActionsMenu.ts";
import {defineCommandElement} from "./popup/Command.ts";

configurePopup();

defineCommandElement();
defineActionsMenuElement();
