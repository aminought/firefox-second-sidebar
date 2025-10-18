import { FALLBACK_ICON, fetchIconURL } from "../utils/icons.mjs";
import { clearUrl, extractHostname } from "../utils/url.mjs";
import { isLeftMouseButton, isMiddleMouseButton } from "../utils/buttons.mjs";

import { ChromeUtilsWrapper } from "../wrappers/chrome_utils.mjs";
import { PinnedWebPanelGeometrySettings } from "../settings/pinned_web_panel_geometry_settings.mjs"; // eslint-disable-line no-unused-vars
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelState } from "../settings/web_panel_state.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs"; // eslint-disable-line no-unused-vars
import { ZoomManagerWrapper } from "../wrappers/zoom_manager.mjs";
import { parseNotifications } from "../utils/string.mjs";

const DEFAULT_ZOOM = 1;

export class WebPanelController {
  #progressListener = this.#createProgressListener();
  /**@type {WebPanelSettings} */
  #settings;
  /**@type {WebPanelState} */
  #state;
  /**@type {WebPanelButton} */
  #button;
  /**@type {WebPanelTab?} */
  #tab = null;
  /**@type {number} */
  #interval = null;

  /**
   *
   * @param {WebPanelSettings} settings
   * @param {WebPanelState} state
   * @param {object?} params
   * @param {boolean?} params.loaded
   * @param {string?} params.position
   */
  constructor(settings, state, { loaded = false, position = null } = {}) {
    this.#settings = settings;
    this.#state = state;
    this.#button = this.#createWebPanelButton(settings, loaded, position);

    if (loaded) this.load();
  }

