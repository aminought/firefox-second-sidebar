import { XULElement } from "./xul_element.mjs";

export class Toggle extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "moz-toggle", id, classList, isXUL: false });
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
