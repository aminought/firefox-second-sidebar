import { XULElement } from "./xul_element.mjs";

export class Toggle extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super("moz-toggle", {
      id,
      classList,
      create: (tag) => document.createElement(tag),
    });
  }

  /**
   *
   * @returns {boolean}
   */
  getPressed() {
    return this.element.pressed;
  }

  /**
   *
   * @param {boolean} value
   * @returns {Toggle}
   */
  setPressed(value) {
    this.element.pressed = value;
    return this;
  }
}
