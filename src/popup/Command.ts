export class CommandElement extends HTMLLIElement {
    static observedAttributes = ["hide", "command", "callback"]

    private _command: string | null
    private _hide: boolean
    private _callbackFn: () => Promise<void>

    li: HTMLLIElement | null
    button: HTMLButtonElement | null

    constructor() {
        super();
        this._command = this.getAttribute('command');
        this._hide = this.getAttribute('hidden') === 'true'
        this.li = null;
        this.button = null;
        this._callbackFn = async () => {
        }
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name === 'hide') {
            this._hide = newValue === 'true'
        } else if (name === 'command') {
            this._command = newValue
        }

        this.render();
    }

    get callback() {
        return this._callbackFn;
    }

    set callback(callback: () => Promise<void>) {
        this._callbackFn = callback;
        this.render();
    }

    get hide(): boolean {
        return this._hide;
    }

    set hide(value: boolean) {
        this.setAttribute('hide', '' + value)
    }

    get command(): string | null {
        return this._command;
    }

    set command(value: string | null) {
        this.setAttribute('command', value || '')
    }

    render() {
        this.className = `commands__list-item ${this.hide ? 'displayNone' : ''}`
        this.innerHTML = `
            <button class="commands__command">${this.command}</button>
        `;

        this.li = this as HTMLLIElement;
        this.button = this.firstElementChild as HTMLButtonElement;

        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this._callbackFn().then(() => {
                window.close()
            });
        })
    }
}

export const defineCommandElement = () => {
    customElements.define("actions-command", CommandElement, {extends: "li"})
}