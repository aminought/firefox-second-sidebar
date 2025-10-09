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
   * @param {string} sidebarPosition
   * @param {string} defaultFloatingOffset
   * @returns {WebPanelsSettings}
   */
  static load(sidebarPosition, defaultFloatingOffset) {
    const pref = Settings.load(PREF) ?? [];

    return new WebPanelsSettings(
      pref.map((webPanelPref) =>
        WebPanelSettings.fromObject(
          sidebarPosition,
          `var(--space-${defaultFloatingOffset})`,
          webPanelPref,
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
