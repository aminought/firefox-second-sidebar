import { XULElement } from "./xul_element.mjs";

export class Menu extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.menu
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ tag = "menu", id = null, classList = [] } = {}) {
    super({ tag, id, classList });
  }

  /**
   *
   * @param {string} text
   * @returns {Menu}
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
