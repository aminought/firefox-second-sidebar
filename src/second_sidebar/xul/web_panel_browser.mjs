import { Browser } from "./base/browser.mjs";

const MOBILE_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36";

export class WebPanelBrowser extends Browser {
  /**
   *
   * @param {HTMLElement} element
   */
  constructor(element) {
    super({ element });
  }

  /**
   *
   * @returns {WebPanelBrowser}
   */
  setMobileUserAgent() {
    return this.setCustomUserAgent(MOBILE_USER_AGENT);
  }

  /**
   *
   * @returns {WebPanelBrowser}
   */
  unsetMobileUserAgent() {
    return this.setCustomUserAgent("");
  }
}
