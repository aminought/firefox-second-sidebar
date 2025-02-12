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

export class gBrowserWrapper {
  /**
   * @returns {URI}
   */
  static get currentURI() {
    return gBrowser.currentURI;
  }

  /**
   *
   * @param {HTMLElement} tab
   * @param {object} properties
   * @returns {BrowserForTab}
   */
  static createBrowserForTab(tab, properties) {
    return gBrowser._createBrowserForTab(tab, properties);
  }
}
