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
    return this.setProperty("position", "absolute")
      .setProperty("z-index", "-2147483647")
      .show();
  }

  hideInvisible() {
    this.hide().removeProperty("position").removeProperty("z-index");
  }
}
