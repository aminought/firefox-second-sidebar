import { XULElement } from "./xul_element.mjs";

export class Header extends XULElement {
  /**
   *
   * @param {number} level
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor(level, { id = null, classList = [] } = {}) {
    super({ tag: `h${level}`, id, classList, isXUL: false });
  }

  /**
   *
   * @param {string} text
   * @returns {Header}
   */
  setText(text) {
    this.element.textContent = text;
    return this;
  }

  /**
   *
   * @returns {string}
   */
  getText() {
    return this.element.textContent;
  }
}
