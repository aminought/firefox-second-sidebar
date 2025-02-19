import { WebPanelEvents, sendEvent } from "./events.mjs";

import { Browser } from "../xul/base/browser.mjs";
import { ChromeUtilsWrapper } from "../wrappers/chrome_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { Tab } from "../xul/base/tab.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { ZoomManagerWrapper } from "../wrappers/zoom_manager.mjs";

const MOBILE_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36";
const DEFAULT_ZOOM = 1;
const ZOOM_DELTA = 0.1;

export class WebPanelController {
  #progressListener;
  /**@type {WebPanelSettings} */
  #settings;
  /**@type {WebPanelButton} */
  #button;
  /**
   *
   * @param {WebPanelSettings} settings
   * @param {object?} params
   * @param {boolean?} params.loaded
   * @param {string?} params.position
   */
  constructor(settings, { loaded = false, position = null } = {}) {
    this.#settings = settings;
    this.#progressListener = this.#createProgressListener();
    this.#button = this.#createWebPanelButton(settings, loaded, position);
    if (loaded) {
      SidebarElements.webPanelsBrowser.addWebPanel(
        settings,
        this.#progressListener,
      );
    }
  }

  #createProgressListener() {
    const callback = () => {
      if (this.tab.selected) {
        const canGoBack = this.tab.linkedBrowser.canGoBack();
        const canGoForward = this.tab.linkedBrowser.canGoForward();
        SidebarControllers.sidebarController.setToolbarBackButtonDisabled(
          !canGoBack,
        );
        SidebarControllers.sidebarController.setToolbarForwardButtonDisabled(
          !canGoForward,
        );
        this.setZoom(this.#settings.zoom);
      }
    };
    return {
      QueryInterface: ChromeUtilsWrapper.generateQI([
        "nsIWebProgressListener",
        "nsIWebProgressListener2",
        "nsISupportsWeakReference",
        "nsIXULBrowserWindow",
      ]),
      onLocationChange: callback,
      onStateChange: callback,
      onStatusChange: callback,
    };
  }

  /**
   *
   * @param {WebPanelSettings} settings
   * @param {boolean} loaded
   * @param {string} position
   */
  #createWebPanelButton(settings, loaded, position) {
    const button = new WebPanelButton(settings, position);
    button.setUnloaded(!loaded);

    button.listenClick((event) => {
      sendEvent(WebPanelEvents.OPEN_WEB_PANEL, {
        uuid: this.#settings.uuid,
        event,
      });
    });

