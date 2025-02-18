import { WindowWrapper } from "./window.mjs";

export class WindowWatcherWrapper {
  /**
   *
   * @returns {Array<WindowWrapper>}
   */
  static getWindowEnumerator() {
    return Array.from(this.raw.getWindowEnumerator()).map(
      (window) => new WindowWrapper(window),
    );
  }

  /**
   *
   * @param {string} name
   * @returns {WindowWrapper}
   */
  static getWindowByName(name) {
    return new WindowWrapper(this.raw.getWindowByName(name));
  }

  static get raw() {
    return Services.ww;
  }
}
