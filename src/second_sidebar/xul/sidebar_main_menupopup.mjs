import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";

export class SidebarMainMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sb2-main-menupopup",
      classList: ["sb2-menupopup"],
    });

    this.settingsItem = new MenuItem().setLabel("Sidebar settings");
    this.appendChild(this.settingsItem);
  }

  listenSettingsItemClick(callback) {
    this.settingsItem.addEventListener("click", (event) => {
      callback(event);
    });
  }
}
