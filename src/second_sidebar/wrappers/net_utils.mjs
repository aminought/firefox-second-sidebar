/**
 * @typedef {Object} URI
 * @property {string} scheme
 * @property {string} host
 * @property {string} spec
 * @property {string} specIgnoringRef
 */

export class NetUtilWrapper {
  /**
   *
   * @param {string} url
   * @returns {URI}
   */
  static newURI(url) {
    return NetUtil.newURI(url);
  }
}
