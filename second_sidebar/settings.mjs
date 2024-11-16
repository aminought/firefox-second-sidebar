const WEB_PANELS_PREF = "second-sidebar.web-panels";
const SIDEBAR_SETTINGS_PREF = "second-sidebar.settings";

export class Settings {
  /**
   *
   * @param {string} pref
   * @returns {Object | Array<Object> | null}
   */
  static load(pref) {
    const value = Services.prefs.prefHasUserValue(pref)
      ? JSON.parse(Services.prefs.getStringPref(pref))
      : null;
    console.log(`Loaded pref "${pref}":`, value);
    return value;
  }

  /**
   *
   * @param {string} pref
   * @param {Object | Array<Object>} value
   */
  static save(pref, value) {
    console.log(`Saving pref "${pref}":`, value);
    Services.prefs.setStringPref(pref, JSON.stringify(value));
  }

  /**
   *
   * @returns {Array<Object> | null}
   */
  static loadWebPanelsPref() {
    return Settings.load(WEB_PANELS_PREF);
  }

  /**
   *
   * @param {Array<Object>} webPanelsPref
   */
  static saveWebPanelsPref(webPanelsPref) {
    Settings.save(WEB_PANELS_PREF, webPanelsPref);
  }

  /**
   *
   * @returns {Object | null}
   */
  static loadSidebarSettingsPref() {
    return Settings.load(SIDEBAR_SETTINGS_PREF);
  }

  /**
   *
   * @param {Object} sidebarSettingsPref
   */
  static saveSidebarSettingsPref(sidebarSettingsPref) {
    Settings.save(SIDEBAR_SETTINGS_PREF, sidebarSettingsPref);
  }
}
