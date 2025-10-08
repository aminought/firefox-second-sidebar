import {
  SidebarEvents,
  WebPanelEvents,
  listenEvent,
  sendEvents,
} from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { SidebarSettings } from "../settings/sidebar_settings.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { changeContainerBorder } from "../utils/containers.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

export class SidebarController {
  constructor() {
    this.root = new XULElement({ element: document.documentElement });

    this.#setupListeners();

    this.containerBorder = "left";
    this.autoHideSidebar = false;
    this.hideSidebarAnimated = false;
    this.hideToolbarAnimated = true;
    this.defaultFloatingOffset = "small";
  }

  #setupListeners() {
    /** @param {MouseEvent} event */
    this.onClickOutsideWhileFloating = (event) => {
      const target = new XULElement({ element: event.target });
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();

      if (
        webPanelController &&
        isLeftMouseButton(event) &&
        !webPanelController.getAlwaysOnTop() &&
        !SidebarElements.webPanelsBrowser.activeWebPanelContains(target) &&
        !SidebarElements.sidebarBox.contains(target) &&
        !SidebarElements.sidebarSplitter.contains(target) &&
        !SidebarElements.webPanelPopupEdit.contains(target) &&
        !SidebarElements.sidebarMainPopupSettings.contains(target) &&
        !SidebarElements.sidebarMainMenuPopup.contains(target) &&
        !SidebarElements.webPanelMenuPopup.contains(target)
      ) {
        this.close();
      }
    };

    const addWebPanelButtonListener = (event, callback) => {
      if (isLeftMouseButton(event)) {
        const webPanelController =
          SidebarControllers.webPanelsController.getActive();
        return callback(webPanelController);
      }
    };

