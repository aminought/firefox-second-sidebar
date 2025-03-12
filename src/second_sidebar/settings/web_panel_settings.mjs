import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";

export class WebPanelSettings {
  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {object?} params
   * @param {boolean?} params.pinned
   * @param {string?} params.width
   * @param {boolean?} params.mobile
   * @param {number?} params.zoom
   * @param {boolean?} params.loadOnStartup
   * @param {boolean?} params.unloadOnClose
   * @param {boolean?} params.hideToolbar
   * @param {string?} params.userContextId
   * @param {number} params.periodicReload
   * @param {number} params.hideSoundIcon
   * @param {number} params.hideNotificationBadge
   */
  constructor(
    uuid,
    url,
    faviconURL,
    {
      pinned,
      width,
      mobile,
      zoom,
      loadOnStartup,
      unloadOnClose,
      hideToolbar,
      userContextId,
      periodicReload,
      hideSoundIcon,
      hideNotificationBadge,
    } = {},
  ) {
    /**@type {string} */
    this.uuid = uuid ?? crypto.randomUUID();
    /**@type {string} */
    this.url = url;
    /**@type {string} */
    this.faviconURL = faviconURL;
    /**@type {boolean} */
    this.pinned = pinned ?? false;
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
    /**@type {number?} */
    this.periodicReload = periodicReload ?? 0;
    /**@type {boolean} */
    this.hideSoundIcon = hideSoundIcon ?? false;
    /**@type {boolean} */
    this.hideNotificationBadge = hideNotificationBadge ?? false;
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
      periodicReload: this.periodicReload,
      hideSoundIcon: this.hideSoundIcon,
      hideNotificationBadge: this.hideNotificationBadge,
    };
  }
}
