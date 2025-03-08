import { Header } from "./base/header.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { VBox } from "./base/vbox.mjs";

export class PopupHeader extends VBox {
  /**
   *
   * @param {string} text
   */
  constructor(text) {
    super({ classList: ["sb2-popup-header"] });
    this.appendChildren(new Header(1).setText(text), new ToolbarSeparator());
  }
}
