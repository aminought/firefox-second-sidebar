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

const DEFAULT_ZOOM = 1;

export class WebPanelController {
  #progressListener = this.#createProgressListener();
  /**@type {WebPanelSettings} */
  #settings;
  /**@type {WebPanelButton} */
  #button;
  /**@type {WebPanelTab?} */
  #tab = null;

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
    this.#button = this.#createWebPanelButton(settings, loaded, position);
    if (loaded) {
      this.load();
    }
  }

  #createProgressListener() {
    const callback = () => {
      if (this.isActive()) {
        const title = this.#tab.linkedBrowser.getTitle();
        const canGoBack = this.#tab.linkedBrowser.canGoBack();
        const canGoForward = this.#tab.linkedBrowser.canGoForward();
        SidebarControllers.sidebarController.setToolbarTitle(title);
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
      sendEvent(WebPanelEvents.SWITCH_WEB_PANEL, {
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
    this.#button.setLabel(value).setTooltipText(value);
  }

  /**
   *
   * @param {string} userContextId
   */
  setUserContextId(userContextId) {
    this.#settings.userContextId = userContextId;

    if (!this.isUnloaded()) {
      const isActive = this.isActive();
      this.unload();
      this.load();
      if (isActive) {
        this.webPanelsBrowser.selectWebPanelTab(this.#tab);
      }
    }

    this.#button.setUserContextId(userContextId);
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
    this.#button.setIcon(faviconURL);
  }

  /**
   *
   * @returns {string}
   */
  getCurrentUrl() {
    return this.#tab.linkedBrowser.getCurrentUrl();
  }

  switchWebPanel() {
    const activeTab = this.webPanelsBrowser.getActiveWebPanelTab();

    if (activeTab.uuid === this.getUUID()) {
      // Select empty web panel tab
      this.webPanelsBrowser.deselectWebPanelTab();
    } else {
      // Create web panel tab if it was not loaded yet
      if (this.isUnloaded()) {
        this.load();
      }
      // Select web panel tab
      this.webPanelsBrowser.selectWebPanelTab(this.#tab);
    }
  }

  open() {
    // Configure web panel and button
    this.#button.setOpen(true).setUnloaded(false);
    this.setZoom(this.#settings.zoom);

    // Open sidebar if it was closed and configure
    SidebarControllers.sidebarController.open(
      this.#settings.pinned,
      this.#settings.width,
      this.#tab.linkedBrowser.canGoBack(),
      this.#tab.linkedBrowser.canGoForward(),
      this.#tab.linkedBrowser.getTitle(),
      this.#settings.hideToolbar,
    );
  }

  close() {
    this.#button.setOpen(false);
    if (this.#settings.unloadOnClose) {
      this.unload();
    }
  }

  load() {
    this.webPanelsBrowser.waitInitialization(() => {
      this.#tab = this.webPanelsBrowser.addWebPanelTab(
        this.#settings,
        this.#progressListener,
      );
      this.#tab.addTabCloseListener(() => this.unload(false));
      this.#tab.linkedBrowser.addPlaybackStateListener((isPlaying) =>
        this.#button.setPlaying(isPlaying),
      );
      this.#button.setUnloaded(false);
    });
  }

  /**
   *
   * @param {boolean} force
   */
  unload(force = true) {
    const activeWebPanelController =
      SidebarControllers.webPanelsController.getActive();
    if (activeWebPanelController?.getUUID() === this.getUUID()) {
      this.webPanelsBrowser.deselectWebPanelTab();
    }

    if (this.#tab && force) {
      this.webPanelsBrowser.removeWebPanelTab(this.#tab);
    }

    this.#button.setOpen(false).setUnloaded(true).hidePlayingIcon();
    this.#tab = null;
  }

  /**
   *
   * @returns {boolean}
   */
  isUnloaded() {
    return this.#tab === null;
  }

  reload() {
    this.#tab.linkedBrowser.reload();
  }

  goBack() {
    this.#tab.linkedBrowser.goBack();
  }

  goForward() {
    this.#tab.linkedBrowser.goForward();
  }

  goHome() {
    this.#tab.linkedBrowser.go(this.#settings.url);
  }

  /**
   *
   * @param {boolean} value
   */
  setMobile(value) {
    this.#settings.mobile = value;
    if (!this.isUnloaded()) {
      if (value) {
        this.#tab.linkedBrowser.setMobileUserAgent();
      } else {
        this.#tab.linkedBrowser.unsetMobileUserAgent();
      }
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
    const i =
      ZoomManagerWrapper.zoomValues.indexOf(
        ZoomManagerWrapper.snap(this.getZoom()),
      ) - 1;
    if (i >= 0) {
      const zoom = ZoomManagerWrapper.zoomValues[i];
      this.setZoom(zoom);
    }
  }

  zoomIn() {
    const i =
      ZoomManagerWrapper.zoomValues.indexOf(
        ZoomManagerWrapper.snap(this.getZoom()),
      ) + 1;
    if (i < ZoomManagerWrapper.zoomValues.length) {
      const zoom = ZoomManagerWrapper.zoomValues[i];
      this.setZoom(zoom);
    }
  }

  /**
   *
   * @param {number} zoom
   */
  setZoom(zoom) {
    this.#settings.zoom = zoom;
    this.#tab?.linkedBrowser?.setZoom(zoom);
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
    this.#tab.linkedBrowser.go(url);
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    return this.#tab && this.#tab.selected;
  }

  remove() {
    if (this.#tab) {
      this.webPanelsBrowser.removeWebPanelTab(this.#tab);
    }
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
