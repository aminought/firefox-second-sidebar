export const OPEN_URL_IN = {
  TAB: "tab",
  BACKGROUND_TAB: "tabshifted",
};

/**
 *
 * @param {string} url
 * @param {OPEN_URL_IN} where
 */
export const openTrustedLinkInWrapper = (url, where) => {
  openTrustedLinkIn(url, where);
};
