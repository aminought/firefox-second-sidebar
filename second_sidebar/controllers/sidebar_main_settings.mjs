import { SidebarController } from "./sidebar.mjs";
import { SidebarMainPopupSettings } from "../xul/sidebar_main_popup_settings.mjs";

export class SidebarMainSettingsController {
  /**
   *
   * @param {SidebarMainPopupSettings} sidebarMainPopupSettings
   */
  constructor(sidebarMainPopupSettings) {
    this.sidebarMainPopupSettings = sidebarMainPopupSettings;

    this.#setupListeners();
  }

  /**
   *
   * @param {SidebarController} sidebarController
   */
  setupDependencies(sidebarController) {
    this.sidebarController = sidebarController;
  }

  #setupListeners() {
    this.sidebarMainPopupSettings.listenCancelButtonClick(() => {
      this.sidebarMainPopupSettings.hidePopup();
    });

    this.sidebarMainPopupSettings.listenSaveButtonClick(
      (position, autoHideBackButton, autoHideForwardButton) => {
        this.sidebarController.setPosition(position);
        this.sidebarController.autoHideBackButton = autoHideBackButton;
        this.sidebarController.autoHideForwardButton = autoHideForwardButton;
        this.sidebarController.savePref();
        this.sidebarMainPopupSettings.hidePopup();
      }
    );
  }

  /**
   *
   * @param {number} screenX
   * @param {number} screenY
   */
  openPopup(screenX, screenY) {
    this.sidebarMainPopupSettings.openPopupAtScreen(screenX, screenY);
    this.sidebarMainPopupSettings.setDefaults(
      this.sidebarController.getPosition(),
      this.sidebarController.autoHideBackButton,
      this.sidebarController.autoHideForwardButton
    );
  }
}
