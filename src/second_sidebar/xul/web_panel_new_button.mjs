import { ToolbarButton } from "./base/toolbar_button.mjs";

const ICON = "chrome://global/skin/icons/plus.svg";

export class WebPanelNewButton extends ToolbarButton {
  constructor() {
    super({
      id: "new-web-panel",
      classList: ["sb2-main-button", "toolbarbutton-1"],
    });

    this.setIcon(ICON).setBadged("false").setContext("");
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenClick(callback) {
    this.addEventListener("mousedown", (event) => callback(event));
  }
}
