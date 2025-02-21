/* eslint-disable no-unused-vars */
import { WebPanelEvents, sendEvent } from "./events.mjs";

import { ChromeUtilsWrapper } from "../wrappers/chrome_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { ZoomManagerWrapper } from "../wrappers/zoom_manager.mjs";

/* eslint-enable no-unused-vars */

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
    this.webPanelsBrowser = SidebarElements.webPanelsBrowser;

    this.#settings = settings;
    this.#progressListener = this.#createProgressListener();
    this.#button = this.#createWebPanelButton(settings, loaded, position);
    if (loaded) {
      this.webPanelsBrowser.addWebPanelTab(settings, this.#progressListener);
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
    return this.webPanelsBrowser.getWebPanelTab(this.getUUID());
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

  /**
   *
   * @param {string} userContextId
   */
  setUserContextId(userContextId) {
    this.#settings.userContextId = userContextId;

    const isActive = this.isActive();

    this.webPanelsBrowser.removeWebPanelTab(this.getUUID());
    this.webPanelsBrowser.addWebPanelTab(
      this.#settings,
      this.#progressListener,
    );
    this.#button.setUserContextId(userContextId);

    if (isActive) {
      this.webPanelsBrowser.selectWebPanelTab(this.getUUID());
    }
    if (this.#settings.unloadOnClose) {
      this.unload();
    }
  }

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

    // Close active web panel and sidebar
    activeWebPanelController?.close();

    // Reopen sidebar and open web panel if web panel was not active
    if (activeWebPanelController?.getUUID() !== this.getUUID()) {
      this.open();
    }
  }

  open() {
    this.#button.setOpen(true).setUnloaded(false);

    // Create web panel tab if it was not loaded yet and select
    if (!this.tab) {
      this.webPanelsBrowser.addWebPanelTab(
        this.#settings,
        this.#progressListener,
      );
    }
    this.webPanelsBrowser.selectWebPanelTab(this.getUUID());

    // Restore progress listener after browser discard
    if (this.#settings.unloadOnClose) {
      this.webPanelsBrowser.addWebPanelProgressListener(
        this.getUUID(),
        this.#progressListener,
      );
    }

    // Open sidebar if it was closed and configure
    SidebarControllers.sidebarController.open(
      this.#settings.pinned,
      this.#settings.width,
      this.tab.linkedBrowser.canGoBack(),
      this.tab.linkedBrowser.canGoForward(),
      this.tab.linkedBrowser.getTitle(),
      this.tab.linkedBrowser.getZoom(),
      this.#settings.hideToolbar,
    );
  }

  close() {
    this.#button.setOpen(false);
    SidebarControllers.sidebarController.close();
    this.webPanelsBrowser.deselectWebPanelTab();
    if (this.#settings.unloadOnClose) {
      this.unload();
    }
  }

  unload() {
    const activeWebPanelController =
      SidebarControllers.webPanelsController.getActive();
    if (activeWebPanelController?.getUUID() === this.getUUID()) {
      this.webPanelsBrowser.deselectWebPanelTab();
    }
    this.webPanelsBrowser.unloadWebPanelTab(this.getUUID());
    this.#button.setOpen(false).setUnloaded(true).hidePlayingIcon();
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
   * @returns {boolean}
   */
  isActive() {
    const tab = this.webPanelsBrowser.getWebPanelTab(this.getUUID());
    return tab && tab.selected;
  }

  remove() {
    this.webPanelsBrowser.removeWebPanelTab(this.getUUID());
    this.#button.remove();
  }

  /**
   *
   * @returns {WebPanelSettings}
   */
  dumpSettings() {
    return new WebPanelSettings(
      this.#settings.uuid,
      this.#settings.url,
      this.#settings.faviconURL,
      {
        pinned: this.#settings.pinned,
        width: this.#settings.width,
        mobile: this.#settings.mobile,
        zoom: this.#settings.zoom,
        loadOnStartup: this.#settings.loadOnStartup,
        unloadOnClose: this.#settings.unload,
        hideToolbar: this.#settings.hideToolbar,
        userContextId: this.#settings.userContextId,
      },
    );
  }
}
