import { XULElement } from "./xul_element.mjs";

export class Style extends XULElement {
  /**
   *
   * @param {string} style
   */
  constructor(style) {
    super({ tag: "style", isXUL: false });
    this.setInnerText(style);
  }
}
