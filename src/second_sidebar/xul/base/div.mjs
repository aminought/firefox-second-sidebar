import { XULElement } from "./xul_element.mjs";

export class Div extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "div", id, classList, isXUL: false });
  }
}
