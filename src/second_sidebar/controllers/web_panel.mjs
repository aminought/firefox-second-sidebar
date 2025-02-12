import { WebPanelEvents, sendEvent } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";

export class WebPanelController {
  /**
   *
   * @param {WebPanel} webPanel
   * @param {WebPanelButton} webPanelButton
   * @param {WebPanelTab} webPanelTab
   */
  constructor(webPanel, webPanelButton, webPanelTab) {
    this.webPanel = webPanel;
    this.webPanelButton = webPanelButton;
    this.webPanelTab = webPanelTab;
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
    this.webPanelButton.setLabel(value).setTooltipText(value);
  }

  /**
   *
   * @param {string} userContextId
   */
  setUserContextId(userContextId) {
    const isActive = this.isActive();

    const webPanelTab = new WebPanelTab(this.getUUID(), userContextId);
    const webPanel = new WebPanel(
      webPanelTab,
      this.getUUID(),
      this.webPanel.url,
      this.webPanel.faviconURL,
      {
        pinned: this.webPanel.pinned,
        width: this.webPanel.width,
        mobile: this.webPanel.mobile,
        zoom: this.webPanel.zoom,
        loadOnStartup: this.webPanel.loadOnStartup,
        unloadOnClose: this.webPanel.unloadOnClose,
        hideToolbar: this.webPanel.hideToolbar,
      },
    );

    this.unhackAsyncTabSwitcher();
    this.webPanelTab.remove();
    this.webPanel.remove();

    this.webPanelTab = webPanelTab;
    this.webPanel = webPanel;
    this.webPanelButton.setUserContextId(userContextId);

    if (isActive) {
      SidebarControllers.webPanelsController.injectWebPanelTab(webPanelTab);
      SidebarControllers.webPanelsController.injectWebPanel(webPanel);
      this.initWebPanel();
      this.webPanel.setDocShellIsActive(true).preserveLayers(false);
    } else {
      webPanel.hide();
      this.webPanelButton.setUnloaded(true);
    }
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
    // prevent AsyncTabSwitcher to unload web panels
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
        SidebarControllers.sidebarController.setToolbarBackButtonDisabled(
          !canGoBack,
        );
        SidebarControllers.sidebarController.setToolbarForwardButtonDisabled(
          !canGoForward,
        );
        SidebarControllers.sidebarController.setToolbarTitle(title);
      }
      // mediaController can be changed, so listen here
      this.webPanel.listenPlaybackStateChange((isPlaying) => {
        this.webPanelButton.setPlaying(isPlaying);
      });
    });

    this.webPanel.goHome();
  }

  initWebPanelButton() {
    this.webPanelButton.listenClick((event) => {
      sendEvent(WebPanelEvents.OPEN_WEB_PANEL, {
        uuid: this.webPanel.uuid,
        event,
      });
    });
  }

  openWebPanel() {
    SidebarControllers.sidebarController.close();
    SidebarControllers.sidebarController.open(
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

  switchWebPanel() {
    if (this.webPanel.isActive()) {
      SidebarControllers.sidebarController.close();
    } else {
      SidebarControllers.webPanelsController.hideActive();
      if (
        SidebarControllers.webPanelsController.injectWebPanelTab(
          this.webPanelTab,
        ) &&
        SidebarControllers.webPanelsController.injectWebPanel(this.webPanel)
      ) {
        this.initWebPanel();
      }
      SidebarControllers.sidebarController.open(
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
    SidebarControllers.sidebarController.close();
    this.webPanel.remove();
    this.webPanelTab.remove();
    this.webPanelButton.hidePlayingIcon().setUnloaded(true);
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
    return this.webPanelButton.nextSibling;
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
   * @param {WebPanelSettings} webPanelSettings
   * @returns {WebPanelController}
   */
  static fromSettings(webPanelSettings) {
    const webPanelTab = new WebPanelTab(
      webPanelSettings.uuid,
      webPanelSettings.userContextId,
    );

    const webPanel = new WebPanel(
      webPanelTab,
      webPanelSettings.uuid,
      webPanelSettings.url,
      webPanelSettings.faviconURL,
      webPanelSettings,
    ).hide();

    const webPanelButton = new WebPanelButton(webPanel.uuid)
      .setUserContextId(webPanelSettings.userContextId)
      .setIcon(webPanelSettings.faviconURL)
      .setLabel(webPanelSettings.url)
      .setTooltipText(webPanelSettings.url)
      .setUnloaded(!webPanelSettings.loadOnStartup);

    return new WebPanelController(webPanel, webPanelButton, webPanelTab);
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
      this.webPanelTab.getUserContextId(),
    );
  }
}
