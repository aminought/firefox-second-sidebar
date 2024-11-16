import { Browser } from "./base/browser.mjs";
import { WebPanelTab } from "./web_panel_tab.mjs";

const MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36";

/**
 *
 * @param {WebPanelTab} webPanelTab
 * @returns {HTMLElement}
 */
const createBrowserForTab = (webPanelTab) => {
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
   * @param {boolean} loadOnStartup
   * @param {boolean} unloadOnClose
   * @param {object} params
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
    loadOnStartup,
    unloadOnClose
  ) {
    super({
      classList: ["web-panel"],
      element: createBrowserForTab(webPanelTab),
    });
    this.setUUID(uuid)
      .setDisableGlobalHistory("true")
      .setType("content")
      .setRemote("true");

    this.uuid = uuid;
    this.url = url;
    this.faviconURL = faviconURL;
    this.pinned = pinned;
    this.width = width;
    this.mobile = mobile;
    this.loadOnStartup = loadOnStartup;
    this.unloadOnClose = unloadOnClose;

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
    this.updateUserAgent();
    return this.go(this.url);
  }
}
