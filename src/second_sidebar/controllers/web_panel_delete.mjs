/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelPopupDelete } from "../xul/web_panel_popup_delete.mjs";
import { WebPanelPopupEdit } from "../xul/web_panel_popup_edit.mjs";
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
      const webPanelController = this.webPanelsController.get(uuid);
      if (webPanelController.isActive()) {
        this.sidebarController.close();
      }
      webPanelController.remove();
      this.webPanelsController.delete(uuid);
      this.webPanelsController.saveSettings();
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
