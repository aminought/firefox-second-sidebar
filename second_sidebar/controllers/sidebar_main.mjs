import { SidebarMain } from "../xul/sidebar_main.mjs";
import { SidebarMainMenuPopup } from "../xul/sidebar_main_menupopup.mjs";
import { SidebarMainSettingsController } from "./sidebar_main_settings.mjs";

export class SidebarMainController {
  /**
   *
   * @param {SidebarMain} sidebarMain
   * @param {SidebarMainMenuPopup} sidebarMainMenuPopup
   */
  constructor(sidebarMain, sidebarMainMenuPopup) {
    this.sidebarMain = sidebarMain;
    this.sidebarMainMenuPopup = sidebarMainMenuPopup;

    this.#setupListeners();
  }

  /**
   *
   * @param {SidebarMainSettingsController} sidebarMainSettingsController
   */
  setupDependencies(sidebarMainSettingsController) {
    this.sidebarMainSettingsController = sidebarMainSettingsController;
  }

  #setupListeners() {
    this.sidebarMainMenuPopup.listenSettingsItemClick((event) => {
      this.sidebarMainSettingsController.openPopup(
        event.screenX,
        event.screenY
      );
    });
  }
}
