export class FloatingWebPanelGeometrySettings {
  /**
   *
   * @param {string} sidebarPosition
   * @param {string} defaultFloatingOffsetCSS
   * @param {object} params
   * @param {string} params.anchor
   * @param {string} params.offsetXType
   * @param {string} params.offsetYType
   * @param {string} params.widthType
   * @param {string} params.heightType
   * @param {string} params.top
   * @param {string} params.left
   * @param {string} params.right
   * @param {string} params.bottom
   * @param {string} params.width
   * @param {string} params.height
   * @param {string} params.margin
   */
  constructor(
    sidebarPosition,
    defaultFloatingOffsetCSS,
    {
      anchor = "default",
      offsetXType = "absolute",
      offsetYType = "absolute",
      widthType = "absolute",
      heightType = "relative",
      top = defaultFloatingOffsetCSS,
      left = sidebarPosition === "left" ? defaultFloatingOffsetCSS : "unset",
      right = sidebarPosition === "right" ? defaultFloatingOffsetCSS : "unset",
      bottom = "unset",
      width = "600px",
      height = this.makeDefaultHeight(defaultFloatingOffsetCSS),
      margin = "unset",
    } = {},
  ) {
    this.anchor = anchor;
    this.offsetXType = offsetXType;
    this.offsetYType = offsetYType;
    this.widthType = widthType;
    this.heightType = heightType;
    this.top = top;
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.width = width;
    this.height = height;
    this.margin = margin;
  }

  /**
   *
   * @param {string} sidebarPosition
   * @param {string} defaultFloatingOffsetCSS
   * @param {object} object
   * @returns {FloatingWebPanelGeometrySettings}
   */
  static fromObject(sidebarPosition, defaultFloatingOffsetCSS, object) {
    return new FloatingWebPanelGeometrySettings(
      sidebarPosition,
      defaultFloatingOffsetCSS,
      object,
    );
  }

  /**
   *
   * @returns {object}
   */
  toObject() {
    return {
      anchor: this.anchor,
      offsetXType: this.offsetXType,
      offsetYType: this.offsetYType,
      widthType: this.widthType,
      heightType: this.heightType,
      top: this.top,
      left: this.left,
      right: this.right,
      bottom: this.bottom,
      width: this.width,
      height: this.height,
      margin: this.margin,
    };
  }

  /**
   *
   * @param {string} offsetCSS
   * @returns {string}
   */
  makeDefaultHeight(offsetCSS) {
    return `calc(100% - ${offsetCSS} * 2)`;
  }
}
