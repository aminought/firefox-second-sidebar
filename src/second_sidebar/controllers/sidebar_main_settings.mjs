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
      defaultFloatingOffset: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_DEFAULT_FLOATING_OFFSET, {
          value,
        }),
      autoHideBackButton: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_BACK_BUTTON, { value }),
      autoHideForwardButton: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_FORWARD_BUTTON, {
          value,
        }),
      enableSidebarBoxHint: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_ENABLE_BOX_HINT, { value }),
      containerBorder: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_CONTAINER_BORDER, { value }),
      tooltip: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_TOOLTIP, { value }),
      tooltipFullUrl: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_TOOLTIP_FULL_URL, { value }),
      visibility: (
        autoHideSidebar,
        autoHideSidebarBehavior,
        sidebarWidgetHideWebPanel,
        sidebarWidgetShortcut,
      ) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_VISIBILITY, {
          autoHideSidebar,
          autoHideSidebarBehavior,
          sidebarWidgetHideWebPanel,
          sidebarWidgetShortcut,
        }),
      hideSidebarAnimated: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_ANIMATED, { value }),
      hideToolbarAnimated: (value) =>
        sendEvents(SidebarEvents.EDIT_SIDEBAR_TOOLBAR_AUTO_HIDE_ANIMATED, {
          value,
        }),
    });

    SidebarElements.sidebarMainPopupSettings.listenCancelButtonClick(() =>
      SidebarElements.sidebarMainPopupSettings.hidePopup(),
    );

    SidebarElements.sidebarMainPopupSettings.listenSaveButtonClick(() => {
      SidebarControllers.sidebarController.saveSettings();
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
