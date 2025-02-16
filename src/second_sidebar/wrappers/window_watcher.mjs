import { WindowWrapper } from "./window.mjs";

export class WindowWatcherWrapper {
  /**
   *
   * @returns {Array<WindowWrapper>}
   */
  static getWindowEnumerator() {
    return Array.from(Services.ww.getWindowEnumerator()).map(
      (window) => new WindowWrapper(window),
    );
  }

  /**
   *
   * @param {string} name
   * @returns {WindowWrapper}
   */
  static getWindowByName(name) {
    return new WindowWrapper(Services.ww.getWindowByName(name));
  }
}