  #createProgressListener() {
    const callback = () => this.updateTitle();
    const onStateChange = (aWebProgress, aRequest, aFlag) => {
      callback();
      const STATE_STOP = Ci.nsIWebProgressListener2.STATE_STOP;
      const STATE_IS_WINDOW = Ci.nsIWebProgressListener2.STATE_IS_WINDOW;
      if (
        aWebProgress.isTopLevel &&
        aFlag & STATE_STOP &&
        aFlag & STATE_IS_WINDOW
      ) {
        this.#state.lastUrl = this.getTabUrl();
        SidebarControllers.webPanelsController.saveState();
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
    button.setAttribute("temporary", settings.temporary);

    let tooltipTimer = null;

    button.addEventListener("mouseenter", () => {
      tooltipTimer = setTimeout(() => {
        SidebarControllers.webPanelTooltipController.openPopup(this);
      }, 500);
    });

    button.addEventListener("mouseleave", () => {
      clearTimeout(tooltipTimer);
      SidebarControllers.webPanelTooltipController.hidePopup();
    });

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      clearTimeout(tooltipTimer);
      SidebarControllers.webPanelTooltipController.hidePopup();
      if (isLeftMouseButton(event)) {
        this.switchWebPanel();
      } else if (isMiddleMouseButton(event)) {
        if (this.isActive()) {
          SidebarControllers.sidebarController.close();
        }
        this.unload();
      }
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
   * @returns {string?}
   */
  getTabUrl() {
    return this.#tab?.linkedBrowser?.getCurrentUrl();
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
   * @returns {string}
   */
  getUrlForTooltip() {
    const tabUrl = this.getTabUrl();
    const url = this.isTitleDynamic() && tabUrl ? tabUrl : this.#settings.url;
    const fullUrlSetting =
      SidebarControllers.sidebarController.getWebPanelTooltipFullUrl();
    return fullUrlSetting ? clearUrl(url) : extractHostname(url);
  }

  /**
   *
   * @param {string} value
   */
  setURL(value) {
    this.#settings.url = value;
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
   * @returns {string?}
   */
  getTabTitle() {
    return this.#tab?.linkedBrowser?.getTitle();
  }

  /**
   *
   * @returns {boolean}
   */
  isTitleDynamic() {
    return this.#settings.dynamicTitle;
  }

  /**
   *
   * @returns {string?}
   */
  getTitle() {
    return this.isTitleDynamic() ? this.getTabTitle() : this.#settings.title;
  }

  /**
   *
   * @param {boolean} dynamicTitle
   * @param {string} title
   */
  setTitle(dynamicTitle, title) {
    this.#settings.dynamicTitle = dynamicTitle;
    this.#settings.title = title;
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
   * @param {boolean} dynamicFavicon
   * @param {string} faviconURL
   */
  setFaviconURL(dynamicFavicon, faviconURL) {
    this.#settings.dynamicFavicon = dynamicFavicon;
    this.#settings.faviconURL = faviconURL;
  }

  updateFavicon() {
    let image = this.#settings.dynamicFavicon
      ? this.#tab.image
      : this.#settings.faviconURL;
    if (!image || image.length === 0) image = FALLBACK_ICON;
    const busy = this.#tab.getAttributeBool("busy");
    const progress = this.#tab.getAttributeBool("progress");
    if (busy || progress) {
      this.#button.setLoading(true).setIcon("");
    } else {
      this.#button.setLoading(false).setIcon(image);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    return this.#tab && this.#tab.selected;
  }

  updateTitle() {
    if (this.isActive()) {
      SidebarControllers.sidebarController.updateToolbar(this);
    }
    const title = this.getTabTitle();
    const notifications = parseNotifications(title);
    this.#button.setNotificationBadge(notifications);
  }

  updateSoundIcon() {
    const soundplaying = this.#tab.getAttributeBool("soundplaying");
    const muted = this.#tab.getAttributeBool("muted");
    this.#button.setSoundIcon(soundplaying, muted);
  }

  /**
   *
   * @param {object} params
   * @param {boolean} params.forceOpen
   */
  switchWebPanel({ forceOpen = false } = {}) {
    const activeTab = SidebarElements.webPanelsBrowser.getActiveWebPanelTab();

    if (activeTab.uuid === this.getUUID() && !forceOpen) {
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
    SidebarControllers.sidebarController.open();
  }

  close() {
    if (this.#settings.temporary) {
      this.remove();
      SidebarControllers.webPanelsController.delete(this.getUUID());
      SidebarControllers.webPanelsController.saveSettings();
    } else {
      this.#button.setOpen(false);
      if (this.#settings.unloadOnClose) {
        this.unload();
      }
    }
  }

  load() {
    this.#tab = SidebarElements.webPanelsBrowser.addWebPanelTab(
      this.#settings,
      this.#progressListener,
    );
    this.#tab.addTabCloseListener(() => this.unload(false));
    this.#tab.addTabAttrModifiedListener(
      (soundplaying, muted, image, busy, progress, label) => {
        if (soundplaying || muted) this.updateSoundIcon();
        if (image || busy || progress) this.updateFavicon();
        if (label) this.updateTitle();
      },
    );
    this.#button.setUnloaded(false);
    this.#startTimer();

    const url = this.#settings.loadLastUrl
      ? (this.#state?.lastUrl ?? this.#settings.url)
      : this.#settings.url;
    this.go(url);
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

    if (this.#button.getLoading()) {
      fetchIconURL(this.#settings.url).then((faviconUrl) => {
        this.#button.setLoading(false).setIcon(faviconUrl);
      });
    }

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
  }

  /**
   *
   * @returns {boolean}
   */
  canGoBack() {
    return this.#tab.linkedBrowser.canGoBack();
  }

  /**
   *
   * @returns {boolean}
   */
  canGoForward() {
    return this.#tab.linkedBrowser.canGoForward();
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
  setTemporary(value) {
    this.#settings.temporary = value;
    this.#button.setAttribute("temporary", value);
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
      this.reload();
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
   * @param {boolean} value
   */
  setLoadLastUrl(value) {
    this.#settings.loadLastUrl = value;
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
   * @returns {string}
   */
  getShortcut() {
    return this.#settings.shortcut;
  }

  /**
   *
   * @param {string} value
   */
  setShortcut(value) {
    this.#settings.shortcut = value;
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
    this.#settings.floatingGeometry.width = `${width}px`;
  }

  /**
   *
   * @returns {string}
   */
  getAnchor() {
    return this.#settings.floatingGeometry.anchor;
  }

  /**
   *
   * @param {string} anchor
   */
  setAnchor(anchor) {
    this.#settings.floatingGeometry.anchor = anchor;
  }

  /**
   *
   * @returns {string}
   */
  getOffsetXType() {
    return this.#settings.floatingGeometry.offsetXType;
  }

  /**
   *
   * @param {string} offsetXType
   */
  setOffsetXType(offsetXType) {
    this.#settings.floatingGeometry.offsetXType = offsetXType;
  }

  /**
   *
   * @returns {string}
   */
  getOffsetYType() {
    return this.#settings.floatingGeometry.offsetYType;
  }

  /**
   *
   * @param {string} offsetYType
   */
  setOffsetYType(offsetYType) {
    this.#settings.floatingGeometry.offsetYType = offsetYType;
  }

  /**
   *
   * @returns {string}
   */
  getWidthType() {
    return this.#settings.floatingGeometry.widthType;
  }

  /**
   *
   * @param {string} widthType
   */
  setWidthType(widthType) {
    this.#settings.floatingGeometry.widthType = widthType;
  }

  /**
   *
   * @returns {string}
   */
  getHeightType() {
    return this.#settings.floatingGeometry.heightType;
  }

  /**
   *
   * @param {string} heightType
   */
  setHeightType(heightType) {
    this.#settings.floatingGeometry.heightType = heightType;
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
   * @returns {FloatingWebPanelGeometrySettings}
   */
  getFloatingGeometry() {
    return this.#settings.floatingGeometry;
  }

  /**
   *
   * @param {FloatingWebPanelGeometrySettings} geometry
   */
  setFloatingGeometry(geometry) {
    this.#settings.floatingGeometry = geometry;
  }

  /**
   *
   * @returns {PinnedWebPanelGeometrySettings}
   */
  getPinnedGeometry() {
    return this.#settings.pinnedGeometry;
  }

  /**
   *
   * @param {string} width
   */
  setPinnedGeometry(width) {
    this.#settings.pinnedGeometry.width = width;
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
    return WebPanelSettings.fromObject(
      SidebarElements.sidebarWrapper.getPosition(),
      SidebarControllers.sidebarGeometry.getDefaultFloatingOffsetCSS(),
      this.#settings.toObject(),
    );
  }

  /**
   *
   * @returns {WebPanelState}
   */
  dumpState() {
    return WebPanelState.fromObject(this.#state.toObject());
  }

  /**
   *
   * @param {string} message
   */
  #log(message) {
    console.log(`Web panel ${this.getUUID()}:`, message);
  }
}
