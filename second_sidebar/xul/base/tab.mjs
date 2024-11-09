import { XULElement } from "./xul_element.mjs";

export class Tab extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {HTMLElement?} params.element
   */
  constructor({ id = null, classList = [], element } = {}) {
    super("tab", { id, classList, element });
  }

  /**
   *
   * @returns {HTMLElement}
   */
  getBrowserXUL() {
    return this.element.linkedBrowser;
  }
}
