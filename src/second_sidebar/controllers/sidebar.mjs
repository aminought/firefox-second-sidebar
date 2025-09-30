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
    this.tabbox = new XULElement({
      element: document.getElementById("tabbrowser-tabbox"),
    });

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
      const { uuid, width } = event.detail;

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      webPanelController.setPinnedWidth(width);
      if (webPanelController.isActive()) {
        this.setPinnedWidth(width);
      }
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_UNPINNED_BOX, (event) => {
      const { uuid, mode, top, left, width, height } = event.detail;

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      webPanelController.setUnpinnedBox(top, left, width, height);
      if (webPanelController.isActive()) {
        this.setUnpinnedBox(mode, top, left, width, height);
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
   * @param {string?} top
   * @param {string?} left
   * @param {string?} width
   * @param {string?} height
   * @param {boolean} canGoBack
   * @param {boolean} canGoForward
   * @param {string} title
   * @param {boolean} hideToolbar
   */
  open(
    pinned,
    top,
    left,
    width,
    height,
    canGoBack,
    canGoForward,
    title,
    hideToolbar,
  ) {
    SidebarElements.sidebarBox
      .setProperty("top", top ?? "unset")
      .setProperty("left", left ?? "unset")
      .setProperty("width", width ?? "400px")
      .setProperty("height", height ?? "100%")
      .show();
    SidebarElements.sidebarToolbar
      .toggleBackButton(!canGoBack)
      .toggleForwardButton(!canGoForward)
      .setTitle(title)
      .setHidden(hideToolbar);
    pinned ? this.pin() : this.unpin();
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
    SidebarElements.sidebarToolbar.changePinButton(true);
    document.removeEventListener("click", this.onClickOutsideWhileUnpinned);
  }

  unpin() {
    SidebarElements.sidebarBox.setAttribute("pinned", false);
    SidebarElements.sidebarSplitter.hide();
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
    const value = this.root.getProperty("--sb2-box-unpinned-padding");
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
    SidebarElements.sidebarBox.setAttribute("width", `${width}px`);
  }

  /**
   *
   * @param {string} mode
   * @param {number} top
   * @param {number} left
   * @param {number?} width
   * @param {number?} height
   */
  setUnpinnedBox(mode, top, left, width, height) {
    const tabboxRect = this.tabbox.getBoundingClientRect();
    const currentRect = SidebarElements.sidebarBox.getBoundingClientRect();

    const tabboxLeft = Math.ceil(tabboxRect.left);
    const tabboxRight = Math.floor(tabboxRect.right);
    const tabboxTop = 0;
    const tabboxBottom = Math.floor(tabboxRect.bottom - tabboxRect.top);

    if (!width) width = currentRect.width;
    if (!height) height = currentRect.height;

    // left border
    if (left < tabboxLeft) {
      left = tabboxLeft;
      if (mode == "resize") {
        width = currentRect.right - tabboxLeft;
      }
    }

    // right border
    if (left + width > tabboxRight) {
      if (mode == "move") {
        width = currentRect.width;
        left = tabboxRight - width;
      } else if (mode == "resize") {
        width = tabboxRight - left;
      }
    }

    // top border
    if (top < 0) {
      height = currentRect.height;
      top = tabboxTop;
    }

    // bottom border
    if (top + height > tabboxBottom) {
      if (mode == "move") {
        height = currentRect.height;
        top = tabboxBottom - height;
      } else if (mode == "resize") {
        height = tabboxBottom - top;
      }
    }

    SidebarElements.sidebarBox.setProperty("top", top + "px");
    SidebarElements.sidebarBox.setProperty("left", left + "px");
    SidebarElements.sidebarBox.setProperty("width", width + "px");
    SidebarElements.sidebarBox.setProperty("height", height + "px");
  }

  getUnpinnedBox() {
    const top = SidebarElements.sidebarBox.getProperty("top");
    const left = SidebarElements.sidebarBox.getProperty("left");
    const width = SidebarElements.sidebarBox.getProperty("width");
    const height = SidebarElements.sidebarBox.getProperty("height");
    return { top, left, width, height };
  }

  /**
   *
   * @param {number} top
   * @param {number} left
   */
  setPos(top, left) {
    const sidebarBoxRect = SidebarElements.sidebarBox.getBoundingClientRect();
    const tabboxRect = this.tabbox.getBoundingClientRect();

    const leftMin = tabboxRect.left;
    const leftMax = tabboxRect.right - sidebarBoxRect.width;
    const topMin = 0;
    const topMax = tabboxRect.bottom - tabboxRect.top - sidebarBoxRect.height;

    if (left < leftMin) left = leftMin;
    if (left > leftMax) left = leftMax;
    if (top < topMin) top = topMin;
    if (top > topMax) top = topMax;

    SidebarElements.sidebarBox.setProperty("left", `${left}px`);
    SidebarElements.sidebarBox.setProperty("top", `${top}px`);
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
      this.getUnpinnedPadding(),
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
