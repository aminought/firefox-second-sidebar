import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";

export class SidebarMainMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sidebar-2-main-menupopup",
      classList: ["sidebar-2-menupopup"],
    });

    this.settingsItem = new MenuItem().setLabel("Sidebar Settings");
    this.appendChild(this.settingsItem);
  }

  listenSettingsItemClick(callback) {
    this.settingsItem.addEventListener("click", (event) => {
      callback(event);
    });
  }
}
