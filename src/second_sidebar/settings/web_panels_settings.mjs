import { Settings } from "./settings.mjs";
import { WebPanelSettings } from "./web_panel_settings.mjs";

const PREF = "second-sidebar.web-panels";

export class WebPanelsSettings {
  /**@type {Array<WebPanelSettings} */
  #webPanels = [];

  /**
   *
   * @param {Array<WebPanelSettings>} webPanels
   */
  constructor(webPanels) {
    this.#webPanels = webPanels;
  }

  get webPanels() {
    return this.#webPanels;
  }

  /**
   *
   * @param {string} position
   * @param {string} defaultFloatingOffset
   * @returns {WebPanelsSettings}
   */
  static load(position, defaultFloatingOffset) {
    const pref = Settings.load(PREF) ?? [];

    return new WebPanelsSettings(
      pref.map(
        (webPanelPref) =>
          new WebPanelSettings(
            position,
            `var(--space-${defaultFloatingOffset})`,
            webPanelPref.uuid,
            webPanelPref.url,
            webPanelPref.faviconURL,
            {
              pinned: webPanelPref.pinned,
              anchor: webPanelPref.anchor,
              marginTop: webPanelPref.marginTop,
              marginLeft: webPanelPref.marginLeft,
              marginRight: webPanelPref.marginRight,
              marginBottom: webPanelPref.marginBottom,
              width: webPanelPref.width,
              height: webPanelPref.height,
              alwaysOnTop: webPanelPref.alwaysOnTop,
              mobile: webPanelPref.mobile,
              zoom: webPanelPref.zoom,
              loadOnStartup: webPanelPref.loadOnStartup,
              unloadOnClose: webPanelPref.unloadOnClose,
              hideToolbar: webPanelPref.hideToolbar,
              userContextId: webPanelPref.userContextId,
              periodicReload: webPanelPref.periodicReload,
              hideSoundIcon: webPanelPref.hideSoundIcon,
              hideNotificationBadge: webPanelPref.hideNotificationBadge,
              selectorEnabled: webPanelPref.selectorEnabled,
              selector: webPanelPref.selector,
            },
          ),
      ),
    );
  }

  save() {
    Settings.save(
      PREF,
      this.#webPanels.map((webPanel) => webPanel.toObject()),
    );
  }
}
