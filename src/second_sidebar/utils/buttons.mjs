/**
 *
 * @param {MouseEvent} event
 * @returns {boolean}
 */
export function isLeftMouseButton(event) {
  return event.button === 0;
}

/**
 *
 * @param {MouseEvent} event
 * @returns {boolean}
 */
export function isMiddleMouseButton(event) {
  return event.button === 1;
}

/**
 *
 * @param {MouseEvent} event
 * @returns {boolean}
 */
export function isRightMouseButton(event) {
  return event.button === 2;
}
