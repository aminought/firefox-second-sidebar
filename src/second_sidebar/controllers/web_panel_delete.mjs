/* eslint-disable no-unused-vars */
import { WebPanelEvents, sendEvents } from "./events.mjs";

import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelController } from "./web_panel.mjs";

/* eslint-enable no-unused-vars */

export class WebPanelDeleteController {
  constructor() {
    this.webPanelPopupDelete = SidebarElements.webPanelPopupDelete;
    this.#setupListeners();
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
