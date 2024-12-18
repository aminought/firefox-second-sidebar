export class Settings {
  /**
   *
   * @param {string} pref
   * @returns {Object | Array<Object> | null}
   */
  static load(pref) {
    console.log(`Loading pref "${pref}"`,JSON.parse(Services.prefs.getStringPref(pref)));
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
}
