import { WindowWrapper } from "./window.mjs"; // eslint-disable-line no-unused-vars

export class SessionStoreWrapper {
  static get raw() {
    return SessionStore;
  }
  /**
   *
   * @param {WindowWrapper} window
   */
  static maybeDontRestoreTabs(window) {
    this.raw.maybeDontRestoreTabs(window.raw);
  }

  /**
   *
   * @returns {number}
   */
  static getWindowsCount() {
    return this.raw.getWindows().length;
  }
}