    return button;
  }

  /**
   * @returns {WebPanelButton}
   */
  get button() {
    return this.#button;
  }

  /**
   * @returns {WebPanelTab?}
   */
  get tab() {
    return SidebarElements.webPanelsBrowser.getWebPanelTab(this.getUUID());
  }

  /**
   *
   * @returns {string}
   */
  getUUID() {
    return this.#settings.uuid;
  }

  /**
   *
   * @returns {string}
   */
  getURL() {
    return this.#settings.url;
  }

  /**
   *
   * @param {string} value
   */
  setURL(value) {
    this.#settings.url = value;
    this.button.setLabel(value).setTooltipText(value);
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
    return this.#settings.faviconURL;
  }

  /**
   *
   * @param {string} faviconURL
   */
  setWebPanelFaviconURL(faviconURL) {
    this.#settings.faviconURL = faviconURL;
  }

  /**
   *
   * @param {string} faviconURL
   */
  setWebPanelButtonFaviconURL(faviconURL) {
    this.button.setIcon(faviconURL);
  }

  /**
   *
   * @returns {string}
   */
  getCurrentUrl() {
    return this.tab.linkedBrowser.getCurrentUrl();
  }

  switchWebPanel() {
    const activeWebPanelController =
      SidebarControllers.webPanelsController.getActive();
    if (activeWebPanelController) {
      activeWebPanelController.hide();
    }
    const uuid = this.getUUID();
    if (!SidebarControllers.sidebarController.closed() && this.tab?.selected) {
      SidebarControllers.sidebarController.close();
    } else {
      if (!this.tab) {
        SidebarElements.webPanelsBrowser.addWebPanel(
          this.#settings,
          this.#progressListener,
        );
      }
      SidebarElements.webPanelsBrowser.selectWebPanelTab(uuid);
      SidebarControllers.sidebarController.open(
        this.#settings.pinned,
        this.#settings.width,
        this.tab.linkedBrowser.canGoBack(),
        this.tab.linkedBrowser.canGoForward(),
        this.tab.linkedBrowser.getTitle(),
        this.tab.linkedBrowser.getZoom(),
        this.#settings.hideToolbar,
      );
      this.show();
    }
  }

  show() {
    this.#button.setOpen(true);
    this.#button.setUnloaded(false);
  }

  hide() {
    if (this.#settings.unloadOnClose) {
      this.unload();
    }
    this.#button.setOpen(false);
  }

  unload() {
    SidebarControllers.sidebarController.close();
    SidebarElements.webPanelsBrowser.unloadWebPanelTab(this.getUUID());
    this.#button.hidePlayingIcon().setUnloaded(true);
  }

  /**
   *
   * @returns {boolean}
   */
  isUnloaded() {
    return this.button.isUnloaded();
  }

  reload() {
    this.tab.linkedBrowser.reload();
  }

  goBack() {
    this.tab.linkedBrowser.goBack();
  }

  goForward() {
    this.tab.linkedBrowser.goForward();
  }

  goHome() {
    this.tab.linkedBrowser.go(this.#settings.url);
  }

  /**
   *
   * @param {boolean} value
   */
  setMobile(value) {
    this.#settings.mobile = value;
    this.tab.linkedBrowser.setCustomUserAgent(value ? MOBILE_USER_AGENT : "");
    if (!this.isUnloaded()) {
      this.goHome();
    }
  }

  /**
   *
   * @returns {number}
   */
  getZoom() {
    return this.#settings.zoom;
  }

  zoomOut() {
    const zoom = Math.max(
      Math.round((this.#settings.zoom - ZOOM_DELTA) * 100) / 100,
      ZoomManagerWrapper.MIN,
    );
    this.setZoom(zoom);
  }

  zoomIn() {
    const zoom = Math.min(
      Math.round((this.#settings.zoom + ZOOM_DELTA) * 100) / 100,
      ZoomManagerWrapper.MAX,
    );
    this.setZoom(zoom);
  }

  /**
   *
   * @param {number} zoom
   */
  setZoom(zoom) {
    this.#settings.zoom = zoom;
    this.tab.linkedBrowser.setZoom(zoom);
  }

  resetZoom() {
    this.setZoom(DEFAULT_ZOOM);
  }

  /**
   *
   * @param {boolean} value
   */
  setLoadOnStartup(value) {
    this.#settings.loadOnStartup = value;
  }

  /**
   *
   * @returns {boolean}
   */
  getUnloadOnClose() {
    return this.#settings.unloadOnClose;
  }

  /**
   *
   * @param {boolean} value
   */
  setUnloadOnClose(value) {
    this.#settings.unloadOnClose = value;
  }

  /**
   *
   * @param {boolean} value
   */
  setHideToolbar(value) {
    this.#settings.hideToolbar = value;
  }

  /**
   *
   * @param {number} width
   */
  setWidth(width) {
    this.#settings.width = width;
  }

  /**
   *
   * @returns {boolean}
   */
  pinned() {
    return this.#settings.pinned;
  }

  pin() {
    this.#settings.pinned = true;
  }

  unpin() {
    this.#settings.pinned = false;
  }

  /**
   *
   * @param {string} url
   */
  go(url) {
    this.tab.linkedBrowser.go(url);
  }

  /**
   *
   * @returns {HTMLElement}
   */
  getInsertedBeforeXUL() {
    return this.button.nextSibling;
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    const tab = SidebarElements.webPanelsBrowser.getWebPanelTab(this.getUUID());
    return tab && tab.selected;
  }

  remove() {
    SidebarElements.webPanelsBrowser.removeWebPanelTab(this.getUUID());
    this.#button.remove();
  }

  /**
   *
   * @returns {WebPanelSettings}
   */
  dumpSettings() {
    return this.#settings;
  }
}
