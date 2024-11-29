import { VBox } from "./base/vbox.mjs";

export class Sidebar extends VBox {
  constructor() {
    super({ id: "sb2" });
    this.setPosition("right");
  }

  /**
   *
   * @param {string} position
   * @returns {Sidebar}
   */
  setPosition(position) {
    return this.setAttribute("position", position);
  }

  /**
   *
   * @returns {string}
   */
  getPosition() {
    return this.getAttribute("position");
  }

  /**
   *
   * @returns {Sidebar}
   */
  pin() {
    return this.setAttribute("pinned", "true");
  }

  /**
   *
   * @returns {Sidebar}
   */
  unpin() {
    return this.setAttribute("pinned", "false");
  }

  /**
   *
   * @returns {boolean}
   */
  pinned() {
    return this.getAttribute("pinned") === "true";
  }
}
