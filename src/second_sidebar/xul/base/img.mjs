import { XULElement } from "./xul_element.mjs";

export class Img extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super("img", {
      id,
      classList,
      create: (tag) => document.createElement(tag),
    });
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
