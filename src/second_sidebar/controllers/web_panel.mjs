/* eslint-disable no-unused-vars */
import {
  isLeftMouseButton,
  isMiddleMouseButton,
  isRightMouseButton,
} from "../utils/buttons.mjs";

import { SidebarController } from "./sidebar.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelButtonMenuPopup } from "../xul/web_panel_button_menupopup.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelsController } from "./web_panels.mjs";

/* eslint-enable no-unused-vars */

export class WebPanelController {
  /**
   *
   * @param {WebPanel} webPanel
   * @param {WebPanelButton} webPanelButton
   * @param {WebPanelTab} webPanelTab
   * @param {WebPanelButtonMenuPopup} webPanelButtonMenuPopup
   */
  constructor(webPanel, webPanelButton, webPanelTab, webPanelButtonMenuPopup) {
    this.webPanel = webPanel;
    this.webPanelButton = webPanelButton;
    this.webPanelTab = webPanelTab;
    this.webPanelButtonMenuPopup = webPanelButtonMenuPopup;
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   * @param {SidebarController} sidebarController
   * @param {WebPanelEditController} webPanelEditController
   */
  setupDependencies(
    webPanelsController,
    sidebarController,
    webPanelEditController,
  ) {
    this.webPanelsController = webPanelsController;
    this.sidebarController = sidebarController;
    this.webPanelEditController = webPanelEditController;
  }

  /**
   *
   * @returns {string}
   */
  getUUID() {
    return this.webPanel.uuid;
  }

  /**
   *
   * @returns {string}
   */
  getURL() {
    return this.webPanel.url;
  }

  /**
   *
   * @param {string} value
   */
  setURL(value) {
    this.webPanel.url = value;
    this.webPanelButton.setTooltipText(value);
  }

  /**
   *
   * @returns {string}
   */
  getFaviconURL() {
    return this.webPanel.faviconURL;
  }

  /**
   *
   * @param {string} faviconURL
   */
  setWebPanelFaviconURL(faviconURL) {
    this.webPanel.faviconURL = faviconURL;
  }

  /**
   *
   * @param {string} faviconURL
   */
  setWebPanelButtonFaviconURL(faviconURL) {
    this.webPanelButton.setIcon(faviconURL);
  }

  /**
   *
   * @returns {string}
   */
  getCurrentUrl() {
    return this.webPanel.getCurrentUrl();
  }

  hackAsyncTabSwitcher() {
    const tabBrowser = this.webPanel.getTabBrowser();
    tabBrowser._printPreviewBrowsers.add(this.webPanel.getXUL());
  }

  unhackAsyncTabSwitcher() {
    const tabBrowser = this.webPanel.getTabBrowser();
    tabBrowser._printPreviewBrowsers.delete(this.webPanel.getXUL());
  }

  initWebPanel() {
    this.hackAsyncTabSwitcher();

    this.webPanel.listenBrowserProgressListener(() => {
      this.webPanel.setZoom(this.webPanel.zoom);
      if (this.webPanel.isActive()) {
        const canGoBack = this.webPanel.canGoBack();
        const canGoForward = this.webPanel.canGoForward();
        const title = this.webPanel.getTitle();
        this.sidebarController.setToolbarBackButtonDisabled(!canGoBack);
        this.sidebarController.setToolbarForwardButtonDisabled(!canGoForward);
        this.sidebarController.setToolbarTitle(title);
      }
      // mediaController can be changed, so listen here
      this.webPanel.listenPlaybackStateChange((isPlaying) => {
        this.webPanelButton.setPlaying(isPlaying);
      });
    });

    this.webPanel.goHome();
  }

  initWebPanelButton() {
    const switchWebPanel = () => {
      if (this.webPanel.isActive()) {
        this.sidebarController.close();
      } else {
        this.webPanelsController.hideActive();
        if (
          this.webPanelsController.injectWebPanelTab(this.webPanelTab) &&
          this.webPanelsController.injectWebPanel(this.webPanel)
        ) {
          this.initWebPanel();
        }
        this.sidebarController.open(
          this.webPanel.pinned,
          this.webPanel.width,
          this.webPanel.canGoBack(),
          this.webPanel.canGoForward(),
          this.webPanel.getTitle(),
          this.webPanel.getZoom(),
          this.webPanel.hideToolbar,
        );
        this.show();
      }
    };

    this.webPanelButton.listenClick((event) => {
      if (isLeftMouseButton(event)) {
        switchWebPanel();
      } else if (isMiddleMouseButton(event)) {
        this.unload();
      } else if (isRightMouseButton(event)) {
        this.webPanelButtonMenuPopup.setWebPanelController(this);
      }
    });
  }

  show() {
    this.webPanel.show().setDocShellIsActive(true).preserveLayers(false);
    this.webPanelButton.setOpen(true);
    this.webPanelButton.setUnloaded(false);
  }

  hide() {
    this.webPanel.hide().setDocShellIsActive(false).preserveLayers(true);
    if (this.webPanel.unloadOnClose) {
      this.unload();
    }
    this.webPanelButton.setOpen(false);
  }

  unload() {
    this.unhackAsyncTabSwitcher();
    this.sidebarController.close();
    this.webPanel.remove();
    this.webPanelTab.remove();
    this.webPanelButton.setUnloaded(true).hidePlayingIcon();
  }

  /**
   *
   * @returns {boolean}
   */
  isUnloaded() {
    return this.webPanelButton.isUnloaded();
  }

  /**
   *
   * @param {boolean} value
   */
  setMobile(value) {
    this.webPanel.mobile = value;
    if (!this.isUnloaded()) {
      this.webPanel.goHome();
    }
  }

  /**
   *
   * @returns {number}
   */
  getZoom() {
    return this.webPanel.zoom;
  }

  zoomOut() {
    this.webPanel.zoomOut(this.isUnloaded());
  }

  zoomIn() {
    this.webPanel.zoomIn(this.isUnloaded());
  }

  /**
   *
   * @param {number} zoom
   */
  setZoom(zoom) {
    this.webPanel.setZoom(zoom, this.isUnloaded());
  }

  resetZoom() {
    this.webPanel.setZoom(1, this.isUnloaded());
  }

  /**
   *
   * @param {boolean} value
   */
  setLoadOnStartup(value) {
    this.webPanel.loadOnStartup = value;
  }

  /**
   *
   * @returns {boolean}
   */
  getUnloadOnClose() {
    return this.webPanel.unloadOnClose;
  }

  /**
   *
   * @param {boolean} value
   */
  setUnloadOnClose(value) {
    this.webPanel.unloadOnClose = value;
  }

  /**
   *
   * @param {boolean} value
   */
  setHideToolbar(value) {
    this.webPanel.hideToolbar = value;
  }

  /**
   *
   * @returns {boolean}
   */
  isFirst() {
    return this.webPanelsController.isFirst(this.getUUID());
  }

  /**
   *
   * @returns {number}
   */
  getIndex() {
    return this.webPanelsController.getIndex(this.getUUID());
  }

  /**
   *
   * @returns {boolean}
   */
  isLast() {
    return this.webPanelsController.isLast(this.getUUID());
  }

  /**
   *
   * @param {number} width
   */
  setWidth(width) {
    this.webPanel.width = width;
  }

  /**
   *
   * @returns {boolean}
   */
  pinned() {
    return this.webPanel.pinned;
  }

  pin() {
    this.webPanel.pinned = true;
  }

  unpin() {
    this.webPanel.pinned = false;
  }

  /**
   *
   * @param {string} url
   */
  go(url) {
    this.webPanel.go(url);
  }

  /**
   *
   * @returns {HTMLElement}
   */
  getInsertedBeforeXUL() {
    return this.webPanelButton.element.nextSibling;
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    return this.webPanel.isActive();
  }

  remove() {
    this.unhackAsyncTabSwitcher();
    this.webPanel.remove();
    this.webPanelTab.remove();
    this.webPanelButton.remove();
  }

  /**
   *
   * @returns {WebPanelSettings}
   */
  dumpSettings() {
    return new WebPanelSettings(
      this.webPanel.uuid,
      this.webPanel.url,
      this.webPanel.faviconURL,
      this.webPanel.pinned,
      this.webPanel.width,
      this.webPanel.mobile,
      this.webPanel.zoom,
      this.webPanel.loadOnStartup,
      this.webPanel.unloadOnClose,
      this.webPanel.hideToolbar,
    );
  }
}
