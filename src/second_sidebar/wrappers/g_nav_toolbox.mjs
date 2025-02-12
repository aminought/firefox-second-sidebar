export class gNavToolboxWrapper {
  /**
   *
   * @param {string} type
   * @param {function(Event):void} listener
   */
  static addEventListener(type, listener) {
    gNavToolbox.addEventListener(type, listener);
  }
}
