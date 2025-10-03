import { Div } from "./base/div.mjs";

export class SidebarResizer extends Div {
  /**
   *
   * @param {string} type
   */
  constructor(type) {
    super({ classList: ["sb2-resizer"] });
    this.setAttribute("type", type);
  }
}
