import { SidebarEvents, listenEvent } from "./events.mjs";

import { FloatingWebPanelGeometrySettings } from "../settings/floating_web_panel_geometry_settings.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarGeometry {
  constructor() {
    this.#setupListeners();

    this.defaultFloatingOffset = "small";
    this.enableSidebarBoxHint = false;
  }

  #setupListeners() {
    listenEvent(SidebarEvents.EDIT_SIDEBAR_DEFAULT_FLOATING_OFFSET, (event) => {
      const value = event.detail.value;
      this.setDefaultFloatingOffset(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_PINNED_GEOMETRY, (event) => {
      const { uuid, width } = event.detail;

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      webPanelController.setPinnedGeometry(width);
      if (webPanelController.isActive()) {
        this.setPinnedGeometry(width);
      }
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_FLOATING_GEOMETRY, (event) => {
      const { uuid, top, left, right, bottom, width, height, margin } =
        event.detail;

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      webPanelController.setFloatingGeometry(
        top,
        left,
        right,
        bottom,
        width,
        height,
        margin,
      );
      if (webPanelController.isActive()) {
        this.setFloatingGeometry(
          webPanelController.getAnchor(),
          top,
          left,
          right,
          bottom,
          width,
          height,
          margin,
        );
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_POSITION, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingGeometry(uuid, { resetPosition: true });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_WIDTH, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingGeometry(uuid, { resetWidth: true });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_HEIGHT, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingGeometry(uuid, { resetHeight: true });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_ALL, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingGeometry(uuid, {
        resetPosition: true,
        resetWidth: true,
        resetHeight: true,
      });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_ENABLE_BOX_HINT, (event) => {
      const value = event.detail.value;
      this.setEnableSidebarBoxHint(value);
    });
  }

  /**
   *
   * @param {object} params
   * @param {number?} params.top
   * @param {number?} params.left
   * @param {number?} params.width
   * @param {number?} params.height
   * @param {boolean} params.forceUpdate
   */
  calculateAndSetFloatingGeometry({
    top = null,
    left = null,
    width = null,
    height = null,
    forceUpdate = false,
  } = {}) {
    if (SidebarControllers.sidebarController.closed()) return;
    const areaRect = SidebarElements.sidebarBoxArea.getBoundingClientRect();
    const boxRect = SidebarElements.sidebarBox.getBoundingClientRect();

    const areaTop = 0;
    const areaLeft = 0;
    const areaRight = areaRect.right - areaRect.left;
    const areaBottom = areaRect.bottom - areaRect.top;

    const sameWidth = width === null;
    const sameHeight = height === null;

    if (top === null) top = boxRect.top;
    if (left === null) left = boxRect.left;
    if (width === null) width = boxRect.width;
    if (height === null) height = boxRect.height;

    top -= areaRect.top;
    left -= areaRect.left;

    // check left border
    if (left < areaLeft) {
      left = areaLeft;
      if (!sameWidth || forceUpdate) {
        width = boxRect.right - areaRect.left;
      }
    }
    // check right border
    if (left + width > areaRight) {
      if (sameWidth || forceUpdate) {
        left = areaRight - width;
      } else {
        width = areaRight - left;
      }
    }
    // check top border
    if (top < 0) {
      height = boxRect.height;
      top = areaTop;
    }
    // check bottom border
    if (top + height > areaBottom) {
      if (sameHeight || forceUpdate) {
        top = areaBottom - height;
      } else {
        height = areaBottom - top;
      }
    }

    const convert = (value, type, dimension) => {
      if (type === "absolute") {
        return value + "px";
      } else {
        return `${(value / dimension) * 100}%`;
      }
    };

    const webPanelController =
      SidebarControllers.webPanelsController.getActive();
    const offsetXType = webPanelController.getOffsetXType();
    const offsetYType = webPanelController.getOffsetYType();
    const widthType = webPanelController.getWidthType();
    const heightType = webPanelController.getHeightType();
    let anchor = webPanelController.getAnchor();

    let right, bottom;
    let margin = "unset";

    // calculate bounds
    if (anchor == "default") anchor = this.getDefaultAnchor();
    if (anchor == "topleft") {
      top = convert(top, offsetYType, areaRect.height);
      left = convert(left, offsetXType, areaRect.width);
      right = bottom = "unset";
    } else if (anchor === "topright") {
      top = convert(top, offsetYType, areaRect.height);
      right = convert(areaRight - left - width, offsetXType, areaRect.width);
      left = bottom = "unset";
    } else if (anchor == "bottomleft") {
      bottom = convert(areaBottom - top - height, offsetYType, areaRect.height);
      left = convert(left, offsetXType, areaRect.width);
      top = right = "unset";
    } else if (anchor == "bottomright") {
      bottom = convert(areaBottom - top - height, offsetYType, areaRect.height);
      right = convert(areaRight - left - width, offsetXType, areaRect.width);
      top = left = "unset";
    } else if (anchor == "center") {
      top = left = right = bottom = "0";
      margin = "auto";
    }

    // calculate width
    if (sameWidth && !forceUpdate) {
      width = SidebarElements.sidebarBox.getProperty("width");
    } else {
      width = convert(width, widthType, areaRect.width);
    }

    // calculate height
    if (sameHeight && !forceUpdate) {
      height = SidebarElements.sidebarBox.getProperty("height");
    } else {
      height = convert(height, heightType, areaRect.height);
    }

    this.setFloatingGeometry(
      anchor,
      top,
      left,
      right,
      bottom,
      width,
      height,
      margin,
    );
  }

  loadAndSetFloatingGeometry() {
    const webPanelController =
      SidebarControllers.webPanelsController.getActive();
    const geometry = webPanelController.getFloatingGeometry();
    this.setFloatingGeometry(
      geometry.anchor,
      geometry.top,
      geometry.left,
      geometry.right,
      geometry.bottom,
      geometry.width,
      geometry.height,
      geometry.margin,
    );
  }

  /**
   * @param {string} anchor
   * @param {string} top
   * @param {string} left
   * @param {string} right
   * @param {string} bottom
   * @param {string} width
   * @param {string} height
   * @param {string} margin
   */
  setFloatingGeometry(anchor, top, left, right, bottom, width, height, margin) {
    if (anchor == "default") anchor = this.getDefaultAnchor();
    if (anchor == "topleft") right = bottom = "unset";
    else if (anchor == "topright") left = bottom = "unset";
    else if (anchor == "bottomleft") top = right = "unset";
    else if (anchor == "bottomright") top = left = "unset";
    else if (anchor == "center") {
      top = left = right = bottom = 0;
      margin = "auto";
    }
    SidebarElements.sidebarBox
      .setProperty("top", top)
      .setProperty("left", left)
      .setProperty("right", right)
      .setProperty("bottom", bottom)
      .setProperty("width", width)
      .setProperty("height", height)
      .setProperty("margin", margin);
  }

  /**
   *
   * @param {string} uuid
   * @param {object} params
   * @param {boolean} params.resetPosition
   * @param {boolean} params.resetWidth
   * @param {boolean} params.resetHeight
   */
  resetFloatingGeometry(
    uuid,
    { resetPosition = false, resetWidth = false, resetHeight = false } = {},
  ) {
    const webPanelController = SidebarControllers.webPanelsController.get(uuid);
    const position = SidebarElements.sidebarWrapper.getPosition();
    const geometry = webPanelController.getFloatingGeometry();
    const defaultOffset = this.getDefaultFloatingOffsetCSS();
    const defaultGeometry = new FloatingWebPanelGeometrySettings(
      position,
      defaultOffset,
    );

    if (resetPosition) {
      geometry.anchor = defaultGeometry.anchor;
      geometry.offsetXType = defaultGeometry.offsetXType;
      geometry.offsetYType = defaultGeometry.offsetYType;
      geometry.top = defaultGeometry.top;
      geometry.left = defaultGeometry.left;
      geometry.right = defaultGeometry.right;
      geometry.bottom = defaultGeometry.bottom;
      geometry.margin = defaultGeometry.margin;
    }
    if (resetWidth) {
      geometry.widthType = defaultGeometry.widthType;
      geometry.width = defaultGeometry.width;
    }
    if (resetHeight) {
      const offset = geometry.top !== "unset" ? geometry.top : geometry.bottom;
      geometry.heightType = defaultGeometry.heightType;
      geometry.height = defaultGeometry.makeDefaultHeight(offset);
    }

    webPanelController.setAnchor(geometry.anchor);
    webPanelController.setOffsetXType(geometry.offsetXType);
    webPanelController.setOffsetYType(geometry.offsetYType);
    webPanelController.setWidthType(geometry.widthType);
    webPanelController.setHeightType(geometry.heightType);
    webPanelController.setFloatingGeometry(
      geometry.top,
      geometry.left,
      geometry.right,
      geometry.bottom,
      geometry.width,
      geometry.height,
      geometry.margin,
    );
    this.setFloatingGeometry(
      geometry.anchor,
      geometry.top,
      geometry.left,
      geometry.right,
      geometry.bottom,
      geometry.width,
      geometry.height,
      geometry.margin,
    );
    if (webPanelController.isActive()) {
      SidebarControllers.webPanelsController.saveSettings();
    }
  }

  loadAndSetPinnedGeometry() {
    const webPanelController =
      SidebarControllers.webPanelsController.getActive();
    const geometry = webPanelController.getPinnedGeometry();
    this.setPinnedGeometry(geometry.width);
  }

  /**
   *
   * @param {string?} width
   */
  setPinnedGeometry(width) {
    const defaultGeometry = new FloatingWebPanelGeometrySettings(
      SidebarElements.sidebarWrapper.getPosition(),
      this.getDefaultFloatingOffsetCSS,
    );
    width ??= defaultGeometry.width;
    SidebarElements.sidebarBox.setProperty("width", width);
  }

  /**
   *
   * @returns {string}
   */
  getDefaultAnchor() {
    const position = SidebarElements.sidebarWrapper.getPosition();
    return position == "left" ? "topleft" : "topright";
  }

  /**
   *
   * @returns {string}
   */
  getDefaultFloatingOffset() {
    return this.defaultFloatingOffset;
  }

  /**
   *
   * @returns {string}
   */
  getDefaultFloatingOffsetCSS() {
    return `var(--space-${this.getDefaultFloatingOffset()})`;
  }

  /**
   *
   * @param {string} value
   */
  setDefaultFloatingOffset(value) {
    this.defaultFloatingOffset = value;
  }

  /**
   *
   * @returns {boolean}
   */
  getEnableSidebarBoxHint() {
    return this.enableSidebarBoxHint;
  }

  /**
   *
   * @param {boolean} value
   */
  setEnableSidebarBoxHint(value) {
    this.enableSidebarBoxHint = value;
  }
}
