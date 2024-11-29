import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";
import { MenuSeparator } from "./base/menuseparator.mjs";

export class WebPanelButtonMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sb2-web-panel-button-menupopup",
      classList: ["sb2-menupopup"],
    });

    this.unloadItem = new MenuItem().setLabel("Unload Web Panel");
    this.editItem = new MenuItem().setLabel("Edit Web Panel");
    this.deleteItem = new MenuItem().setLabel("Delete Web Panel");
    this.#compose();
  }

  #compose() {
    this.appendChildren(
      this.unloadItem,
      new MenuSeparator(),
      this.editItem,
      this.deleteItem,
    );
  }

  setWebPanelController(webPanelButton) {
    this.webPanelController = webPanelButton;
  }

  listenUnloadItemClick(callback) {
    this.unloadItem.addEventListener("click", () => {
      callback(this.webPanelController);
    });
  }

  listenEditItemClick(callback) {
    this.editItem.addEventListener("click", () => {
      callback(this.webPanelController);
    });
  }

  listenDeleteItemClick(callback) {
    this.deleteItem.addEventListener("click", () => {
      callback(this.webPanelController);
    });
  }
}
