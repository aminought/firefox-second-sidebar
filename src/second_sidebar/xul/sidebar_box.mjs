import { HBox } from "./base/hbox.mjs";

export class SidebarBox extends HBox {
  constructor() {
    super({ id: "sb2-box" });
    this.hide();
  }

  /**
   *
   * @returns {SidebarBox}
   */
  showInvisible() {
    return this.setProperty("z-index", "-1").show();
  }

  hideInvisible() {
    this.setProperty("z-index", "10").hide();
  }
}
