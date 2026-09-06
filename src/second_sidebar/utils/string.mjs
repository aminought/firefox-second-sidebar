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

/**
 *
 * @param {number} milliseconds
 * @returns {string}
 */
export function formatReloadCountdown(milliseconds) {
  const value = Number(milliseconds);
  const clampedMilliseconds = Number.isFinite(value) ? Math.max(0, value) : 0;
  const totalSeconds = Math.ceil(clampedMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
