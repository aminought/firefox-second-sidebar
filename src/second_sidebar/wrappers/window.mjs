import { TabBrowserWrapper } from "./tab_browser.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";

export class WindowWrapper {
  #window;
  #gBrowser;
  /**
   *
   * @param {Window} chromeWindow
   */
  constructor(chromeWindow = null) {
    this.#window = chromeWindow ?? window;
    this.#gBrowser = new TabBrowserWrapper(this.raw.gBrowser);
  }

  /**
   * @returns {Window}
   */
  get raw() {
    return this.#window;
  }

  /**
   * @returns {string}
   */
  get id() {
    return this.raw.__SSi;
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.raw.name;
  }

  /**
   * @returns {TabBrowserWrapper}
   */
  get gBrowser() {
    return this.#gBrowser;
  }

  /**
   * @returns {Document?}
   */
  get document() {
    return this.raw.document;
  }

  /**
   * @returns {XULElement?}
   */
  get documentElement() {
    const documentElement = this.document?.documentElement;
    if (documentElement) {
      return new XULElement({ element: documentElement });
    }
    return null;
  }

  /**
   * @returns {boolean}
   */
  get fullScreen() {
    return this.raw.fullScreen;
  }

  /**
   * @returns {number}
   */
  get mozInnerScreenX() {
    return this.raw.mozInnerScreenX;
  }

  /**
   * @returns {number}
   */
  get mozInnerScreenY() {
    return this.raw.mozInnerScreenY;
  }

  /**
   *
   * @param {Event} event
   * @returns {boolean}
   */
  dispatchEvent(event) {
    return this.raw.dispatchEvent(event);
  }

  /**
   *
   * @param {string} type
   * @param {function(Event):any} listener
   */
  addEventListener(type, listener) {
    this.raw.addEventListener(type, listener);
  }

  relinkTreeOwner() {
    this.raw.docShell.treeOwner
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIAppWindow).XULBrowserWindow =
      this.raw.XULBrowserWindow;
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
