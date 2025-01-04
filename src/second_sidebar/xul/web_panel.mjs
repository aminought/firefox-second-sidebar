/* eslint-disable no-unused-vars */
import { Browser } from "./base/browser.mjs";
import { WebPanelTab } from "./web_panel_tab.mjs";
/* eslint-enable no-unused-vars */

const MOBILE_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36";

/**
 *
 * @param {WebPanelTab} webPanelTab
 * @returns {HTMLElement}
 */
const createBrowserForTab = (webPanelTab, userContextId) => {
  webPanelTab.element.userContextId = userContextId;

  const result = gBrowser._createBrowserForTab(webPanelTab.getXUL(), {});
  return result.browser;
};

export class WebPanel extends Browser {
  /**
   *
   * @param {WebPanelTab} webPanelTab
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {boolean} pinned
   * @param {string} width
   * @param {boolean} mobile
   * @param {number} zoom
   * @param {boolean} loadOnStartup
   * @param {boolean} unloadOnClose
   * @param {boolean} hideToolbar
   * @param {number} userContextId
   *
   */
  constructor(
    webPanelTab,
    uuid,
    url,
    faviconURL,
    pinned,
    width,
    mobile,
    zoom,
    loadOnStartup,
    unloadOnClose,
    hideToolbar,
    userContextId,
  ) {
    super({
      classList: ["web-panel"],
      element: createBrowserForTab(webPanelTab, userContextId),
    });
    this.setUUID(uuid)
      .setDisableGlobalHistory("true")
      .setType("content")
      .setRemote("true")
      .setUserContextId(userContextId);

    this.uuid = uuid;
    this.url = url;
    this.faviconURL = faviconURL;
    this.pinned = pinned;
    this.width = width;
    this.mobile = mobile;
    this.zoom = zoom;
    this.loadOnStartup = loadOnStartup;
    this.unloadOnClose = unloadOnClose;
    this.hideToolbar = hideToolbar;
    this.userContextId = userContextId;
    this.listener = null;
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanel}
   */
  setUUID(uuid) {
    return this.setAttribute("uuid", uuid);
  }

  /**
   *
   * @returns {WebPanel}
   */
  updateUserAgent() {
    return this.setCustomUserAgent(this.mobile ? MOBILE_USER_AGENT : "");
  }

  /**
   *
   * @returns {WebPanel}
   */
  updateUserContextId(contextId) {
    return this.setUserContextId(contextId);
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    return !this.hidden();
  }

  /**
   *
   * @param {function(boolean):void} callback
   * @returns {WebPanel}
   */
  listenPlaybackStateChange(callback) {
    const mediaController = this.element.browsingContext.mediaController;
    mediaController.onplaybackstatechange = () => {
      callback(mediaController.isPlaying);
    };
    return this;
  }

  /**
   *
   * @param {function():void} callback
   * @returns {WebPanel}
   */
  listenBrowserProgressListener(callback) {
    this.listener = {
      QueryInterface: ChromeUtils.generateQI([
        "nsIWebProgressListener",
        "nsISupportsWeakReference",
      ]),
      onLocationChange: callback,
      onStateChange: callback,
      onProgressChange: callback,
      onStatusChange: callback,
    };
    this.addProgressListener(this.listener);
    return this;
  }

  /**
   *
   * @returns {WebPanel}
   */
  goHome() {
    if (this.getZoom() !== this.zoom) {
      this.setZoom(this.zoom);
    }
    this.updateUserAgent();
    this.updateUserContextId(this.userContextId);
    return this.go(this.url);
  }

  /**
   *
   * @param {boolean} isUnloaded
   * @returns {WebPanel}
   */
  zoomIn(isUnloaded) {
    if (isUnloaded) {
      this.zoom = Math.min(
        Math.round((this.zoom + this.ZOOM_DELTA) * 100) / 100,
        ZoomManager.MAX,
      );
    } else {
      Browser.prototype.zoomIn.call(this);
      this.zoom = this.getZoom();
    }
    return this;
  }

  /**
   *
   * @param {boolean} isUnloaded
   * @returns {WebPanel}
   */
  zoomOut(isUnloaded) {
    if (isUnloaded) {
      this.zoom = Math.max(
        Math.round((this.zoom - this.ZOOM_DELTA) * 100) / 100,
        ZoomManager.MIN,
      );
    } else {
      Browser.prototype.zoomOut.call(this);
      this.zoom = this.getZoom();
    }
    return this;
  }

  /**
   *
   * @param {number}
   * @param {boolean} isUnloaded
   * @returns {WebPanel}
   */
  setZoom(value, isUnloaded) {
    if (isUnloaded) {
      this.zoom = value;
    } else {
      Browser.prototype.setZoom.call(this, value);
      this.zoom = this.getZoom();
    }
    return this;
  }
}
