import { Browser } from "../xul/base/browser.mjs";
import { Tab } from "../xul/base/tab.mjs";

/**
 * @typedef {Object} URI
 * @property {string} scheme
 * @property {string} host
 * @property {string} spec
 * @property {string} specIgnoringRef
 */

/**
 * @typedef {Object} BrowserForTab
 * @property {HTMLElement} browser
 */

export class TabBrowserWrapper {
  #gBrowser;

  constructor(gBrowser) {
    this.#gBrowser = gBrowser;
  }

  get raw() {
    return this.#gBrowser;
  }

  /**
   * @returns {URI}
   */
  get currentURI() {
    return this.raw.currentURI;
  }

  /**
   * @returns {Array<Tab>}
   */
  get tabs() {
    return this.raw.tabs.map((tab) => new Tab({ element: tab }));
  }

  /**
   *
   * @param {Tab} tab
   * @returns {Browser}
   */
  getBrowserForTab(tab) {
    return new Browser({
      element: this.raw.getBrowserForTab(tab.getXUL()),
    });
  }

  /**
   *
   * @param {string} url
   * @param {object} options
   * @param {number} options.triggeringPrincipal
   * @returns {Tab}
   */
  addTab(url, options) {
    return new Tab({ element: this.raw.addTab(url, options) });
  }

  /**
   *
   * @param {Tab} tab
   */
  removeTab(tab) {
    this.raw.removeTab(tab.getXUL());
  }

  /**
   *
   * @param {Tab} tab
   * @param {boolean} force
   */
  discardBrowser(tab, force = false) {
    this.raw.discardBrowser(tab.getXUL(), force);
  }

  /**
   *
   * @param {number} index
   */
  selectTabAtIndex(index) {
    this.raw.selectTabAtIndex(index);
  }
}
