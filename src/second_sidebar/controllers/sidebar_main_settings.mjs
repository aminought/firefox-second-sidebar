/* eslint-disable no-unused-vars */
import { SidebarEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
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

  #setupListeners() {
    this.sidebarMainPopupSettings.listenChanges({
      position: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_POSITION, { value }),
      padding: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_PADDING, { value }),
      newWebPanelPosition: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_NEW_WEB_PANEL_POSITION, {
          value,
        }),
      unpinnedPadding: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_UNPINNED_PADDING, { value }),
      hideInPopupWindows: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_HIDE_IN_POPUP_WINDOWS, { value }),
      autoHideBackButton: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_BACK_BUTTON, { value }),
      autoHideForwardButton: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_FORWARD_BUTTON, {
          value,
        }),
      containerBorder: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_CONTAINER_BORDER, { value }),
    });

    this.sidebarMainPopupSettings.listenCancelButtonClick(() =>
      this.sidebarMainPopupSettings.hidePopup(),
    );

    this.sidebarMainPopupSettings.listenSaveButtonClick(() => {
      sendEvents(SidebarEvents.SAVE_SIDEBAR);
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
      SidebarControllers.sidebarController.dumpSettings(),
    );
  }
}
