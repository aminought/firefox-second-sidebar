export class FullZoomWrapper {
  /**
   *
   * @param {number} value
   * @param {HTMLElement} element
   */
  static setZoom(value, element) {
    FullZoom.setZoom(value, element);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {number} value
   */
  static changeZoomBy(element, value) {
    FullZoom.changeZoomBy(element, value);
  }
}
