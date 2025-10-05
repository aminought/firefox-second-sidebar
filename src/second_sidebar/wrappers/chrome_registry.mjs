import { NetUtilWrapper } from "./net_utils.mjs";

export class ChromeRegistry {
  static #raw = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(
    Ci.nsIChromeRegistry,
  );

  /**
   *
   * @param {string} url
   * @returns {any}
   */
  static convertChromeURL(url) {
    const uri = NetUtilWrapper.newURI(url);
    return this.#raw.convertChromeURL(uri);
  }
}
