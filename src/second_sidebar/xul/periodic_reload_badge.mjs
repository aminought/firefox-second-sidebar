import { Label } from "./base/label.mjs";
import { formatReloadCountdown } from "../utils/string.mjs";

export class PeriodicReloadBadge extends Label {
  /**@type {string?} */
  #text = null;

  constructor() {
    super({ id: "sb2-toolbar-periodic-reload" });
    this.setAttribute("aria-hidden", "true").hide();
  }

  /**
   *
   * @param {number?} remaining
   * @returns {PeriodicReloadBadge}
   */
  setRemaining(remaining) {
    const text = remaining === null ? null : formatReloadCountdown(remaining);
    if (text === this.#text) {
      return this;
    }
    this.#text = text;
    this.setText(text ?? "");
    text === null ? this.hide() : this.show();
    return this;
  }

  /**
   *
   * @returns {string?}
   */
  getText() {
    return this.#text;
  }
}
