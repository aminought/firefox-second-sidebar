import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";

export class WebPanelSettings {
  /**
   *
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
   * @param {string} userContextId
   */
  constructor(
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
    /**@type {string} */
    this.uuid = uuid ?? crypto.randomUUID();
    /**@type {string} */
    this.url = url;
    /**@type {string} */
    this.faviconURL = faviconURL;
    /**@type {boolean} */
    this.pinned = pinned ?? true;
    /**@type {string} */
    this.width = width ?? "400";
    /**@type {boolean} */
    this.mobile = mobile ?? false;
    /**@type {number} */
    this.zoom = zoom ?? 1;
    /**@type {boolean} */
    this.loadOnStartup = loadOnStartup ?? false;
    /**@type {boolean} */
    this.unloadOnClose = unloadOnClose ?? false;
    /**@type {boolean} */
    this.hideToolbar = hideToolbar ?? false;
    /**@type {number} */
    this.userContextId =
      userContextId ?? ScriptSecurityManagerWrapper.DEFAULT_USER_CONTEXT_ID;
  }

  /**
   *
   * @returns {object}
   */
  toObject() {
    return {
      uuid: this.uuid,
      url: this.url,
      faviconURL: this.faviconURL,
      pinned: this.pinned,
      width: this.width,
      mobile: this.mobile,
      zoom: this.zoom,
      loadOnStartup: this.loadOnStartup,
      unloadOnClose: this.unloadOnClose,
      hideToolbar: this.hideToolbar,
      userContextId: this.userContextId,
    };
  }
}
