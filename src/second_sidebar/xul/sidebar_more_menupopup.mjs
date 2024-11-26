import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";
import { MenuSeparator } from "./base/menuseparator.mjs";

export class SidebarMoreMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sidebar-2-more-menupopup",
      classList: ["sidebar-2-menupopup"],
    });

    this.openInNewTabItem = new MenuItem().setLabel("Open In New Tab");
    this.copyPageUrlItem = new MenuItem().setLabel("Copy Page URL");
    this.zoomInItem = new MenuItem().setLabel("Zoom In");
    this.zoomOutItem = new MenuItem().setLabel("Zoom Out");
    this.resetZoomItem = new MenuItem().setLabel("Reset Zoom [100%]");

    this.appendChild(this.openInNewTabItem);
    this.appendChild(this.copyPageUrlItem);
    this.appendChild(new MenuSeparator());
    this.appendChild(this.zoomInItem);
    this.appendChild(this.zoomOutItem);
    this.appendChild(this.resetZoomItem);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenOpenInNewTabItemClick(callback) {
    this.openInNewTabItem.addEventListener("click", (event) => {
      callback(event);
    });
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenCopyPageUrlItemClick(callback) {
    this.copyPageUrlItem.addEventListener("click", (event) => {
      callback(event);
    });
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenZoomInItemClick(callback) {
    this.zoomInItem.addEventListener("click", (event) => {
      callback(event);
    });
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenZoomOutItemClick(callback) {
    this.zoomOutItem.addEventListener("click", (event) => {
      callback(event);
    });
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenResetZoomItemClick(callback) {
    this.resetZoomItem.addEventListener("click", (event) => {
      callback(event);
    });
  }

  /**
   *
   * @param {number} zoom
   */
  setResetZoomButtonLabel(zoom) {
    this.resetZoomItem.setLabel(`Reset Zoom [${(zoom * 100).toFixed(0)}%]`);
  }
}
