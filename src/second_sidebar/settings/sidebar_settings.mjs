import { Settings } from "./settings.mjs";

const PREF = "second-sidebar.settings";

export class SidebarSettings {
  /**@type {string} */
  #position;
  /**@type {string} */
  #webPanelButtonsPosition;
  /**@type {string} */
  #plusButtonPosition;
  /**@type {string} */
  #padding;
  /**@type {number} */
  #faviconSize;
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
   * @param {string} webPanelButtonsPosition
   * @param {string} plusButtonPosition
   * @param {string} padding
   * @param {string} faviconSize
   * @param {string} unpinnedPadding
   * @param {boolean} hideInPopupWindows
   * @param {boolean} autoHideBackButton
   * @param {boolean} autoHideForwardButton
   */
  constructor(
    position,
    webPanelButtonsPosition,
    plusButtonPosition,
    padding,
    faviconSize,
    unpinnedPadding,
    hideInPopupWindows,
    autoHideBackButton,
    autoHideForwardButton,
  ) {
    this.#position = position;
    this.#webPanelButtonsPosition = webPanelButtonsPosition;
    this.#plusButtonPosition = plusButtonPosition;
    this.#padding = padding;
    this.#faviconSize = faviconSize;
    this.#unpinnedPadding = unpinnedPadding;
    this.#hideInPopupWindows = hideInPopupWindows;
    this.#autoHideBackButton = autoHideBackButton;
    this.#autoHideForwardButton = autoHideForwardButton;
  }

  get position() {
    return this.#position;
  }

  get webPanelButtonsPosition() {
    return this.#webPanelButtonsPosition;
  }

  get plusButtonPosition() {
    return this.#plusButtonPosition;
  }

  get padding() {
    return this.#padding;
  }

  get faviconSize() {
    return this.#faviconSize;
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
      pref.webPanelButtonsPosition ?? "start",
      pref.plusButtonPosition ?? "end",
      pref.padding ?? "small",
      pref.faviconSize ?? 32,
      pref.unpinnedPadding ?? "small",
      pref.hideInPopupWindows ?? false,
      pref.autoHideBackButton ?? false,
      pref.autoHideForwardButton ?? false,
    );
  }

  save() {
    Settings.save(PREF, {
      position: this.#position,
      webPanelButtonsPosition: this.#webPanelButtonsPosition,
      plusButtonPosition: this.#plusButtonPosition,
      padding: this.#padding,
      faviconSize: this.#faviconSize,
      unpinnedPadding: this.#unpinnedPadding,
      hideInPopupWindows: this.#hideInPopupWindows,
      autoHideBackButton: this.#autoHideBackButton,
      autoHideForwardButton: this.#autoHideForwardButton,
    });
  }
}
