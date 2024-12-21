import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";

export class SidebarMainMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sb2-main-menupopup",
      classList: ["sb2-menupopup"],
    });

    this.settingsItem = new MenuItem().setLabel("Sidebar settings");
    this.customizeItem = new MenuItem().setLabel("Customize");
    this.appendChildren(this.settingsItem, this.customizeItem);
  }

  listenSettingsItemClick(callback) {
    this.settingsItem.addEventListener("click", (event) => {
      callback(event);
    });
  }

  listenCustomizeItemClick(callback) {
    this.customizeItem.addEventListener("click", (event) => {
      callback(event);
    });
  }
}
