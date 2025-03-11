/**
 *
 * @param {string} text
 * @param {number} limit
 * @returns {string}
 */
export function ellipsis(text, limit) {
  return text.length > limit ? text.slice(0, limit - 3) + "..." : text;
}

/**
 *
 * @param {string} text
 * @returns {number?}
 */
export function parseNotifications(text) {
  const regex = /(^|[([ ])([0-9]+)[)\] ]/gm;
  const result = regex.exec(text);
  if (!result || result.length < 3) {
    return null;
  }
  return result[2];
}