    SidebarElements.sidebarToolbar.listenBackButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goBack(),
      );
    });
    SidebarElements.sidebarToolbar.listenForwardButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goForward(),
      );
    });
    SidebarElements.sidebarToolbar.listenReloadButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.reload(),
      );
    });
    SidebarElements.sidebarToolbar.listenHomeButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goHome(),
      );
    });

    SidebarElements.sidebarToolbar.listenPinButtonClick(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_PINNED, {
        uuid: webPanelController.getUUID(),
        pinned: !webPanelController.pinned(),
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);
    });

    SidebarElements.sidebarToolbar.listenCloseButtonClick(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      this.close();
      webPanelController.unload();
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_POSITION, (event) => {
      const value = event.detail.value;
      SidebarElements.sidebarWrapper.setPosition(value);
      SidebarElements.sidebarBoxArea.updatePosition();
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_PADDING, (event) => {
      const value = event.detail.value;
      SidebarControllers.sidebarMainController.setPadding(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_NEW_WEB_PANEL_POSITION, (event) => {
      const value = event.detail.value;
      SidebarControllers.webPanelNewController.setNewWebPanelPosition(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_DEFAULT_FLOATING_OFFSET, (event) => {
      const value = event.detail.value;
      this.setDefaultFloatingOffset(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_BACK_BUTTON, (event) => {
      const value = event.detail.value;
      SidebarElements.sidebarToolbar
        .setAutoHideBackButton(value)
        .toggleBackButton(value);
    });

    listenEvent(
      SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_FORWARD_BUTTON,
      (event) => {
        const value = event.detail.value;
        SidebarElements.sidebarToolbar
          .setAutoHideForwardButton(value)
          .toggleForwardButton(value);
      },
    );

    listenEvent(SidebarEvents.EDIT_SIDEBAR_CONTAINER_BORDER, (event) => {
      const value = event.detail.value;
      this.setContainerBorder(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE, (event) => {
      const value = event.detail.value;
      this.setAutoHideSidebar(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_ANIMATED, (event) => {
      const value = event.detail.value;
      this.hideSidebarAnimated = value;
    });

    listenEvent(SidebarEvents.EDIT_TOOLBAR_AUTO_HIDE_ANIMATED, (event) => {
      const value = event.detail.value;
      this.setHideToolbarAnimated(value);
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
        this.setFloatingPosition(
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
      this.resetFloatingSidebar(uuid, { resetPosition: true });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_WIDTH, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingSidebar(uuid, { resetWidth: true });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_HEIGHT, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingSidebar(uuid, { resetHeight: true });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_ALL, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingSidebar(uuid, {
        resetPosition: true,
        resetWidth: true,
        resetHeight: true,
      });
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.SAVE_SIDEBAR, (event) => {
      const isActiveWindow = event.detail.isActiveWindow;
      if (isActiveWindow) {
        this.saveSettings();
      }
    });
  }

  /**
   *
   * @param {boolean} pinned
   * @param {string?} anchor
   * @param {string?} marginTop
   * @param {string?} marginLeft
   * @param {string?} marginRight
   * @param {string?} marginBottom
   * @param {string?} width
   * @param {string?} height
   * @param {boolean} canGoBack
   * @param {boolean} canGoForward
   * @param {string} title
   * @param {boolean} hideToolbar
   */
  open(
    pinned,
    anchor,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    width,
    height,
    canGoBack,
    canGoForward,
    title,
    hideToolbar,
  ) {
    SidebarControllers.sidebarToolbarCollapser.clearTimers();
    this.setFloatingPosition(
      anchor,
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      width,
      height,
    );
    SidebarElements.sidebarBox.show();
    SidebarElements.sidebarToolbar
      .toggleBackButton(!canGoBack)
      .toggleForwardButton(!canGoForward)
      .setTitle(title);
    hideToolbar ? this.collapseToolbar() : this.uncollapseToolbar();
    pinned ? this.pin() : this.unpin();
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
  setFloatingPosition(
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
  resetFloatingSidebar(
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
    this.setFloatingPosition(
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

  close() {
    SidebarControllers.sidebarToolbarCollapser.clearTimers();
    SidebarElements.sidebarBox.hide();
    SidebarElements.sidebarSplitter.hide();
    SidebarControllers.webPanelsController.close();
  }

  /**
   *
   * @returns {boolean}
   */
  closed() {
    return (
      SidebarElements.sidebarBox.hidden() &&
      SidebarElements.sidebarSplitter.hidden()
    );
  }

  pin() {
    SidebarElements.sidebarBox.setAttribute("pinned", true);
    SidebarElements.sidebarSplitter.show();
    SidebarElements.afterSplitter.show();
    SidebarElements.sidebarToolbar.changePinButton(true);
    document.removeEventListener("click", this.onClickOutsideWhileFloating);
  }

  unpin() {
    SidebarElements.sidebarBox.setAttribute("pinned", false);
    SidebarElements.sidebarSplitter.hide();
    SidebarElements.afterSplitter.hide();
    SidebarElements.sidebarToolbar.changePinButton(false);
    document.addEventListener("click", this.onClickOutsideWhileFloating);
  }

  /**
   *
   * @returns {boolean}
   */
  pinned() {
    return SidebarElements.sidebarBox.getAttribute("pinned") == "true";
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
  calculateAndSetFloatingPosition({
    top = null,
    left = null,
    width = null,
    height = null,
    widthChanged = false,
    heightChanged = false,
    widthType = "absolute",
    heightType = "relative",
  } = {}) {
    if (this.closed()) return;
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

    this.setFloatingPosition(
      anchor,
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      widthType === "absolute"
        ? width + "px"
        : `${(width / areaRect.width) * 100}%`,
      heightType === "absolute"
        ? height + "px"
        : `${(height / areaRect.height) * 100}%`,
    );
  }

  /**
   *
   * @param {string} value
   */
  setContainerBorder(value) {
    this.containerBorder = value;
    changeContainerBorder(value);
  }

  /**
   *
   * @param {boolean} value
   */
  setAutoHideSidebar(value) {
    this.autoHideSidebar = value;
    SidebarElements.sidebarCollapseButton
      .setDisabled(value)
      .setOpen(!SidebarControllers.sidebarMainCollapser.collapsed());
  }

  /**
   *
   * @returns {boolean}
   */
  getHideToolbarAnimated() {
    return this.hideToolbarAnimated;
  }

  /**
   *
   * @param {boolean} value
   */
  setHideToolbarAnimated(value) {
    this.hideToolbarAnimated = value;
    SidebarElements.sidebarToolbar.setAttribute("shouldAnimate", value);
  }

  collapseToolbar() {
    const height =
      SidebarElements.sidebarToolbar.getBoundingClientRect().height;
    SidebarElements.sidebarToolbar.setProperty("margin-top", -height + "px");
  }

  uncollapseToolbar() {
    SidebarElements.sidebarToolbar.setProperty("margin-top", "0px");
  }

  /**
   *
   * @returns {boolean}
   */
  toolbarCollapsed() {
    const zeros = ["0px", ""];
    const marginTop = SidebarElements.sidebarToolbar.getProperty("margin-top");
    return !zeros.includes(marginTop);
  }

  /**
   *
   * @param {SidebarSettings} settings
   */
  loadSettings(settings) {
    SidebarElements.sidebarWrapper.setPosition(settings.position);
    SidebarControllers.sidebarMainController.setPadding(settings.padding);
    SidebarControllers.webPanelNewController.setNewWebPanelPosition(
      settings.newWebPanelPosition,
    );
    this.setDefaultFloatingOffset(settings.defaultFloatingOffset);
    SidebarElements.sidebarToolbar.setAutoHideBackButton(
      settings.autoHideBackButton,
    );
    SidebarElements.sidebarToolbar.setAutoHideForwardButton(
      settings.autoHideForwardButton,
    );
    this.setContainerBorder(settings.containerBorder);
    this.setAutoHideSidebar(settings.autoHideSidebar);
    this.hideSidebarAnimated = settings.hideSidebarAnimated;
    this.setHideToolbarAnimated(settings.hideToolbarAnimated);
  }

  /**
   *
   * @returns {SidebarSettings}
   */
  dumpSettings() {
    return new SidebarSettings(
      SidebarElements.sidebarWrapper.getPosition(),
      SidebarControllers.sidebarMainController.getPadding(),
      SidebarControllers.webPanelNewController.getNewWebPanelPosition(),
      this.getDefaultFloatingOffset(),
      SidebarElements.sidebarToolbar.getAutoHideBackButton(),
      SidebarElements.sidebarToolbar.getAutoHideForwardButton(),
      this.containerBorder,
      this.autoHideSidebar,
      this.hideSidebarAnimated,
      this.getHideToolbarAnimated(),
    );
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
