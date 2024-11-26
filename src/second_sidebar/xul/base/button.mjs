import { XULElement } from "./xul_element.mjs";

export class Button extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super("button", {
      id,
      classList,
      create: (tag) => document.createElement(tag),
    });
  }

  /**
   *
   * @param {string} text
   * @returns {Button}
   */
  setText(text) {
    this.element.innerText = text;
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  getPressed() {
    return this.element.ariaPressed === "true";
  }

  /**
   *
   * @param {boolean} value
   * @returns {Button}
   */
  setPressed(value) {
    this.element.ariaPressed = value;
    return this;
  }
}
