import { SidebarEvents, listenEvent } from "./events.mjs";

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

    listenEvent(SidebarEvents.EDIT_SIDEBAR_PINNED_WIDTH, (event) => {
      const { uuid, width, isActiveWindow } = event.detail;

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      webPanelController.setPinnedWidth(width);
      if (webPanelController.isActive()) {
        this.setPinnedWidth(width);
      }

      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_FLOATING_POSITION, (event) => {
      const {
        uuid,
        marginTop,
        marginLeft,
        marginRight,
        marginBottom,
        width,
        height,
      } = event.detail;

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      webPanelController.setFloatingPosition(
        marginTop,
        marginLeft,
        marginRight,
        marginBottom,
        width,
        height,
      );
      if (webPanelController.isActive()) {
        this.setFloatingGeometry(
          webPanelController.getAnchor(),
          marginTop,
          marginLeft,
          marginRight,
          marginBottom,
          width,
          height,
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
   * @param {boolean} params.widthChanged
   * @param {boolean} params.heightChanged
   * @param {string} params.widthType
   * @param {string} params.heightType
   */
  calculateAndSetFloatingGeometry({
    top = null,
    left = null,
    width = null,
    height = null,
    widthChanged = false,
    heightChanged = false,
    widthType = "absolute",
    heightType = "relative",
  } = {}) {
    if (SidebarControllers.sidebarController.closed()) return;
    const areaRect = SidebarElements.sidebarBoxArea.getBoundingClientRect();
    const boxRect = SidebarElements.sidebarBox.getBoundingClientRect();

    const areaTop = 0;
    const areaLeft = 0;
    const areaRight = areaRect.right - areaRect.left;
    const areaBottom = areaRect.bottom - areaRect.top;

    if (top === null) top = boxRect.top;
    if (left === null) left = boxRect.left;
    if (width === null) width = boxRect.width;
    if (height === null) height = boxRect.height;

    top -= areaRect.top;
    left -= areaRect.left;

    // left border
    if (left < areaLeft) {
      left = areaLeft;
      if (widthChanged) {
        width = boxRect.right - areaRect.left;
      }
    }

    // right border
    if (left + width > areaRight) {
      if (widthChanged) {
        width = areaRight - left;
      } else {
        left = areaRight - width;
      }
    }

    // top border
    if (top < 0) {
      height = boxRect.height;
      top = areaTop;
    }

    // bottom border
    if (top + height > areaBottom) {
      if (heightChanged) {
        height = areaBottom - top;
      } else {
        top = areaBottom - height;
      }
    }

    const webPanelController =
      SidebarControllers.webPanelsController.getActive();
    let anchor = webPanelController.getAnchor();

    let marginTop, marginLeft, marginRight, marginBottom;
    marginTop = marginLeft = marginRight = marginBottom = "unset";

    // calculate margins
    if (anchor == "default") anchor = this.getDefaultAnchor();
    if (anchor === "topright") {
      marginTop = `${top}px`;
      marginRight = `${areaRight - left - width}px`;
    } else if (anchor == "topleft") {
      marginTop = `${top}px`;
      marginLeft = `${left}px`;
    } else if (anchor == "bottomleft") {
      marginBottom = `${areaBottom - top - height}px`;
      marginLeft = `${left}px`;
    } else if (anchor == "bottomright") {
      marginBottom = `${areaBottom - top - height}px`;
      marginRight = `${areaRight - left - width}px`;
    } else if (anchor == "center") {
      marginTop = marginLeft = marginRight = marginBottom = "auto";
    }

    // calculate width
    if (widthChanged) {
      width =
        widthType === "absolute"
          ? width + "px"
          : `${(width / areaRect.width) * 100}%`;
    } else {
      width = SidebarElements.sidebarBox.getProperty("width");
    }

    // calculate height
    if (heightChanged) {
      height =
        heightType === "absolute"
          ? height + "px"
          : `${(height / areaRect.height) * 100}%`;
    } else {
      height = SidebarElements.sidebarBox.getProperty("height");
    }

    this.setFloatingGeometry(
      anchor,
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      width,
      height,
    );
  }

  /**
   * @param {string} anchor_
   * @param {string?} marginTop
   * @param {string?} marginLeft
   * @param {string?} marginRight
   * @param {string?} marginBottom
   * @param {string?} width
   * @param {string?} height
   */
  setFloatingGeometry(
    anchor,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    width,
    height,
  ) {
    let top, left, right, bottom;
    top = left = right = bottom = "unset";

    let resolvedAnchor = anchor;
    if (resolvedAnchor == "default") resolvedAnchor = this.getDefaultAnchor();
    if (resolvedAnchor == "topleft") top = left = "0px";
    else if (resolvedAnchor == "topright") top = right = "0px";
    else if (resolvedAnchor == "bottomleft") bottom = left = "0px";
    else if (resolvedAnchor == "bottomright") bottom = right = "0px";
    else if (resolvedAnchor == "center") top = left = right = bottom = 0;

    marginTop = marginTop ?? "unset";
    marginLeft = marginLeft ?? "unset";

    const margin = marginTop !== "unset" ? marginTop : marginBottom;
    width = width ?? "400px";
    height = height ?? `calc(100% - ${margin} * 2)`;

    SidebarElements.sidebarBox
      .setProperty("top", top)
      .setProperty("left", left)
      .setProperty("right", right)
      .setProperty("bottom", bottom)
      .setProperty("margin-top", marginTop)
      .setProperty("margin-left", marginLeft)
      .setProperty("margin-right", marginRight)
      .setProperty("margin-bottom", marginBottom)
      .setProperty("width", width)
      .setProperty("height", height);
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
    const padding = this.getDefaultFloatingOffsetCSS();
    const anchor = resetPosition ? "default" : webPanelController.getAnchor();
    const marginTop = resetPosition
      ? padding
      : SidebarElements.sidebarBox.getProperty("margin-top");
    const marginLeft = resetPosition
      ? position === "left"
        ? padding
        : "unset"
      : SidebarElements.sidebarBox.getProperty("margin-left");
    const marginRight = resetPosition
      ? position === "right"
        ? padding
        : "unset"
      : SidebarElements.sidebarBox.getProperty("margin-right");
    const marginBottom = resetPosition
      ? "unset"
      : SidebarElements.sidebarBox.getProperty("margin-bottom");
    const width = resetWidth
      ? "400px"
      : SidebarElements.sidebarBox.getProperty("width");
    const margin = marginTop !== "unset" ? marginTop : marginBottom;
    const height = resetHeight
      ? `calc(100% - ${margin} * 2)`
      : SidebarElements.sidebarBox.getProperty("height");
    webPanelController.setAnchor(anchor);
    if (resetWidth) webPanelController.setWidthType("absolute");
    if (resetHeight) webPanelController.setHeightType("relative");
    webPanelController.setFloatingPosition(
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      width,
      height,
    );
    this.setFloatingGeometry(
      anchor,
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      width,
      height,
    );
    if (webPanelController.isActive()) {
      SidebarControllers.webPanelsController.saveSettings();
    }
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
   * @param {number} width
   */
  setPinnedWidth(width) {
    SidebarElements.sidebarBox.setProperty("width", `${width}px`);
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
