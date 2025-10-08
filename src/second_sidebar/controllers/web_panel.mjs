import { FALLBACK_ICON, useAvailableIcon } from "../utils/icons.mjs";
import { WebPanelEvents, sendEvent } from "./events.mjs";

import { ChromeUtilsWrapper } from "../wrappers/chrome_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs"; // eslint-disable-line no-unused-vars
import { ZoomManagerWrapper } from "../wrappers/zoom_manager.mjs";

const DEFAULT_ZOOM = 1;

export class WebPanelController {
  #progressListener = this.#createProgressListener();
  /**@type {WebPanelSettings} */
  #settings;
  /**@type {WebPanelButton} */
  #button;
  /**@type {WebPanelTab?} */
  #tab = null;
  /**@type {number} */
  #interval = null;

  /**
   *
   * @param {WebPanelSettings} settings
   * @param {object?} params
   * @param {boolean?} params.loaded
   * @param {string?} params.position
   */
  constructor(settings, { loaded = false, position = null } = {}) {
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
        SidebarElements.sidebarToolbar.setTitle(title);
        SidebarElements.sidebarToolbar.toggleBackButton(!canGoBack);
        SidebarElements.sidebarToolbar.toggleForwardButton(!canGoForward);
      }
    };
    const onStateChange = (aWebProgress, aRequest, aFlag) => {
      callback();
      const STATE_STOP = Ci.nsIWebProgressListener2.STATE_STOP;
      const STATE_IS_WINDOW = Ci.nsIWebProgressListener2.STATE_IS_WINDOW;
      if (
        aWebProgress.isTopLevel &&
        aFlag & STATE_STOP &&
        aFlag & STATE_IS_WINDOW
      ) {
        if (this.getSelectorEnabled()) {
          setTimeout(() => this.#applySelector(), 100);
        }
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
      onStateChange: onStateChange,
      onStatusChange: callback,
    };
  }

  #applySelector() {
    const selector = this.getSelector();
    if (!this.getSelectorEnabled() || selector === "") {
      return;
    }
    const script = `javascript:(() => {
      var toDelete = [];
      var e = document.querySelector('${selector}');
      e.style.margin = 0;
      while (e.nodeName != "BODY") {
        for (var c of e.parentElement.children) {
          if (!["STYLE", "SCRIPT"].includes(c.nodeName) && c !== e) {
            toDelete.push({ parent: e.parentElement, child: c });
          }
        }
        e.style.overflow = "visible";
        e.style.minWidth = "0px";
        e.style.minHeight = "0px";
        e.style.gridGap = "0px";
        e = e.parentElement;
        e.style.padding = 0;
        e.style.margin = 0;
        e.style.transform = "none";
      }
      toDelete.forEach((e) => {
        e.parent.removeChild(e.child);
      });
      const body = document.querySelector("body");
      body.style.overflow = "hidden";
      body.style.minWidth = "0px";
      body.style.minHeight = "0px";
      window.scrollTo(0, 0);
    })()`;
    this.#tab.linkedBrowser.go(script);
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
        SidebarElements.webPanelsBrowser.selectWebPanelTab(this.#tab);
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
    useAvailableIcon(faviconURL, FALLBACK_ICON).then((url) =>
      this.#button.setIcon(url),
    );
  }

  /**
   *
   * @returns {string}
   */
  getCurrentUrl() {
    return this.#tab.linkedBrowser.getCurrentUrl();
  }

  switchWebPanel() {
    const activeTab = SidebarElements.webPanelsBrowser.getActiveWebPanelTab();

    if (activeTab.uuid === this.getUUID()) {
      // Select empty web panel tab
      SidebarElements.webPanelsBrowser.deselectWebPanelTab();
    } else {
      // Create web panel tab if it was not loaded yet
      if (this.isUnloaded()) {
        this.load();
      }
      // Select web panel tab
      SidebarElements.webPanelsBrowser.selectWebPanelTab(this.#tab);
    }
  }

  open() {
    // Configure web panel and button
    this.#button.setOpen(true).setUnloaded(false);
    this.setZoom(this.#settings.zoom);

    // Open sidebar if it was closed and configure
    SidebarControllers.sidebarController.open(
      this.#settings.pinned,
      this.#settings.anchor,
      this.#settings.marginTop,
      this.#settings.marginLeft,
      this.#settings.marginRight,
      this.#settings.marginBottom,
      this.#settings.width,
      this.#settings.height,
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
    this.#tab = SidebarElements.webPanelsBrowser.addWebPanelTab(
      this.#settings,
      this.#progressListener,
    );
    this.#tab.addTabCloseListener(() => this.unload(false));
    this.#tab.addEventListener("TabAttrModified", () => {
      this.#button.setSoundIcon(this.#tab.soundPlaying, this.#tab.muted);
    });
    this.#button.setUnloaded(false);
    this.#startTimer();
  }

  /**
   *
   * @param {boolean} force
   */
  unload(force = true) {
    this.#stopTimer();
    const activeWebPanelController =
      SidebarControllers.webPanelsController.getActive();
    if (activeWebPanelController?.getUUID() === this.getUUID()) {
      SidebarElements.webPanelsBrowser.deselectWebPanelTab();
    }

    if (this.#tab && force) {
      SidebarElements.webPanelsBrowser.removeWebPanelTab(this.#tab);
    }

    this.#button
      .setSoundIcon(false, false)
      .setNotificationBadge(0)
      .setOpen(false)
      .setUnloaded(true);
    this.#tab = null;
  }

  #startTimer() {
    this.#stopTimer();
    if (this.#settings.periodicReload == 0) {
      return;
    }
    this.#log("start timer", this.#settings.periodicReload);
    this.#interval = setInterval(() => {
      this.#log("periodic reload");
      this.reload();
    }, this.#settings.periodicReload);
  }

  #stopTimer() {
    if (this.#interval) {
      this.#log("stop timer");
      clearInterval(this.#interval);
    }
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
    this.setWebPanelButtonFaviconURL(this.#settings.faviconURL);
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
   * @returns {boolean}
   */
  getAlwaysOnTop() {
    return this.#settings.alwaysOnTop;
  }

  /**
   *
   * @param {boolean} value
   */
  setAlwaysOnTop(value) {
    this.#settings.alwaysOnTop = value;
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
   * @returns {boolean}
   */
  getHideToolbar() {
    return this.#settings.hideToolbar;
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
   * @param {boolean} value
   */
  setHideSoundIcon(value) {
    this.#settings.hideSoundIcon = value;
    this.#button.hideSoundIcon(value);
  }

  /**
   *
   * @param {boolean} value
   */
  setHideNotificationBadge(value) {
    this.#settings.hideNotificationBadge = value;
    this.#button.hideNotificationBadge(value);
  }

  /**
   *
   * @param {number} value
   */
  setPeriodicReload(value) {
    this.#settings.periodicReload = value;
    if (!this.isUnloaded()) {
      this.#startTimer();
    }
  }
  /**
   *
   * @param {number} width
   */
  setPinnedWidth(width) {
    this.#settings.width = `${width}px`;
  }

  /**
   *
   * @returns {string}
   */
  getAnchor() {
    return this.#settings.anchor;
  }

  /**
   *
   * @param {string} anchor
   */
  setAnchor(anchor) {
    this.#settings.anchor = anchor;
  }

  /**
   *
   * @returns {string}
   */
  getWidthType() {
    return this.#settings.widthType;
  }

  /**
   *
   * @param {string} widthType
   */
  setWidthType(widthType) {
    this.#settings.widthType = widthType;
  }

  /**
   *
   * @returns {string}
   */
  getHeightType() {
    return this.#settings.heightType;
  }

  /**
   *
   * @param {string} heightType
   */
  setHeightType(heightType) {
    this.#settings.heightType = heightType;
  }

  /**
   *
   * @returns {boolean}
   */
  getSelectorEnabled() {
    return this.#settings.selectorEnabled;
  }

  /**
   *
   * @param {boolean} value
   */
  setSelectorEnabled(value) {
    this.#settings.selectorEnabled = value;
  }

  /**
   *
   * @returns {string?}
   */
  getSelector() {
    return this.#settings.selector;
  }

  /**
   *
   * @param {string} selector
   */
  setSelector(selector) {
    this.#settings.selector = selector;
  }

  /**
   *
   * @param {string} marginTop
   * @param {string} marginLeft
   * @param {string} marginRight
   * @param {string} marginBottom
   * @param {string} width
   * @param {string} height
   */
  setFloatingPosition(
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    width,
    height,
  ) {
    this.#settings.marginTop = marginTop;
    this.#settings.marginLeft = marginLeft;
    this.#settings.marginRight = marginRight;
    this.#settings.marginBottom = marginBottom;
    this.#settings.width = width;
    this.#settings.height = height;
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

  /**
   *
   * @returns {boolean}
   */
  isMuted() {
    return this.#tab.muted;
  }

  toggleMuteAudio() {
    this.#tab.toggleMuteAudio();
  }

  remove() {
    if (this.#tab) {
      SidebarElements.webPanelsBrowser.removeWebPanelTab(this.#tab);
    }
    this.#button.remove();
  }

  /**
   *
   * @returns {WebPanelSettings}
   */
  dumpSettings() {
    return new WebPanelSettings(
      SidebarElements.sidebarWrapper.getPosition(),
      SidebarControllers.sidebarPositionAndSize.getDefaultFloatingOffsetCSS(),
      this.#settings.uuid,
      this.#settings.url,
      this.#settings.faviconURL,
      {
        pinned: this.#settings.pinned,
        anchor: this.#settings.anchor,
        widthType: this.#settings.widthType,
        heightType: this.#settings.heightType,
        marginTop: this.#settings.marginTop,
        marginLeft: this.#settings.marginLeft,
        marginRight: this.#settings.marginRight,
        marginBottom: this.#settings.marginBottom,
        width: this.#settings.width,
        height: this.#settings.height,
        alwaysOnTop: this.#settings.alwaysOnTop,
        mobile: this.#settings.mobile,
        zoom: this.#settings.zoom,
        loadOnStartup: this.#settings.loadOnStartup,
        unloadOnClose: this.#settings.unloadOnClose,
        hideToolbar: this.#settings.hideToolbar,
        userContextId: this.#settings.userContextId,
        periodicReload: this.#settings.periodicReload,
        hideSoundIcon: this.#settings.hideSoundIcon,
        hideNotificationBadge: this.#settings.hideNotificationBadge,
        selectorEnabled: this.#settings.selectorEnabled,
        selector: this.#settings.selector,
      },
    );
  }

  /**
   *
   * @param {string} message
   */
  #log(message) {
    console.log(`Web panel ${this.getUUID()}:`, message);
  }
}
