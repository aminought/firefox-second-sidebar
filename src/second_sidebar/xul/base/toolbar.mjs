import { XULElement } from "./xul_element.mjs";

export class Toolbar extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "toolbar", id, classList });
  }

  /**
   *
   * @param {string} value
   * @returns {Toolbar}
   */
  setMode(value) {
    return this.setAttribute("mode", value);
  }
}
