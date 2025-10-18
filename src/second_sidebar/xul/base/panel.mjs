import { Widget } from "./widget.mjs"; // eslint-disable-line no-unused-vars
import { XULElement } from "./xul_element.mjs";

export class Panel extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "panel", id, classList: [...classList, "panel-no-padding"] });
    this.setAttribute("level", "top");
  }

  /**
   *
   * @param {string} type
   * @returns {Panel}
   */
  setType(type) {
    return this.setAttribute("type", type);
  }

  /**
   *
   * @param {string} role
   * @returns {Panel}
   */
  setRole(role) {
    return this.setAttribute("role", role);
  }

  /**
   *
   * @returns {Panel}
   */
  hidePopup() {
    this.element.hidePopup();
    return this;
  }

  /**
   *
   * @param {XULElement | Widget} target
   * @param {string} position
   * @returns {Panel}
   */
  openPopup(target, position = "start_before") {
    this.element.openPopup(target.getXUL(), position);
    return this;
  }

  /**
   *
   * @param {number} screenX
   * @param {number} screenY
   * @returns {Panel}
   */
  openPopupAtScreen(screenX, screenY) {
    this.element.openPopupAtScreen(screenX, screenY);
    return this;
  }

  /**
   *
   * @param {XULElement} target
   * @param {string} position
   * @returns {Panel}
   */
  moveToAnchor(target, position = "start_before") {
    this.element.moveToAnchor(target.getXUL(), position);
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  isPanelOpen() {
    return this.getAttributeBool("panelopen");
  }

  /**
   *
   * @returns {string}
   */
  getState() {
    return this.element.state;
  }
}
