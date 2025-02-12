import { XULElement } from "./xul_element.mjs";

export class Img extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "img", id, classList, isXUL: false });
  }

  /**
   *
   * @param {string} src
   * @returns {Img}
   */
  setSrc(src) {
    this.element.src = src;
    return this;
  }
}
