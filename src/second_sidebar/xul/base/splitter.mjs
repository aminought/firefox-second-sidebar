import { XULElement } from "./xul_element.mjs";

export class Splitter extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "splitter", id, classList });
  }

  /**
   *
   * @param {string} value
   * @returns {Splitter}
   */
  setResizeBefore(value) {
    return this.setAttribute("resizebefore", value);
  }

  /**
   *
   * @param {string} value
   * @returns {Splitter}
   */
  setResizeAfter(value) {
    return this.setAttribute("resizeafter", value);
  }
}
