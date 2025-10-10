import { XULElement } from "./xul_element.mjs";

export class MozButton extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "moz-button", id, classList, isXUL: false });
  }

  /**
   *
   * @param {string} label
   * @returns {MozButton}
   */
  setLabel(label) {
    this.setAttribute("label", label);
    return this;
  }

  /**
   *
   * @param {string} type
   * @returns {MozButton}
   */
  setType(type) {
    this.setAttribute("type", type);
    return this;
  }
}
