import { XULElement } from "./xul_element.mjs";

export class Image extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "image", id, classList });
  }

  /**
   *
   * @param {string} src
   * @returns {Image}
   */
  setSrc(src) {
    this.element.src = src;
    return this;
  }
}
