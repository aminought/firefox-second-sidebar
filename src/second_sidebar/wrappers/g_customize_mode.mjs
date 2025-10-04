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

  /**
   *
   * @param {any} wrapper
   */
  static unwrapToolbarItem(wrapper) {
    gCustomizeMode.unwrapToolbarItem(wrapper);
  }
}
