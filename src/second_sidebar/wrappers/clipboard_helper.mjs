export class ClipboardHelperWrapper {
  static clipboardHelper = Cc[
    "@mozilla.org/widget/clipboardhelper;1"
  ].getService(Ci.nsIClipboardHelper);

  /**
   *
   * @param {string} value
   */
  static copyString(value) {
    this.clipboardHelper.copyString(value);
  }
}
