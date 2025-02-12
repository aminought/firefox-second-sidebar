export class WindowManagerWrapper {
  /**
   *
   * @returns {Window}
   */
  static getMostRecentBrowserWindow() {
    return Services.wm.getMostRecentBrowserWindow();
  }
}
