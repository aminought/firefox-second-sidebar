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

    this.hideInPopupWindows = false;
    this.containerBorder = "left";
    this.autoHideSidebar = false;
    this.hideSidebarAnimated = false;
  }

  #setupListeners() {
    /** @param {MouseEvent} event */
    this.onClickOutsideWhileUnpinned = (event) => {
      const target = new XULElement({ element: event.target });

      if (
        isLeftMouseButton(event) &&
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

    listenEvent(SidebarEvents.EDIT_SIDEBAR_UNPINNED_PADDING, (event) => {
      const value = event.detail.value;
      this.setUnpinnedPadding(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_HIDE_IN_POPUP_WINDOWS, (event) => {
      const value = event.detail.value;
      this.hideInPopupWindows = value;
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
          webPanelController.getAttach(),
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
      this.resetFloatingPosition(uuid);
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
   * @param {string?} attach
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
    attach,
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
      attach,
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
      .setTitle(title)
      .setHidden(hideToolbar);
    pinned ? this.pin() : this.unpin();
  }

  /**
   * @param {string} attach
   * @param {string?} marginTop
   * @param {string?} marginLeft
   * @param {string?} marginRight
   * @param {string?} marginBottom
   * @param {string?} width
   * @param {string?} height
   */
  setFloatingPosition(
    attach,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    width,
    height,
  ) {
    let top, left, right, bottom;
    top = left = right = bottom = "unset";

    if (attach == "default") attach = this.getDefaultAttach();
    if (attach == "topleft") top = left = "0px";
    else if (attach == "topright") top = right = "0px";
    else if (attach == "bottomleft") bottom = left = "0px";
    else if (attach == "bottomright") bottom = right = "0px";

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
   */
  resetFloatingPosition(uuid) {
    const webPanelController = SidebarControllers.webPanelsController.get(uuid);
    const position = SidebarElements.sidebarWrapper.getPosition();
    const padding = this.getUnpinnedPadding();
    const attach = "default";
    const marginTop = padding;
    const marginLeft = position === "left" ? padding : "unset";
    const marginRight = position === "right" ? padding : "unset";
    const marginBottom = "unset";
    const width = SidebarElements.sidebarBox.getProperty("width");
    const height = `calc(100% - ${padding} * 2)`;
    webPanelController.setAttach(attach);
    webPanelController.setFloatingPosition(
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      width,
      height,
    );
    this.setFloatingPosition(
      attach,
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
  getDefaultAttach() {
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
    document.removeEventListener("click", this.onClickOutsideWhileUnpinned);
  }

  unpin() {
    SidebarElements.sidebarBox.setAttribute("pinned", false);
    SidebarElements.sidebarSplitter.hide();
    SidebarElements.afterSplitter.hide();
    SidebarElements.sidebarToolbar.changePinButton(false);
    document.addEventListener("click", this.onClickOutsideWhileUnpinned);
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
  getUnpinnedPadding() {
    return this.root.getProperty("--sb2-box-unpinned-padding");
  }

  /**
   *
   * @returns {string}
   */
  getUnpinnedPaddingKey() {
    const value = this.getUnpinnedPadding();
    return value.match(/var\(--space-([^)]+)\)/)[1];
  }

  /**
   *
   * @param {string} value
   */
  setUnpinnedPadding(value) {
    document.documentElement.style.setProperty(
      "--sb2-box-unpinned-padding",
      `var(--space-${value})`,
    );
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
   * @param {string} mode
   * @param {number?} top
   * @param {number?} left
   * @param {number?} width
   * @param {number?} height
   */
  setUnpinnedBox(mode, top, left, width, height) {
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
      if (mode == "resize") {
        width = boxRect.right - areaRect.left;
      }
    }

    // right border
    if (left + width > areaRight) {
      if (mode == "move") {
        width = boxRect.width;
        left = areaRight - width;
      } else if (mode == "resize") {
        width = areaRight - left;
      }
    }

    // top border
    if (top < 0) {
      height = boxRect.height;
      top = areaTop;
    }

    // bottom border
    if (top + height > areaBottom) {
      if (mode == "move") {
        height = boxRect.height;
        top = areaBottom - height;
      } else if (mode == "resize") {
        height = areaBottom - top;
      }
    }

    // calculate margins

    const webPanelController =
      SidebarControllers.webPanelsController.getActive();
    let attach = webPanelController.getAttach();

    let marginTop_, marginLeft_, marginRight_, marginBottom_;
    marginTop_ = marginLeft_ = marginRight_ = marginBottom_ = "unset";

    if (attach == "default") attach = this.getDefaultAttach();
    if (attach === "topright") {
      marginTop_ = `${top}px`;
      marginRight_ = `${areaRight - left - width}px`;
    } else if (attach == "topleft") {
      marginTop_ = `${top}px`;
      marginLeft_ = `${left}px`;
    } else if (attach == "bottomleft") {
      marginBottom_ = `${areaBottom - top - height}px`;
      marginLeft_ = `${left}px`;
    } else if (attach == "bottomright") {
      marginBottom_ = `${areaBottom - top - height}px`;
      marginRight_ = `${areaRight - left - width}px`;
    }

    this.setFloatingPosition(
      attach,
      marginTop_,
      marginLeft_,
      marginRight_,
      marginBottom_,
      width + "px",
      height + "px",
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
    this.setUnpinnedPadding(settings.unpinnedPadding);
    this.hideInPopupWindows = settings.hideInPopupWindows;
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
      this.getUnpinnedPaddingKey(),
      this.hideInPopupWindows,
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
