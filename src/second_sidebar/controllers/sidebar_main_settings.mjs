import { SidebarEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarMainSettingsController {
  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    SidebarElements.sidebarMainPopupSettings.listenChanges({
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
      autoHideSidebar: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE, { value }),
      hideSidebarAnimated: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_ANIMATED, { value }),
    });

    SidebarElements.sidebarMainPopupSettings.listenCancelButtonClick(() =>
      SidebarElements.sidebarMainPopupSettings.hidePopup(),
    );

    SidebarElements.sidebarMainPopupSettings.listenSaveButtonClick(() => {
      sendEvents(SidebarEvents.SAVE_SIDEBAR);
      SidebarElements.sidebarMainPopupSettings.hidePopup();
    });
  }

  /**
   *
   * @param {number} screenX
   * @param {number} screenY
   */
  openPopup(screenX, screenY) {
    SidebarElements.sidebarMainPopupSettings.openPopupAtScreen(
      screenX,
      screenY,
      SidebarControllers.sidebarController.dumpSettings(),
    );
  }
}
