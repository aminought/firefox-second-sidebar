import { XULElement } from "./xul_element.mjs";

export class MenuList extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "menulist", id, classList });
  }

  /**
   *
   * @param {any} value
   * @returns {MenuList}
   */
  setValue(value) {
    this.element.value = value;
    return this;
  }

  /**
   *
   * @returns {any}
   */
  getValue() {
    return this.element.value;
  }

  /**
   *
   * @param {string} label
   * @param {any} value
   * @returns {MenuList}
   */
  appendItem(label, value) {
    this.element.appendItem(label, value);
    return this;
  }

  /**
   *
   * @returns {MenuList}
   */
  removeAllItems() {
    this.element.removeAllItems();
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  getLastMenuItemXUL() {
    return this.element.menupopup.lastChild;
  }
}
