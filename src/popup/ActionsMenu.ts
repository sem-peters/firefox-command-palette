import {normalize} from "./normalize.ts";
import {CommandElement} from "./Command.ts";

interface CommandSearchResult {
    matching: CommandElement[];
    notMatching: CommandElement[];
}

export class ActionsMenu extends HTMLFormElement {

    searchInput: HTMLInputElement | null
    commandsList: HTMLUListElement | null;

    constructor() {
        super()
        this.searchInput = null;
        this.commandsList = null;
    }

    connectedCallback() {
        this.render();

        import("./actions.ts").then((actionsModule) => {
            actionsModule.ACTIONS.forEach((action) => {
                this.appendCommand(action.name, action.callback)
            })
        })

        this.initFilter();
    }

    render() {
        this.innerHTML = `
            <form class="commands" data-js-id="form">
                <input class="commands__search" type="search" placeholder="Filter commands..." data-js-id="search">
                <ul class="commands__list" data-js-id="list">
                </ul>
            </form>
        `;

        this.searchInput = this.querySelector('[data-js-id="search"]') as HTMLInputElement
        this.commandsList = this.querySelector('[data-js-id="list"]') as HTMLUListElement

        this.searchInput.focus()
    }

    appendCommand(name: string, callback: () => Promise<void>) {
        if (!this.commandsList) {
            console.error("Commands List not rendered. Cannot append command");
            return;
        }

        const existingCommand = this.searchCommandExact(name)
        if (existingCommand) {
            console.error(`Command with name ${name} already exists. Cannot append to the list.`)
            return;
        }

        const commandElement = document.createElement('li', {is: 'actions-command'}) as CommandElement
        commandElement.hide = false
        commandElement.command = name;
        commandElement.callback = callback;

        this.commandsList.appendChild(commandElement)
    }

    searchCommandExact(name: string): HTMLElement | null {
        if (!this.commandsList) {
            console.error("Commands List not rendered. Cannot search command");
            return null;
        }

        return this.commandsList.querySelector(name)
    }

    searchCommandsMatching(normalizedName: string): CommandSearchResult {
        if (!this.commandsList) {
            throw new Error("Commands List not rendered. Cannot search commands");
        }

        const matching: CommandElement[] = [];
        const notMatching: CommandElement[] = []
        this.commandsList.querySelectorAll<CommandElement>('[command]').forEach((commandElement) => {
            const normalizedCommandName = normalize(commandElement.getAttribute('command')!)
            if (normalizedCommandName.includes(normalizedName)) {
                matching.push(commandElement);
            } else {
                notMatching.push(commandElement)
            }

        })

        return {
            matching,
            notMatching
        };
    }

    initFilter() {
        if (!this.searchInput) {
            console.error("Search Input not rendered. Cannot init filter functionality");
            return;
        }

        this.searchInput.addEventListener("input", () => {
            const searchValue = normalize(this.searchInput!.value);
            const searchResult = this.searchCommandsMatching(searchValue)
            searchResult.matching.forEach((matchingCommand) => matchingCommand.hide = false)
            searchResult.notMatching.forEach((notMatchingCommand) => notMatchingCommand.hide = true)
        })
    }
}

export const defineActionsMenuElement = () => {
    customElements.define("actions-menu", ActionsMenu, {extends: "form"})
}