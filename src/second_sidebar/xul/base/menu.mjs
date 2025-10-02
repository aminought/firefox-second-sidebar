import { XULElement } from "./xul_element.mjs";

export class Menu extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "menu", id, classList });
  }

  /**
   *
   * @param {string} text
   * @returns {Menu}
   */
  setLabel(text) {
    return this.setAttribute("label", text);
  }
}
