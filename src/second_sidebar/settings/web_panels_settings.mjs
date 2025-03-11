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
   * @returns {WebPanelsSettings}
   */
  static load() {
    const pref = Settings.load(PREF) ?? [];

    return new WebPanelsSettings(
      pref.map(
        (webPanelPref) =>
          new WebPanelSettings(
            webPanelPref.uuid,
            webPanelPref.url,
            webPanelPref.faviconURL,
            {
              pinned: webPanelPref.pinned,
              width: webPanelPref.width,
              mobile: webPanelPref.mobile,
              zoom: webPanelPref.zoom,
              loadOnStartup: webPanelPref.loadOnStartup,
              unloadOnClose: webPanelPref.unloadOnClose,
              hideToolbar: webPanelPref.hideToolbar,
              userContextId: webPanelPref.userContextId,
              periodicReload: webPanelPref.periodicReload,
              hideSoundIcon: webPanelPref.hideSoundIcon,
              hideNotificationBadge: webPanelPref.hideNotificationBadge,
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
