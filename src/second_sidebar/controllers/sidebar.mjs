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
      this.resetFloatingSidebar(uuid, true, false, false);
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_WIDTH, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingSidebar(uuid, false, true, false);
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_HEIGHT, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingSidebar(uuid, false, false, true);
      if (isActiveWindow) {
        SidebarControllers.webPanelsController.saveSettings();
      }
    });

    listenEvent(SidebarEvents.RESET_SIDEBAR_FLOATING_ALL, (event) => {
      const { uuid, isActiveWindow } = event.detail;
      this.resetFloatingSidebar(uuid, true, true, true);
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
   * @param {string} anchor
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

    if (anchor == "default") anchor = this.getDefaultAnchor();
    if (anchor == "topleft") top = left = "0px";
    else if (anchor == "topright") top = right = "0px";
    else if (anchor == "bottomleft") bottom = left = "0px";
    else if (anchor == "bottomright") bottom = right = "0px";

    SidebarElements.sidebarBox
      .setProperty("top", top)
      .setProperty("left", left)
      .setProperty("right", right)
      .setProperty("bottom", bottom)
      .setProperty("margin-top", marginTop ?? "unset")
      .setProperty("margin-left", marginLeft ?? "unset")
      .setProperty("margin-right", marginRight ?? "unset")
      .setProperty("margin-bottom", marginBottom ?? "unset")
      .setProperty("width", width ?? "400px")
      .setProperty("height", height ?? "100%");
  }

  /**
   *
   * @param {string} uuid
   * @param {boolean} resetPosition
   * @param {boolean} resetWidth
   * @param {boolean} resetHeight
   */
  resetFloatingSidebar(uuid, resetPosition, resetWidth, resetHeight) {
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
   * @param {number?} top
   * @param {number?} left
   * @param {number?} width
   * @param {number?} height
   * @param {object} params
   * @param {boolean} params.widthChanged
   * @param {boolean} params.heightChanged
   */
  calculateAndSetFloatingPosition(
    top,
    left,
    width,
    height,
    { widthChanged = false, heightChanged = false } = {},
  ) {
    if (this.closed()) return;
    const areaRect = SidebarElements.sidebarBoxArea.getBoundingClientRect();
    const boxRect = SidebarElements.sidebarBox.getBoundingClientRect();

    const areaTop = 0;
    const areaLeft = 0;
    const areaRight = areaRect.right - areaRect.left;
    const areaBottom = areaRect.bottom - areaRect.top;

    if (typeof top === "undefined") top = boxRect.top;
    if (typeof left === "undefined") left = boxRect.left;
    if (typeof width === "undefined") width = boxRect.width;
    if (typeof height === "undefined") height = boxRect.height;

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
    }

    this.setFloatingPosition(
      anchor,
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      widthChanged
        ? width + "px"
        : SidebarElements.sidebarBox.getProperty("width"),
      heightChanged
        ? height + "px"
        : SidebarElements.sidebarBox.getProperty("height"),
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
      .setOpen(!SidebarControllers.collapseController.collapsed());
  }

  collapseToolbar() {
    SidebarElements.sidebarToolbar.setProperty(
      "margin-top",
      -SidebarElements.sidebarToolbar.getBoundingClientRect().height + "px",
    );
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
    );
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
