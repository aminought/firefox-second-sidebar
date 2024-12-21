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
  setupDependencies(
    sidebarMainController,
    sidebarController,
  ) {
    this.sidebarMainController = sidebarMainController;
    this.sidebarController = sidebarController;
  }

  #setupListeners() {
    this.sidebarMainPopupSettings.listenChanges({
      position: (value) => this.sidebarController.setPosition(value),
      padding: (value) => this.sidebarMainController.setPadding(value),
      faviconSize: (value) => this.sidebarMainController.setFaviconSize(value),
      unpinnedPadding: (value) =>
        this.sidebarController.setUnpinnedPadding(value),
      hideInPopupWindows: (value) =>
        (this.sidebarController.hideInPopupWindows = value),
      autoHideBackButton: (value) => {
        this.sidebarController.autoHideBackButton = value;
        this.sidebarController.autoHideButton(
          this.sidebarController.sidebarToolbar.backButton,
          value,
        );
      },
      autoHideForwardButton: (value) => {
        this.sidebarController.autoHideForwardButton = value;
        this.sidebarController.autoHideButton(
          this.sidebarController.sidebarToolbar.forwardButton,
          value,
        );
      },
    });

    this.sidebarMainPopupSettings.listenCancelButtonClick(() =>
      this.sidebarMainPopupSettings.hidePopup(),
    );

    this.sidebarMainPopupSettings.listenSaveButtonClick(() => {
      this.sidebarController.saveSettings();
      this.sidebarMainPopupSettings.hidePopup();
    });
  }

  /**
   *
   * @param {number} screenX
   * @param {number} screenY
   */
  openPopup(screenX, screenY) {
    this.sidebarMainPopupSettings.openPopupAtScreen(
      screenX,
      screenY,
      this.sidebarController.dumpSettings(),
    );
  }
}
