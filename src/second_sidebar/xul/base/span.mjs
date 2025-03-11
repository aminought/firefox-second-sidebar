import { XULElement } from "./xul_element.mjs";

export class Span extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "span", id, classList, isXUL: false });
  }

  /**
   *
   * @param {string} text
   * @returns {Span}
   */
  setText(text) {
    this.element.textContent = text;
    return this;
  }

  /**
   *
   * @param {string} value
   * @returns {Span}
   */
  setFontSize(value) {
    return this.setProperty("font-size", value);
  }
}
