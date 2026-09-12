// Canonical labels for the physical writing-system keys defined by UI Events.
const KEY_LABELS_BY_CODE = {
  Backquote: ["`", "~"],
  Digit1: ["1", "!"],
  Digit2: ["2", "@"],
  Digit3: ["3", "#"],
  Digit4: ["4", "$"],
  Digit5: ["5", "%"],
  Digit6: ["6", "^"],
  Digit7: ["7", "&"],
  Digit8: ["8", "*"],
  Digit9: ["9", "("],
  Digit0: ["0", ")"],
  Minus: ["-", "_"],
  Equal: ["=", "+"],
  BracketLeft: ["[", "{"],
  BracketRight: ["]", "}"],
  Backslash: ["\\", "|"],
  Semicolon: [";", ":"],
  Quote: ["'", '"'],
  Comma: [",", "<"],
  Period: [".", ">"],
  Slash: ["/", "?"],
};

/**
 * Returns a stable label for a physical key, independent of keyboard layout.
 *
 * @param {KeyboardEvent} event
 * @returns {string}
 */
export function getLayoutIndependentKey(event) {
  if (/^Key[A-Z]$/.test(event.code)) {
    return event.code.slice(3);
  }

  const labels = KEY_LABELS_BY_CODE[event.code];
  if (labels) {
    return labels[Number(event.shiftKey)];
  }

  if (/^Intl[A-Za-z]+$/.test(event.code)) {
    return event.code;
  }

  // Some synthetic or unidentified key events do not provide a code.
  return event.key.toUpperCase();
}
