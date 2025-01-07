/* eslint-disable no-unused-vars */
import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";
import { MenuSeparator } from "./base/menuseparator.mjs";
import { WebPanelsController } from "../controllers/web_panels.mjs";
/* eslint-enable no-unused-vars */

export class WebPanelButtonMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sb2-web-panel-button-menupopup",
      classList: ["sb2-menupopup"],
    });

    this.unloadItem = new MenuItem().setLabel("Unload web panel");
    this.editItem = new MenuItem().setLabel("Edit web panel");
    this.deleteItem = new MenuItem().setLabel("Delete web panel");
    this.customizeItem = new MenuItem().setLabel("Customize Toolbar...");
    this.#compose();

    this.addEventListener("popupshowing", () => {
      this.webPanelController = this.webPanelsController.get(
        this.element.triggerNode.id,
      );
    });
  }

  #compose() {
    this.appendChildren(
      this.unloadItem,
      new MenuSeparator(),
      this.editItem,
      this.deleteItem,
      new MenuSeparator(),
      this.customizeItem,
    );
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   */
  setWebPanelsController(webPanelsController) {
    this.webPanelsController = webPanelsController;
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   */
  listenUnloadItemClick(callback) {
    this.unloadItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   */
  listenEditItemClick(callback) {
    this.editItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   */
  listenDeleteItemClick(callback) {
    this.deleteItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenCustomizeItemClick(callback) {
    this.customizeItem.addEventListener("command", (event) => {
      callback(event);
    });
  }
}
