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
  constructor(gBrowser) {
    this.gBrowser = gBrowser;
  }

  /**
   * @returns {URI}
   */
  get currentURI() {
    return this.gBrowser.currentURI;
  }

  /**
   * @returns {Array<Tab>}
   */
  get tabs() {
    return this.gBrowser.tabs.map((tab) => new Tab({ element: tab }));
  }

  /**
   *
   * @param {Tab} tab
   * @returns {Browser}
   */
  getBrowserForTab(tab) {
    return new Browser({
      element: this.gBrowser.getBrowserForTab(tab.getXUL()),
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
    return new Tab({ element: this.gBrowser.addTab(url, options) });
  }

  /**
   *
   * @param {Tab} tab
   */
  removeTab(tab) {
    this.gBrowser.removeTab(tab.getXUL());
  }

  /**
   *
   * @param {Tab} tab
   * @param {boolean} force
   */
  discardBrowser(tab, force = false) {
    this.gBrowser.discardBrowser(tab.getXUL(), force);
  }

  /**
   *
   * @param {number} index
   */
  selectTabAtIndex(index) {
    this.gBrowser.selectTabAtIndex(index);
  }
}
