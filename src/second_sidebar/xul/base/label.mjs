import { XULElement } from "./xul_element.mjs";

export class Label extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "label", id, classList });
  }

  /**
   *
   * @param {string} text
   * @returns {Label}
   */
  setText(text) {
    this.element.textContent = text;
    return this;
  }
}
