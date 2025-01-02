import { Widget } from "./base/widget.mjs";

const ICON = "chrome://global/skin/icons/plus.svg";

export class WebPanelNewButton extends Widget {
  constructor() {
    super({
      id: "new-web-panel",
      label: "New Web Panel",
      icon: ICON,
    });
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenClick(callback) {
    // this.addEventListener("click", (event) => callback(event));
    this.setOnClick(callback);
  }
}
