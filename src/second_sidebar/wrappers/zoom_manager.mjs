import { Browser } from "../xul/base/browser.mjs";

export class ZoomManagerWrapper {
  /**@type {number} */
  static MIN = ZoomManager.MIN;
  /**@type {number} */
  static MAX = ZoomManager.MAX;

  /**
   *
   * @param {Browser} browser
   * @returns {number}
   */
  static getZoomForBrowser(browser) {
    return ZoomManager.getZoomForBrowser(browser.getXUL());
  }

  /**
   *
   * @param {Browser} browser
   * @param {number} value
   */
  static setZoomForBrowser(browser, value) {
    return ZoomManager.setZoomForBrowser(browser.getXUL(), value);
  }
}
