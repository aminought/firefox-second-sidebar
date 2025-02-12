export class ZoomManagerWrapper {
  /**@type {number} */
  static MIN = ZoomManager.MIN;
  /**@type {number} */
  static MAX = ZoomManager.MAX;

  /**
   *
   * @param {HTMLElement} browser
   * @returns {number}
   */
  static getZoomForBrowser(browser) {
    return ZoomManager.getZoomForBrowser(browser);
  }
}
