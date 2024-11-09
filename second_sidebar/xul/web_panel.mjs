import { Browser } from "./base/browser.mjs";

export class WebPanel extends Browser {
  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {boolean} pinned
   * @param {string} width
   * @param {boolean} loadOnStartup
   * @param {boolean} unloadOnClose
   * @param {object} params
   * @param {HTMLElement?} params.element
   *
   */
  constructor(
    uuid,
    url,
    faviconURL,
    pinned = false,
    width = "400",
    loadOnStartup = false,
    unloadOnClose = false,
    { element } = {}
  ) {
    super({ classList: ["web-panel"], element });
    this.setDisableGlobalHistory("true").setType("content").setRemote("true");

    this.uuid = uuid;
    this.url = url;
    this.faviconURL = faviconURL;
    this.pinned = pinned;
    this.width = width;
    this.loadOnStartup = loadOnStartup;
    this.unloadOnClose = unloadOnClose;

    this.listener = null;
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
    mediaController.addEventListener("playbackstatechange", () => {
      callback(mediaController.isPlaying);
    });
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
    return this.go(this.url);
  }
}
