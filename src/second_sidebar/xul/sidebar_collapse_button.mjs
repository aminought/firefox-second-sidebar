import { Widget } from "./base/widget.mjs";

export class SidebarCollapseButton extends Widget {
  constructor() {
    super({
      id: "sb2-collapse-button",
      label: "Second Sidebar",
      tooltipText: "Second Sidebar",
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
