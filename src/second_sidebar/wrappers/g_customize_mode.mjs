export class gCustomizeModeWrapper {
  static enter() {
    gCustomizeMode.enter();
  }

  /**
   * @returns {boolean}
   */
  static get _customizing() {
    return gCustomizeMode._customizing;
  }
}
