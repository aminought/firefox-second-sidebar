/**
 *
 * @param {string} text
 * @param {number} limit
 * @returns {string}
 */
export function ellipsis(text, limit) {
  return text.length > limit ? text.slice(0, limit - 3) + "..." : text;
}
