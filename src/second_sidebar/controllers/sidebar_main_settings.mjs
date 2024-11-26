/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { SidebarMainController } from "./sidebar_main.mjs";
import { SidebarMainPopupSettings } from "../xul/sidebar_main_popup_settings.mjs";
/* eslint-enable no-unused-vars */

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
   * @param {SidebarMainController} sidebarMainController
   * @param {SidebarController} sidebarController
   */
  setupDependencies(sidebarMainController, sidebarController) {
    this.sidebarMainController = sidebarMainController;
    this.sidebarController = sidebarController;
  }

  #setupListeners() {
    this.sidebarMainPopupSettings.listenCancelButtonClick(() => {
      this.sidebarMainPopupSettings.hidePopup();
    });

    this.sidebarMainPopupSettings.listenSaveButtonClick(
      (
        position,
        width,
        hideInPopupWindows,
        autoHideBackButton,
        autoHideForwardButton,
      ) => {
        this.sidebarController.setPosition(position);
        this.sidebarMainController.setWidth(width);
        this.sidebarController.hideInPopupWindows = hideInPopupWindows;
        this.sidebarController.autoHideBackButton = autoHideBackButton;
        this.sidebarController.autoHideForwardButton = autoHideForwardButton;
        this.sidebarController.saveSettings();
        this.sidebarMainPopupSettings.hidePopup();
      },
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
      this.sidebarMainController.getWidth(),
      this.sidebarController.hideInPopupWindows,
      this.sidebarController.autoHideBackButton,
      this.sidebarController.autoHideForwardButton,
    );
  }
}
