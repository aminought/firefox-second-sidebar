import { WebPanelEvents, sendEvent } from "./events.mjs";

import { ChromeUtilsWrapper } from "../wrappers/chrome_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { Tab } from "../xul/base/tab.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";

export class WebPanelController {
  /**@type {WebPanelSettings} */
  #webPanelSettings;
  /**@type {WebPanelButton} */
  #webPanelButton;
  /**
   *
   * @param {WebPanelSettings} webPanelSettings
   * @param {object?} params
   * @param {boolean?} params.loadWebPanel
   * @param {string?} params.newWebPanelPosition
   */
  constructor(
    webPanelSettings,
    { loadWebPanel = false, newWebPanelPosition = null } = {},
  ) {
    this.#webPanelSettings = webPanelSettings;
    this.#webPanelButton = new WebPanelButton(
      webPanelSettings.uuid,
      newWebPanelPosition,
    );
    this.initWebPanelButton();
    console.log(`Load web panel ${webPanelSettings.uuid}: ${loadWebPanel}`);
    if (loadWebPanel) {
      SidebarElements.webPanelsBrowser.addWebPanel(webPanelSettings);
    }
    this.#webPanelButton
      .setUserContextId(webPanelSettings.userContextId)
      .setIcon(webPanelSettings.faviconURL)
      .setLabel(webPanelSettings.url)
      .setTooltipText(webPanelSettings.url)
      .setUnloaded(!loadWebPanel);
  }

  /**
   * @returns {WebPanelButton}
   */
  get webPanelButton() {
    return this.#webPanelButton;
  }

  /**
   *
   * @returns {string}
   */
  getUUID() {
    return this.#webPanelSettings.uuid;
  }

  /**
   *
   * @returns {string}
   */
  getURL() {
    return this.#webPanelSettings.url;
  }

  /**
   *
   * @param {string} value
   */
  setURL(value) {
    this.#webPanelSettings.url = value;
    this.webPanelButton.setLabel(value).setTooltipText(value);
  }

  // /**
  //  *
  //  * @param {string} userContextId
  //  */
  // setUserContextId(userContextId) {
  //   const isActive = this.isActive();

  //   const webPanelTab = new WebPanelTab(this.getUUID(), userContextId);
  //   const webPanel = new WebPanel(
  //     webPanelTab,
  //     this.getUUID(),
  //     this.webPanel.url,
  //     this.webPanel.faviconURL,
  //     {
  //       pinned: this.webPanel.pinned,
  //       width: this.webPanel.width,
  //       mobile: this.webPanel.mobile,
  //       zoom: this.webPanel.zoom,
  //       loadOnStartup: this.webPanel.loadOnStartup,
  //       unloadOnClose: this.webPanel.unloadOnClose,
  //       hideToolbar: this.webPanel.hideToolbar,
  //     },
  //   );

  //   this.unhackAsyncTabSwitcher();
  //   this.webPanelTab.remove();
  //   this.webPanel.remove();

  //   this.webPanelTab = webPanelTab;
  //   this.webPanel = webPanel;
  //   this.webPanelButton.setUserContextId(userContextId);

  //   if (isActive) {
  //     // SidebarControllers.webPanelsController.injectWebPanelTab(webPanelTab);
  //     // SidebarControllers.webPanelsController.injectWebPanel(webPanel);
  //     // this.initWebPanel();
  //     // this.webPanel.setDocShellIsActive(true).preserveLayers(false);
  //   } else {
  //     webPanel.hide();
  //     this.webPanelButton.setUnloaded(true);
  //   }
  // }

  /**
   *
   * @returns {string}
   */
  getFaviconURL() {
    return this.#webPanelSettings.faviconURL;
  }

  /**
   *
   * @param {string} faviconURL
   */
  setWebPanelFaviconURL(faviconURL) {
    this.#webPanelSettings.faviconURL = faviconURL;
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
    return this.webPanelTab.getCurrentUrl();
  }

  initWebPanelButton() {
    this.#webPanelButton.listenClick((event) => {
      sendEvent(WebPanelEvents.OPEN_WEB_PANEL, {
        uuid: this.#webPanelSettings.uuid,
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
    const activeWebPanelController =
      SidebarControllers.webPanelsController.getActive();
    if (activeWebPanelController) {
      activeWebPanelController.hide();
    }
    const uuid = this.getUUID();
    let tab = SidebarElements.webPanelsBrowser.getWebPanelTab(uuid);
    if (!SidebarControllers.sidebarController.closed() && tab?.isActive()) {
      SidebarControllers.sidebarController.close();
    } else {
      if (!tab) {
        SidebarElements.webPanelsBrowser.addWebPanel(this.#webPanelSettings);
        tab = SidebarElements.webPanelsBrowser.getWebPanelTab(uuid);
      }
      SidebarElements.webPanelsBrowser.selectWebPanelTab(uuid);
      const browser =
        SidebarElements.webPanelsBrowser.getWebPanelBrowserForTab(tab);
      SidebarControllers.sidebarController.open(
        this.#webPanelSettings.pinned,
        this.#webPanelSettings.width,
        browser.canGoBack(),
        browser.canGoForward(),
        browser.getTitle(),
        browser.getZoom(),
        this.#webPanelSettings.hideToolbar,
      );
      this.show();
    }
  }

  show() {
    this.#webPanelButton.setOpen(true);
    this.#webPanelButton.setUnloaded(false);
  }

  hide() {
    if (this.#webPanelSettings.unloadOnClose) {
      this.unload();
    }
    this.#webPanelButton.setOpen(false);
  }

  unload() {
    SidebarControllers.sidebarController.close();
    SidebarElements.webPanelsBrowser.unloadWebPanelTab(this.getUUID());
    this.#webPanelButton.hidePlayingIcon().setUnloaded(true);
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
    const tab = SidebarElements.webPanelsBrowser.getWebPanelTab(this.getUUID());
    return tab && tab.isActive();
  }

  remove() {
    SidebarElements.webPanelsBrowser.removeWebPanelTab(this.getUUID());
    this.#webPanelButton.remove();
  }

  /**
   *
   * @returns {WebPanelSettings}
   */
  dumpSettings() {
    return this.#webPanelSettings;
  }
}
