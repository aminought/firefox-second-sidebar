import { Settings } from "./settings.mjs";

const PREF = "second-sidebar.settings";

export class SidebarSettings {
  /**@type {string} */
  #position;
  /**@type {string} */
  #padding;
  /**@type {string} */
  #newWebPanelPosition;
  /**@type {string} */
  #unpinnedPadding;
  /**@type {boolean} */
  #hideInPopupWindows;
  /**@type {boolean} */
  #autoHideBackButton;
  /**@type {boolean} */
  #autoHideForwardButton;

  /**
   *
   * @param {string} position
   * @param {string} padding
   * @param {string} newWebPanelPosition
   * @param {string} unpinnedPadding
   * @param {boolean} hideInPopupWindows
   * @param {boolean} autoHideBackButton
   * @param {boolean} autoHideForwardButton
   */
  constructor(
    position,
    padding,
    newWebPanelPosition,
    unpinnedPadding,
    hideInPopupWindows,
    autoHideBackButton,
    autoHideForwardButton,
  ) {
    this.#position = position;
    this.#padding = padding;
    this.#newWebPanelPosition = newWebPanelPosition;
    this.#unpinnedPadding = unpinnedPadding;
    this.#hideInPopupWindows = hideInPopupWindows;
    this.#autoHideBackButton = autoHideBackButton;
    this.#autoHideForwardButton = autoHideForwardButton;
  }

  get position() {
    return this.#position;
  }

  get padding() {
    return this.#padding;
  }

  get newWebPanelPosition() {
    return this.#newWebPanelPosition;
  }

  get unpinnedPadding() {
    return this.#unpinnedPadding;
  }

  get hideInPopupWindows() {
    return this.#hideInPopupWindows;
  }

  get autoHideBackButton() {
    return this.#autoHideBackButton;
  }

  get autoHideForwardButton() {
    return this.#autoHideForwardButton;
  }

  /**
   *
   * @returns {SidebarSettings}
   */
  static load() {
    const pref = Settings.load(PREF) ?? {};
    return new SidebarSettings(
      pref.position ?? "right",
      pref.padding ?? "small",
      pref.newWebPanelPosition ?? "before",
      pref.unpinnedPadding ?? "small",
      pref.hideInPopupWindows ?? false,
      pref.autoHideBackButton ?? false,
      pref.autoHideForwardButton ?? false,
    );
  }

  save() {
    Settings.save(PREF, {
      position: this.#position,
      padding: this.#padding,
      newWebPanelPosition: this.#newWebPanelPosition,
      unpinnedPadding: this.#unpinnedPadding,
      hideInPopupWindows: this.#hideInPopupWindows,
      autoHideBackButton: this.#autoHideBackButton,
      autoHideForwardButton: this.#autoHideForwardButton,
    });
  }
}
