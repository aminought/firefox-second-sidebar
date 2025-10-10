export class PinnedWebPanelGeometrySettings {
  /**
   *
   * @param {object} params
   * @param {string} params.width
   */
  constructor({ width = "400px" } = {}) {
    this.width = width;
  }

  /**
   *
   * @param {object} object
   * @returns {PinnedWebPanelGeometrySettings}
   */
  static fromObject(object) {
    return new PinnedWebPanelGeometrySettings(object);
  }

  /**
   *
   * @returns {object}
   */
  toObject() {
    return { width: this.width };
  }
}
