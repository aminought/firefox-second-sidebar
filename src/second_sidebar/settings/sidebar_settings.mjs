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
  #defaultFloatingOffset;
  /**@type {boolean} */
  #autoHideBackButton;
  /**@type {boolean} */
  #autoHideForwardButton;
  /**@type {string} */
  #containerBorder;
  /**@type {boolean} */
  #autoHideSidebar;
  /**@type {boolean} */
  #hideSidebarAnimated;
  /**@type {boolean} */
  #hideToolbarAnimated;

  /**
   *
   * @param {string} position
   * @param {string} padding
   * @param {string} newWebPanelPosition
   * @param {string} defaultFloatingOffset
   * @param {boolean} autoHideBackButton
   * @param {boolean} autoHideForwardButton
   * @param {string} containerBorder
   * @param {boolean} autoHideSidebar
   * @param {boolean} hideSidebarAnimated
   * @param {boolean} hideToolbarAnimated
   */
  constructor(
    position,
    padding,
    newWebPanelPosition,
    defaultFloatingOffset,
    autoHideBackButton,
    autoHideForwardButton,
    containerBorder,
    autoHideSidebar,
    hideSidebarAnimated,
    hideToolbarAnimated,
  ) {
    this.#position = position;
    this.#padding = padding;
    this.#newWebPanelPosition = newWebPanelPosition;
    this.#defaultFloatingOffset = defaultFloatingOffset;
    this.#autoHideBackButton = autoHideBackButton;
    this.#autoHideForwardButton = autoHideForwardButton;
    this.#containerBorder = containerBorder;
    this.#autoHideSidebar = autoHideSidebar;
    this.#hideSidebarAnimated = hideSidebarAnimated;
    this.#hideToolbarAnimated = hideToolbarAnimated;
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

  get defaultFloatingOffset() {
    return this.#defaultFloatingOffset;
  }

  get autoHideBackButton() {
    return this.#autoHideBackButton;
  }

  get autoHideForwardButton() {
    return this.#autoHideForwardButton;
  }

  get containerBorder() {
    return this.#containerBorder;
  }

  get autoHideSidebar() {
    return this.#autoHideSidebar;
  }

  get hideSidebarAnimated() {
    return this.#hideSidebarAnimated;
  }

  get hideToolbarAnimated() {
    return this.#hideToolbarAnimated;
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
      pref.defaultFloatingOffset ?? "small",
      pref.autoHideBackButton ?? false,
      pref.autoHideForwardButton ?? false,
      pref.containerBorder ?? "left",
      pref.autoHideSidebar ?? false,
      pref.hideSidebarAnimated ?? true,
      pref.hideToolbarAnimated ?? true,
    );
  }

  save() {
    Settings.save(PREF, {
      position: this.#position,
      padding: this.#padding,
      newWebPanelPosition: this.#newWebPanelPosition,
      defaultFloatingOffset: this.#defaultFloatingOffset,
      autoHideBackButton: this.#autoHideBackButton,
      autoHideForwardButton: this.#autoHideForwardButton,
      containerBorder: this.#containerBorder,
      autoHideSidebar: this.#autoHideSidebar,
      hideSidebarAnimated: this.#hideSidebarAnimated,
      hideToolbarAnimated: this.#hideToolbarAnimated,
    });
  }
}
