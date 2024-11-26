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
            webPanelPref.pinned,
            webPanelPref.width,
            webPanelPref.mobile,
            webPanelPref.zoom,
            webPanelPref.loadOnStartup,
            webPanelPref.unloadOnClose,
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
