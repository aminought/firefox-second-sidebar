import { VBox } from "./base/vbox.mjs";

export class PopupBody extends VBox {
  /**
   *
   * @param {object} params
   * @param {boolean} params.compact
   */
  constructor({ compact = false } = {}) {
    super({ classList: ["sb2-popup-body"] });
    if (compact) {
      this.addClass("compact");
    }
  }
}
