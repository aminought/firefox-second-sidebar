import { XULElement } from "./xul_element.mjs";

export class Input extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "input", id, classList, isXUL: false });
  }

  /**
   *
   * @param {string} type
   * @returns {Input}
   */
  setType(type) {
    this.element.type = type;
    return this;
  }

  /**
   *
   * @param {string} value
   * @returns {Input}
   */
  setValue(value) {
    this.element.value = value;
    return this;
  }

  /**
   *
   * @returns {string}
   */
  getValue() {
    return this.element.value;
  }

  /**
   *
   * @param {string} image
   * @returns {Input}
   */
  setBackgroundImage(image) {
    this.element.style.backgroundImage = `url("${image}")`;
    return this;
  }
}
