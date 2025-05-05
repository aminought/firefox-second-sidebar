import { VBox } from "./base/vbox.mjs";

export class Sidebar extends VBox {
  constructor() {
    super({ id: "sb2" });
    this.setPosition("right");
    this.setFloatingSidebar(false);
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
  setFloatingSidebar(floatingSidebar) {
    return this.setAttribute("floating-sidebar", floatingSidebar);
  }

  /**
   *
   * @returns {boolean}
   */
  getFloatingSidebar() {
    return this.getAttribute("floating-sidebar") === "true";
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

  /**
   *
   * @returns {Sidebar}
   */
  setType(type) {
    return this.setAttribute("type", type);
  }

  /**
   *
   * @returns {string}
   */
  getType() {
    return this.getAttribute("type");
  }
}
