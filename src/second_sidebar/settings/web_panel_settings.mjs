import { FloatingWebPanelGeometrySettings } from "./floating_web_panel_geometry_settings.mjs";
import { PinnedWebPanelGeometrySettings } from "./pinned_web_panel_geometry_settings.mjs";
import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";

export class WebPanelSettings {
  /**
   *
   * @param {string} sidebarPosition
   * @param {string} defaultFloatingOffsetCSS
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {object} params
   * @param {boolean} params.pinned
   * @param {boolean} params.alwaysOnTop
   * @param {boolean} params.mobile
   * @param {number} params.zoom
   * @param {boolean} params.loadOnStartup
   * @param {boolean} params.unloadOnClose
   * @param {boolean} params.hideToolbar
   * @param {string} params.userContextId
   * @param {number} params.periodicReload
   * @param {boolean} params.hideSoundIcon
   * @param {boolean} params.hideNotificationBadge
   * @param {boolean} params.selectorEnabled
   * @param {string} params.selector
   * @param {FloatingWebPanelGeometrySettings} params.floatingGeometry
   * @param {PinnedWebPanelGeometrySettings} params.pinnedGeometry
   */
  constructor(
    sidebarPosition,
    defaultFloatingOffsetCSS,
    uuid,
    url,
    faviconURL,
    {
      pinned = false,
      alwaysOnTop = false,
      mobile = false,
      zoom = 1,
      loadOnStartup = true,
      unloadOnClose = false,
      hideToolbar = false,
      userContextId = ScriptSecurityManagerWrapper.DEFAULT_USER_CONTEXT_ID,
      periodicReload = 0,
      hideSoundIcon = false,
      hideNotificationBadge = false,
      selectorEnabled = false,
      selector = "",
      floatingGeometry = new FloatingWebPanelGeometrySettings(
        sidebarPosition,
        defaultFloatingOffsetCSS,
      ),
      pinnedGeometry = new PinnedWebPanelGeometrySettings(),
    } = {},
  ) {
    this.uuid = uuid;
    this.url = url;
    this.faviconURL = faviconURL;
    this.pinned = pinned;
    this.alwaysOnTop = alwaysOnTop;
    this.mobile = mobile;
    this.zoom = zoom;
    this.loadOnStartup = loadOnStartup;
    this.unloadOnClose = unloadOnClose;
    this.hideToolbar = hideToolbar;
    this.userContextId = userContextId;
    this.periodicReload = periodicReload;
    this.hideSoundIcon = hideSoundIcon;
    this.hideNotificationBadge = hideNotificationBadge;
    this.selectorEnabled = selectorEnabled;
    this.selector = selector;
    this.floatingGeometry = floatingGeometry;
    this.pinnedGeometry = pinnedGeometry;
  }

  /**
   *
   * @param {string} sidebarPosition
   * @param {string} defaultFloatingOffsetCSS
   * @param {object} object
   * @returns {WebPanelSettings}
   */
  static fromObject(sidebarPosition, defaultFloatingOffsetCSS, object) {
    return new WebPanelSettings(
      sidebarPosition,
      defaultFloatingOffsetCSS,
      object.uuid,
      object.url,
      object.faviconURL,
      {
        pinned: object.pinned,
        alwaysOnTop: object.alwaysOnTop,
        mobile: object.mobile,
        zoom: object.zoom,
        loadOnStartup: object.loadOnStartup,
        unloadOnClose: object.unloadOnClose,
        hideToolbar: object.hideToolbar,
        userContextId: object.userContextId,
        periodicReload: object.periodicReload,
        hideSoundIcon: object.hideSoundIcon,
        hideNotificationBadge: object.hideNotificationBadge,
        selectorEnabled: object.selectorEnabled,
        selector: object.selector,
        floatingGeometry: FloatingWebPanelGeometrySettings.fromObject(
          sidebarPosition,
          defaultFloatingOffsetCSS,
          object.floatingGeometry,
        ),
        pinnedGeometry: PinnedWebPanelGeometrySettings.fromObject(
          object.pinnedGeometry,
        ),
      },
    );
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
      alwaysOnTop: this.alwaysOnTop,
      mobile: this.mobile,
      zoom: this.zoom,
      loadOnStartup: this.loadOnStartup,
      unloadOnClose: this.unloadOnClose,
      hideToolbar: this.hideToolbar,
      userContextId: this.userContextId,
      periodicReload: this.periodicReload,
      hideSoundIcon: this.hideSoundIcon,
      hideNotificationBadge: this.hideNotificationBadge,
      selectorEnabled: this.selectorEnabled,
      selector: this.selector,
      floatingGeometry: this.floatingGeometry.toObject(),
      pinnedGeometry: this.pinnedGeometry.toObject(),
    };
  }
}
