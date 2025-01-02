import { Widget } from "./base/widget.mjs";

const ICON = "chrome://global/skin/icons/plus.svg";

export class WebPanelNewButton extends Widget {
  constructor() {
    super({
      id: "new-web-panel",
      label: "New Web Panel",
      tooltipText: "New Web Panel",
      iconURL: ICON,
    });
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {WebPanelNewButton}
   */
  listenClick(callback) {
    return this.setOnClick(callback);
  }
}
