/* eslint-disable no-unused-vars */
import { WindowWrapper } from "./window.mjs";
/* eslint-enable no-unused-vars */

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
}
