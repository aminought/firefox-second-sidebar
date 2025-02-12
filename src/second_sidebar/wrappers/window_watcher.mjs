export class WindowWatcherWrapper {
  /**
   *
   * @returns {Array<Window>}
   */
  static getWindowEnumerator() {
    return Array.from(Services.ww.getWindowEnumerator());
  }
}
