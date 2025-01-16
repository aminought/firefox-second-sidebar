import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";
import { MenuSeparator } from "./base/menuseparator.mjs";

export class SidebarMainMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sb2-main-menupopup",
      classList: ["sb2-menupopup"],
    });

    this.settingsItem = new MenuItem().setLabel("Sidebar settings");
    this.customizeItem = new MenuItem().setLabel("Customize Toolbar...");
    this.#compose();

    this.addEventListener("popupshown", () => {
      this.screenX = this.element.screenX;
      this.screenY = this.element.screenY;
    });
  }

  #compose() {
    this.appendChildren(
      this.settingsItem,
      new MenuSeparator(),
      this.customizeItem,
    );
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenSettingsItemClick(callback) {
    this.settingsItem.addEventListener("command", () => {
      callback(this.screenX, this.screenY);
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
