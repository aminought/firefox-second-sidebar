export class FloatingWebPanelGeometrySettings {
  /**
   *
   * @param {string} sidebarPosition
   * @param {string} defaultFloatingOffsetCSS
   * @param {object} params
   * @param {string} params.anchor
   * @param {string} params.widthType
   * @param {string} params.heightType
   * @param {string} params.marginTop
   * @param {string} params.marginLeft
   * @param {string} params.marginRight
   * @param {string} params.marginBottom
   * @param {string} params.width
   * @param {string} params.height
   */
  constructor(
    sidebarPosition,
    defaultFloatingOffsetCSS,
    {
      anchor = "default",
      widthType = "absolute",
      heightType = "relative",
      marginTop = defaultFloatingOffsetCSS,
      marginLeft = sidebarPosition === "left"
        ? defaultFloatingOffsetCSS
        : "unset",
      marginRight = sidebarPosition === "right"
        ? defaultFloatingOffsetCSS
        : "unset",
      marginBottom = "unset",
      width = "400px",
      height = `calc(100% - ${defaultFloatingOffsetCSS} * 2)`,
    } = {},
  ) {
    this.anchor = anchor;
    this.widthType = widthType;
    this.heightType = heightType;
    this.marginTop = marginTop;
    this.marginRight = marginRight;
    this.marginLeft = marginLeft;
    this.marginBottom = marginBottom;
    this.width = width;
    this.height = height;
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
      widthType: this.widthType,
      heightType: this.heightType,
      marginTop: this.marginTop,
      marginLeft: this.marginLeft,
      marginRight: this.marginRight,
      marginBottom: this.marginBottom,
      width: this.width,
      height: this.height,
    };
  }
}
