/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelPopupEdit } from "../xul/web_panel_popup_edit.mjs";
import { WebPanelsController } from "./web_panels.mjs";
/* eslint-enable no-unused-vars */

export class WebPanelEditController {
  /**
   *
   * @param {WebPanelPopupEdit} webPanelPopupEdit
   */
  constructor(webPanelPopupEdit) {
    this.webPanelPopupEdit = webPanelPopupEdit;
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
    this.webPanelPopupEdit.listenMoveUpButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      this.webPanelsController.moveUp(uuid);
      this.hidePopup();
      this.openPopup(webPanelController);
      this.webPanelsController.saveSettings();
    });

    this.webPanelPopupEdit.listenMoveDownButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      this.webPanelsController.moveDown(uuid);
      this.hidePopup();
      this.openPopup(webPanelController);
      this.webPanelsController.saveSettings();
    });

    this.webPanelPopupEdit.listenSaveButtonClick(
      (uuid, url, faviconURL, mobile, loadOnStartup, unloadOnClose) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.set(
          url,
          faviconURL,
          mobile,
          loadOnStartup,
          unloadOnClose,
        );
        this.hidePopup();
        if (unloadOnClose && !webPanelController.isActive()) {
          webPanelController.unload();
        }
        this.webPanelsController.saveSettings();
      },
    );

    this.webPanelPopupEdit.listenDeleteButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      if (webPanelController.isActive()) {
        this.sidebarController.close();
      }
      this.hidePopup();
      webPanelController.remove();
      this.webPanelsController.delete(uuid);
      this.webPanelsController.saveSettings();
    });
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openPopup(webPanelController) {
    const webPanel = webPanelController.webPanel;
    const webPanelButton = webPanelController.webPanelButton;

    this.webPanelPopupEdit.setDefaults(
      webPanel.uuid,
      webPanel.url,
      webPanel.faviconURL,
      webPanel.mobile,
      webPanel.loadOnStartup,
      webPanel.unloadOnClose,
      webPanelController.isFirst(),
      webPanelController.isLast(),
    );
    this.webPanelPopupEdit.openPopup(webPanelButton);
  }

  hidePopup() {
    this.webPanelPopupEdit.hidePopup();
  }
}
