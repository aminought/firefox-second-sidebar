import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";

export class WebPanelSettings {
  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {object?} params
   * @param {boolean?} params.pinned
   * @param {string?} params.attach
   * @param {string?} params.marginTop
   * @param {string?} params.marginLeft
   * @param {string?} params.marginRight
   * @param {string?} params.marginBottom
   * @param {string?} params.width
   * @param {string?} params.height
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
      attach,
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      width,
      height,
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
    /**@type {string?} */
    this.attach = attach ?? "topleft";
    /**@type {string?} */
    this.marginTop = marginTop ?? "unset";
    /**@type {string?} */
    this.marginLeft = marginLeft ?? "unset";
    /**@type {string?} */
    this.marginRight = marginRight ?? "unset";
    /**@type {string?} */
    this.marginBottom = marginBottom ?? "unset";
    /**@type {string?} */
    this.width = width ?? "400px";
    /**@type {string?} */
    this.height = height ?? "100%";
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
    /**@type {number} */
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
      attach: this.attach,
      marginTop: this.marginTop,
      marginLeft: this.marginLeft,
      marginRight: this.marginRight,
      marginBottom: this.marginBottom,
      width: this.width,
      height: this.height,
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
