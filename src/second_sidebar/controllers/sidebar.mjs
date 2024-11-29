/* eslint-disable no-unused-vars */
import { Sidebar } from "../xul/sidebar.mjs";
import { SidebarBox } from "../xul/sidebar_box.mjs";
import { SidebarMainController } from "./sidebar_main.mjs";
import { SidebarSettings } from "../settings/sidebar_settings.mjs";
import { SidebarSplitterUnpinned } from "../xul/sidebar_splitter_unpinned.mjs";
import { SidebarToolbar } from "../xul/sidebar_toolbar.mjs";
import { ToolbarButton } from "../xul/base/toolbar_button.mjs";
import { WebPanelNewController } from "./web_panel_new.mjs";
import { WebPanelPopupEdit } from "../xul/web_panel_popup_edit.mjs";
import { WebPanelPopupMore } from "../xul/web_panel_popup_more.mjs";
import { WebPanelsController } from "./web_panels.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";
/* eslint-enable no-unused-vars */

export class SidebarController {
  /**
   *
   * @param {SidebarBox} sidebarBox
   * @param {Sidebar} sidebar
   * @param {SidebarToolbar} sidebarToolbar
   * @param {SidebarSplitterUnpinned} sidebarSplitterUnpinned
   * @param {WebPanelPopupEdit} webPanelPopupEdit
   * @param {XULElement} browser
   */
  constructor(
    sidebarBox,
    sidebar,
    sidebarToolbar,
    sidebarSplitterUnpinned,
    webPanelPopupEdit,
    browser,
  ) {
    this.sidebarBox = sidebarBox;
    this.sidebar = sidebar;
    this.sidebarToolbar = sidebarToolbar;
    this.sidebarSplitterUnpinned = sidebarSplitterUnpinned;
    this.webPanelPopupEdit = webPanelPopupEdit;
    this.browser = browser;
    this.#setupListeners();

    this.hideInPopupWindows = false;
    this.autoHideBackButton = false;
    this.autoHideForwardButton = false;
  }

  /**
   *
   * @param {SidebarMainController} sidebarMainController
   * @param {WebPanelsController} webPanelsController
   * @param {WebPanelNewController} webPanelNewController
   */
  setupDepenedencies(
    sidebarMainController,
    webPanelsController,
    webPanelNewController,
  ) {
    this.sidebarMainController = sidebarMainController;
    this.webPanelsController = webPanelsController;
    this.webPanelNewController = webPanelNewController;
  }

  #setupListeners() {
    /** @param {MouseEvent} event */
    this.onClickOutsideWhileUnpinned = (event) => {
      const target = new XULElement(null, { element: event.target });
      if (
        !this.sidebar.contains(target) &&
        !this.sidebarSplitterUnpinned.contains(target) &&
        !this.webPanelPopupEdit.contains(target) &&
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
        const webPanelController = this.webPanelsController.getActive();
        return callback(webPanelController.webPanel);
      }
    };

    this.sidebarToolbar.listenBackButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanel) => webPanel.goBack());
    });
    this.sidebarToolbar.listenForwardButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanel) => webPanel.goForward());
    });
    this.sidebarToolbar.listenReloadButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanel) => webPanel.reload());
    });
    this.sidebarToolbar.listenHomeButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanel) => webPanel.goHome());
    });

    this.sidebarToolbar.listenPinButtonClick(() => {
      const webPanelController = this.webPanelsController.getActive();
      if (webPanelController.pinned()) {
        webPanelController.unpin();
        this.unpin();
      } else {
        webPanelController.pin();
        this.pin();
      }
      this.webPanelsController.saveSettings();
    });

    this.sidebarToolbar.listenCloseButtonClick(() => {
      const webPanelController = this.webPanelsController.getActive();
      webPanelController.unload();
      this.close();
    });
  }

  /**
   *
   * @param {boolean} pinned
   * @param {number} width
   * @param {boolean} canGoBack
   * @param {boolean} canGoForward
   * @param {string} title
   * @param {number} zoom
   * @param {boolean} hideToolbar
   */
  open(pinned, width, canGoBack, canGoForward, title, zoom, hideToolbar) {
    this.sidebarBox.show();
    this.setWidth(width);
    this.setToolbarBackButtonDisabled(!canGoBack);
    this.setToolbarForwardButtonDisabled(!canGoForward);
    this.setToolbarTitle(title);
    this.setHideToolbar(hideToolbar);
    pinned ? this.pin() : this.unpin();
  }

  close() {
    this.sidebarBox.hide();
    this.unpin();
    this.webPanelsController.hideActive();
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
    document.removeEventListener("mousedown", this.onClickOutsideWhileUnpinned);
  }

  unpin() {
    this.sidebar.unpin();
    this.sidebarToolbar.changePinButton(false);
    document.addEventListener("mousedown", this.onClickOutsideWhileUnpinned);
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
    const value = this.browser.getProperty("--sb2-box-unpinned-padding");
    return value.match(/var\(--space-([^)]+)\)/)[1];
  }

  /**
   *
   * @param {string} value
   */
  setUnpinnedPadding(value) {
    this.browser.setProperty(
      "--sb2-box-unpinned-padding",
      `var(--space-${value})`,
    );
  }

  /**
   *
   * @param {SidebarSettings} settings
   */
  loadSettings(settings) {
    this.setPosition(settings.position);
    this.sidebarMainController.setWebPanelButtonsPosition(
      settings.webPanelButtonsPosition,
    );
    this.webPanelNewController.setPosition(settings.plusButtonPosition);
    this.sidebarMainController.setPadding(settings.padding);
    this.sidebarMainController.setFaviconSize(settings.faviconSize);
    this.setUnpinnedPadding(settings.unpinnedPadding);
    this.hideInPopupWindows = settings.hideInPopupWindows;
    this.autoHideBackButton = settings.autoHideBackButton;
    this.autoHideForwardButton = settings.autoHideForwardButton;
  }

  /**
   *
   * @returns {SidebarSettings}
   */
  dumpSettings() {
    return new SidebarSettings(
      this.getPosition(),
      this.sidebarMainController.getWebPanelButtonsPosition(),
      this.webPanelNewController.getPosition(),
      this.sidebarMainController.getPadding(),
      this.sidebarMainController.getFaviconSize(),
      this.getUnpinnedPadding(),
      this.hideInPopupWindows,
      this.autoHideBackButton,
      this.autoHideForwardButton,
    );
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
