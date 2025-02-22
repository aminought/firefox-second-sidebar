/* eslint-disable no-unused-vars */
import { Browser } from "../xul/base/browser.mjs";
/* eslint-enable no-unused-vars */

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

  /**
   * @returns {Array<number>}
   */
  static get zoomValues() {
    return ZoomManager.zoomValues;
  }

  /**
   *
   * @param {number} value
   * @returns {number}
   */
  static snap(value) {
    return ZoomManager.snap(value);
  }
}
