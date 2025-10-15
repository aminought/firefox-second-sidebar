import { WebPanelEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelController } from "./web_panel.mjs"; // eslint-disable-line no-unused-vars

export class WebPanelDeleteController {
  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    SidebarElements.webPanelPopupDelete.listenCancelButtonClick(() =>
      this.hidePopup(),
    );

    SidebarElements.webPanelPopupDelete.listenDeleteButtonClick((uuid) => {
      sendEvents(WebPanelEvents.DELETE_WEB_PANEL, { uuid });
      SidebarControllers.webPanelsController.saveSettings();
      this.hidePopup();
    });
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openPopup(webPanelController) {
    SidebarElements.webPanelPopupDelete.openPopup(webPanelController);
  }

  hidePopup() {
    SidebarElements.webPanelPopupDelete.hidePopup();
  }
}
