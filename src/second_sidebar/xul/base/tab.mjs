import { Browser } from "./browser.mjs";

export class Tab extends Browser {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {HTMLElement?} params.element
   */
  constructor({ id = null, classList = [], element } = {}) {
    super({ tag: "tab", id, classList, element });
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    return this.getAttribute("selected") === "true";
  }
}
