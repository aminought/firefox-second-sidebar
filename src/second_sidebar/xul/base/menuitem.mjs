import { XULElement } from "./xul_element.mjs";

export class MenuItem extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "menuitem", id, classList });
  }

  /**
   *
   * @param {string} text
   * @returns {MenuItem}
   */
  setLabel(text) {
    return this.setAttribute("label", text);
  }

  /**
   *
   * @param {boolean} value
   * @returns {MenuItem}
   */
  setDisabled(value) {
    if (value) {
      this.setAttribute("disabled", true);
    } else {
      this.removeAttribute("disabled");
    }
    return true;
  }
}
