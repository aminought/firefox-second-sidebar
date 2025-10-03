import { Div } from "./base/div.mjs";

export class SidebarWrapper extends Div {
  constructor() {
    super({ id: "sb2-wrapper" });
  }

  /**
   *
   * @param {string} position
   * @returns {SidebarWrapper}
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
}
