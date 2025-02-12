/* eslint-disable no-unused-vars */
import { WebPanelEvents, sendEvents } from "./events.mjs";

import { SidebarController } from "./sidebar.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelPopupDelete } from "../xul/web_panel_popup_delete.mjs";
import { WebPanelsController } from "./web_panels.mjs";

/* eslint-enable no-unused-vars */

export class WebPanelDeleteController {
  /**
   *
   * @param {WebPanelPopupDelete} webPanelPopupDelete
   */
  constructor(webPanelPopupDelete) {
    this.webPanelPopupDelete = webPanelPopupDelete;
    this.#setupListeners();
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   * @param {SidebarController} sidebarController
   */
  setupDependencies(webPanelsController, sidebarController) {
    this.webPanelsController = webPanelsController;
    this.sidebarController = sidebarController;
  }

  #setupListeners() {
    this.webPanelPopupDelete.listenCancelButtonClick(() => this.hidePopup());

    this.webPanelPopupDelete.listenDeleteButtonClick((uuid) => {
      sendEvents(WebPanelEvents.DELETE_WEB_PANEL, { uuid });
      this.hidePopup();
    });
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openPopup(webPanelController) {
    this.webPanelPopupDelete.openPopup(webPanelController);
  }

  hidePopup() {
    this.webPanelPopupDelete.hidePopup();
  }
}
