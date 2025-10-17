import { Settings } from "./settings.mjs";
import { WebPanelState } from "./web_panel_state.mjs";

const PREF = "second-sidebar.web-panels-state";

export class WebPanelsState {
  /**
   *
   * @param {Array<WebPanelState>} webPanelsState
   */
  constructor(webPanelsState) {
    this.webPanelsState = webPanelsState;
  }

  /**
   *
   * @returns {WebPanelsState}
   */
  static load() {
    const pref = Settings.load(PREF) ?? [];

    return new WebPanelsState(
      pref.map((webPanelStatePref) =>
        WebPanelState.fromObject(webPanelStatePref),
      ),
    );
  }

  save() {
    Settings.save(
      PREF,
      this.webPanelsState.map((webPanelState) => webPanelState.toObject()),
    );
  }
}
