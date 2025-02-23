/* eslint-disable no-unused-vars */
import {
  SidebarEvents,
  WebPanelEvents,
  listenEvent,
  sendEvents,
} from "./events.mjs";

import { SidebarControllerWrapper } from "../wrappers/sidebar_controller.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { SidebarSettings } from "../settings/sidebar_settings.mjs";
import { ToolbarButton } from "../xul/base/toolbar_button.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { changeContainerBorder } from "../utils/containers.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

/* eslint-enable no-unused-vars */

export class SidebarController {
  constructor() {
    this.sidebarBox = SidebarElements.sidebarBox;
    this.sidebar = SidebarElements.sidebar;
    this.sidebarToolbar = SidebarElements.sidebarToolbar;
    this.sidebarSplitterUnpinned = SidebarElements.sidebarSplitterUnpinned;
    this.webPanelPopupEdit = SidebarElements.webPanelPopupEdit;
    this.sidebarMainPopupSettings = SidebarElements.sidebarMainPopupSettings;
    this.root = new XULElement({ element: document.documentElement });

    this.#setupListeners();

    this.hideInPopupWindows = false;
    this.autoHideBackButton = false;
    this.autoHideForwardButton = false;
    this.containerBorder = "left";
  }

  #setupListeners() {
    /** @param {MouseEvent} event */
    this.onClickOutsideWhileUnpinned = (event) => {
      const target = new XULElement({ element: event.target });
      if (
        isLeftMouseButton(event) &&
        !this.sidebar.contains(target) &&
        !this.sidebarSplitterUnpinned.contains(target) &&
        !this.webPanelPopupEdit.contains(target) &&
        !this.sidebarMainPopupSettings.contains(target) &&
        !["menuitem", "menupopup"].includes(event.target.tagName) &&
        (document.contains(event.target) ||
          event.target.baseURI ===
            "chrome://browser/content/webext-panels.xhtml")
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

    this.sidebarToolbar.listenBackButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goBack(),
      );
    });
    this.sidebarToolbar.listenForwardButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goForward(),
      );
    });
    this.sidebarToolbar.listenReloadButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.reload(),
      );
    });
    this.sidebarToolbar.listenHomeButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goHome(),
      );
    });

    this.sidebarToolbar.listenPinButtonClick(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_PINNED, {
        uuid: webPanelController.getUUID(),
        pinned: !webPanelController.pinned(),
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);
    });

    this.sidebarToolbar.listenCloseButtonClick(() => {
      this.close();
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      webPanelController.unload();
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_POSITION, (event) => {
      const value = event.detail.value;
      this.setPosition(value);
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
      this.autoHideBackButton = value;
      this.autoHideButton(this.sidebarToolbar.backButton, value);
    });

    listenEvent(
      SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_FORWARD_BUTTON,
      (event) => {
        const value = event.detail.value;
        this.autoHideForwardButton = value;
        this.autoHideButton(this.sidebarToolbar.forwardButton, value);
      },
    );

    listenEvent(SidebarEvents.EDIT_SIDEBAR_CONTAINER_BORDER, (event) => {
      const value = event.detail.value;
      this.autoHideForwardButton = value;
      this.setContainerBorder(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_WIDTH, (event) => {
      const uuid = event.detail.uuid;
      const width = event.detail.width;

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      webPanelController.setWidth(width);
      if (webPanelController.isActive()) {
        this.setWidth(width);
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
   * @param {number} width
   * @param {boolean} canGoBack
   * @param {boolean} canGoForward
   * @param {string} title
   * @param {boolean} hideToolbar
   */
  open(pinned, width, canGoBack, canGoForward, title, hideToolbar) {
    this.sidebarBox.show();
    this.setWidth(width);
    this.setToolbarBackButtonDisabled(!canGoBack);
    this.setToolbarForwardButtonDisabled(!canGoForward);
    this.setToolbarTitle(title);
    this.setHideToolbar(hideToolbar);
    this.updateAbsolutePosition();
    pinned ? this.pin() : this.unpin();
  }

  close() {
    this.sidebarBox.hide();
    SidebarControllers.webPanelsController.close();
  }

  /**
   *
   * @returns {boolean}
   */
  closed() {
    return this.sidebarBox.hidden();
  }

  pin() {
    this.sidebar.pin();
    this.sidebarToolbar.changePinButton(true);
    document.removeEventListener("click", this.onClickOutsideWhileUnpinned);
  }

  unpin() {
    this.sidebar.unpin();
    this.sidebarToolbar.changePinButton(false);
    document.addEventListener("click", this.onClickOutsideWhileUnpinned);
  }

  /**
   *
   * @param {string} title
   */
  setToolbarTitle(title) {
    this.sidebarToolbar.setTitle(title);
  }

  /**
   *
   * @param {boolean} value
   */
  setToolbarBackButtonDisabled(value) {
    const button = this.sidebarToolbar.backButton;
    button.setDisabled(value);
    this.autoHideButton(button, this.autoHideBackButton);
  }

  /**
   *
   * @param {boolean} value
   */
  setToolbarForwardButtonDisabled(value) {
    const button = this.sidebarToolbar.forwardButton;
    button.setDisabled(value);
    this.autoHideButton(button, this.autoHideForwardButton);
  }

  /**
   *
   * @param {ToolbarButton} button
   * @param {boolean} autoHide
   */
  autoHideButton(button, autoHide) {
    button.isDisabled() && autoHide ? button.hide() : button.show();
  }

  /**
   *
   * @param {number} width
   */
  setWidth(width) {
    this.sidebarBox.setWidth(width);
    this.sidebar.setWidth(width);
    this.updateAbsolutePosition();
  }

  /**
   *
   * @returns {number}
   */
  getSidebarWidth() {
    return this.sidebar.getWidth();
  }

  /**
   *
   * @returns {number}
   */
  getSidebarBoxWidth() {
    return this.sidebarBox.getWidth();
  }

  /**
   *
   * @param {string} position
   */
  setPosition(position) {
    this.sidebar.setPosition(position);
    if (
      (position === "right" && !SidebarControllerWrapper._positionStart) ||
      (position === "left" && SidebarControllerWrapper._positionStart)
    ) {
      SidebarControllerWrapper.reversePosition();
    }
    this.updateAbsolutePosition();
  }

  /**
   *
   * @returns {string}
   */
  getPosition() {
    return this.sidebar.getPosition();
  }

  /**
   *
   * @param {boolean} value
   */
  setHideToolbar(value) {
    value ? this.sidebarToolbar.hide() : this.sidebarToolbar.show();
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
    this.updateAbsolutePosition();
  }

  updateAbsolutePosition() {
    const sidebarMainWidth =
      SidebarControllers.sidebarMainController.getWidth();
    this.getPosition() === "left"
      ? this.setAbsoluteLeft(sidebarMainWidth)
      : this.setAbsoluteRight(sidebarMainWidth);
  }

  /**
   *
   * @param {string} value
   */
  setAbsoluteRight(value) {
    this.sidebarBox.setProperty("left", "unset");
    this.sidebarBox.setProperty("right", value);
  }

  /**
   *
   * @param {string} value
   */
  setAbsoluteLeft(value) {
    this.sidebarBox.setProperty("left", value);
    this.sidebarBox.setProperty("right", "unset");
  }

  /**
   *
   * @returns {string}
   */
  getContainerBorder() {
    return this.containerBorder;
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
   * @param {SidebarSettings} settings
   */
  loadSettings(settings) {
    this.setPosition(settings.position);
    SidebarControllers.sidebarMainController.setPadding(settings.padding);
    SidebarControllers.webPanelNewController.setNewWebPanelPosition(
      settings.newWebPanelPosition,
    );
    this.setUnpinnedPadding(settings.unpinnedPadding);
    this.hideInPopupWindows = settings.hideInPopupWindows;
    this.autoHideBackButton = settings.autoHideBackButton;
    this.autoHideForwardButton = settings.autoHideForwardButton;
    this.setContainerBorder(settings.containerBorder);
  }

  /**
   *
   * @returns {SidebarSettings}
   */
  dumpSettings() {
    return new SidebarSettings(
      this.getPosition(),
      SidebarControllers.sidebarMainController.getPadding(),
      SidebarControllers.webPanelNewController.getNewWebPanelPosition(),
      this.getUnpinnedPadding(),
      this.hideInPopupWindows,
      this.autoHideBackButton,
      this.autoHideForwardButton,
      this.containerBorder,
    );
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
