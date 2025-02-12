export class PreferencesWrapper {
  /**
   *
   * @param {string} pref
   * @returns {boolean}
   */
  static prefHasUserValue(pref) {
    return Services.prefs.prefHasUserValue(pref);
  }

  /**
   *
   * @param {string} pref
   * @returns {string}
   */
  static getStringPref(pref) {
    return Services.prefs.getStringPref(pref);
  }

  /**
   *
   * @param {string} pref
   * @param {string} value
   */
  static setStringPref(pref, value) {
    return Services.prefs.setStringPref(pref, value);
  }
}
