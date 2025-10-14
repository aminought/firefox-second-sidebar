import { Settings } from "./settings.mjs";

const PREF = "second-sidebar.settings";

export class SidebarSettings {
  /**
   *
   * @param {object} params
   * @param {string} params.position
   * @param {string} params.padding
   * @param {string} params.newWebPanelPosition
   * @param {string} params.defaultFloatingOffset
   * @param {boolean} params.autoHideBackButton
   * @param {boolean} params.autoHideForwardButton
   * @param {string} params.containerBorder
   * @param {string} params.tooltip
   * @param {boolean} params.autoHideSidebar
   * @param {boolean} params.hideSidebarAnimated
   * @param {boolean} params.hideToolbarAnimated
   * @param {boolean} params.enableSidebarBoxHint
   */
  constructor({
    position = "right",
    padding = "small",
    newWebPanelPosition = "before",
    defaultFloatingOffset = "small",
    autoHideBackButton = false,
    autoHideForwardButton = false,
    containerBorder = "left",
    tooltip = "url",
    autoHideSidebar = false,
    hideSidebarAnimated = true,
    hideToolbarAnimated = true,
    enableSidebarBoxHint = false,
  }) {
    this.position = position;
    this.padding = padding;
    this.newWebPanelPosition = newWebPanelPosition;
    this.defaultFloatingOffset = defaultFloatingOffset;
    this.autoHideBackButton = autoHideBackButton;
    this.autoHideForwardButton = autoHideForwardButton;
    this.containerBorder = containerBorder;
    this.autoHideSidebar = autoHideSidebar;
    this.tooltip = tooltip;
    this.hideSidebarAnimated = hideSidebarAnimated;
    this.hideToolbarAnimated = hideToolbarAnimated;
    this.enableSidebarBoxHint = enableSidebarBoxHint;
  }

  /**
   *
   * @returns {SidebarSettings}
   */
  static load() {
    const pref = Settings.load(PREF) ?? {};
    return new SidebarSettings({
      position: pref.position,
      padding: pref.padding,
      newWebPanelPosition: pref.newWebPanelPosition,
      defaultFloatingOffset: pref.defaultFloatingOffset,
      autoHideBackButton: pref.autoHideBackButton,
      autoHideForwardButton: pref.autoHideForwardButton,
      containerBorder: pref.containerBorder,
      tooltip: pref.tooltip,
      autoHideSidebar: pref.autoHideSidebar,
      hideSidebarAnimated: pref.hideSidebarAnimated,
      hideToolbarAnimated: pref.hideToolbarAnimated,
      enableSidebarBoxHint: pref.enableSidebarBoxHint,
    });
  }

  save() {
    Settings.save(PREF, {
      position: this.position,
      padding: this.padding,
      newWebPanelPosition: this.newWebPanelPosition,
      defaultFloatingOffset: this.defaultFloatingOffset,
      autoHideBackButton: this.autoHideBackButton,
      autoHideForwardButton: this.autoHideForwardButton,
      containerBorder: this.containerBorder,
      tooltip: this.tooltip,
      autoHideSidebar: this.autoHideSidebar,
      hideSidebarAnimated: this.hideSidebarAnimated,
      hideToolbarAnimated: this.hideToolbarAnimated,
      enableSidebarBoxHint: this.enableSidebarBoxHint,
    });
  }
}
