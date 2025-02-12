import { XULElement } from "./xul_element.mjs";

export class Tab extends XULElement {
  /**
   *
   * @param {string} userContextId
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {HTMLElement?} params.element
   */
  constructor(userContextId, { id = null, classList = [], element } = {}) {
    super({ tag: "tab", id, classList, element });
    this.element.userContextId = userContextId;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  getBrowserXUL() {
    return this.element.linkedBrowser;
  }

  /**
   *
   * @returns {string}
   */
  getUserContextId() {
    return this.element.userContextId;
  }
}
