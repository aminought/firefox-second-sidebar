/* eslint-disable no-unused-vars */
import { Browser } from "./base/browser.mjs";
import { ChromeUtilsWrapper } from "../wrappers/chrome_utils.mjs";
import { TabBrowserWrapper } from "../wrappers/tab_browser.mjs";
import { WebPanelTab } from "./web_panel_tab.mjs";
import { ZoomManagerWrapper } from "../wrappers/zoom_manager.mjs";
/* eslint-enable no-unused-vars */

const MOBILE_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36";

export class WebPanel extends Browser {
  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {object} params
   * @param {boolean} params.pinned
   * @param {string} params.width
   * @param {boolean} params.mobile
   * @param {number} params.zoom
   * @param {boolean} params.loadOnStartup
   * @param {boolean} params.unloadOnClose
   * @param {boolean} params.hideToolbar
   *
   */
  constructor(
    webPanelTab,
    uuid,
    url,
    faviconURL,
    {
      pinned = false,
      width = "400",
      mobile = false,
      zoom = 1,
      loadOnStartup = false,
      unloadOnClose = false,
      hideToolbar = false,
    } = {},
  ) {
    super({
      id: `webpanel_${uuid}`,
      classList: ["web-panel"],
      element: createBrowserForTab(webPanelTab),
    });
    this.setUUID(uuid)
      .setAttribute("disableglobalhistory", "true")
      .setAttribute("type", "content")
      .setAttribute("remote", "true");

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
   * @returns {WebPanel}
   */
  goHome() {
    if (this.getZoom() !== this.zoom) {
      this.setZoom(this.zoom);
    }
    this.updateUserAgent();
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
        ZoomManagerWrapper.MAX,
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
        ZoomManagerWrapper.MIN,
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
