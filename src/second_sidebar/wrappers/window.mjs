import { TabBrowserWrapper } from "./tab_browser.mjs";

export class WindowWrapper {
  #window;
  /**
   *
   * @param {Window} chromeWindow
   */
  constructor(chromeWindow = null) {
    this.#window = chromeWindow ?? window;
    this.gBrowser = new TabBrowserWrapper(this.#window.gBrowser);
  }

  /**
   * @returns {Document}
   */
  get document() {
    return this.#window.document;
  }

  /**
   *
   * @param {Event} event
   * @returns {boolean}
   */
  dispatchEvent(event) {
    return this.#window.dispatchEvent(event);
  }

  /**
   *
   * @param {string} type
   * @param {function(Event):any} listener
   */
  addEventListener(type, listener) {
    this.#window.addEventListener(type, listener);
  }

  /**
   * @param {WindowWrapper} lhs
   * @param {WindowWrapper} rhs
   * @returns {boolean}
   */
  static isEqual(lhs, rhs) {
    return lhs.#window === rhs.#window;
  }
}
