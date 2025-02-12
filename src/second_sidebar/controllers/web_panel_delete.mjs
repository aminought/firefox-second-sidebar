/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelPopupDelete } from "../xul/web_panel_popup_delete.mjs";
import { WebPanelPopupEdit } from "../xul/web_panel_popup_edit.mjs";
import { WebPanelsController } from "./web_panels.mjs";
import { WindowManagerWrapper } from "../wrappers/window_manager.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
/* eslint-enable no-unused-vars */

const Events = {
  DELETE_WEB_PANEL: "delete_web_panel",
};

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

    window.addEventListener(Events.DELETE_WEB_PANEL, async (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const webPanelController = this.webPanelsController.get(
        event.detail.uuid,
      );
      if (webPanelController.isActive()) {
        this.sidebarController.close();
      }
      webPanelController.remove();
      this.webPanelsController.delete(event.detail.uuid);
      this.hidePopup();

      if (event.detail.isWindowActive) {
        this.webPanelsController.saveSettings();
      }
    });

    this.webPanelPopupDelete.listenDeleteButtonClick((uuid) => {
      const lastWindow = WindowManagerWrapper.getMostRecentBrowserWindow();
      for (const window of WindowWatcherWrapper.getWindowEnumerator()) {
        const customEvent = new CustomEvent(Events.DELETE_WEB_PANEL, {
          detail: {
            uuid,
            isWindowActive: window === lastWindow,
          },
        });
        window.dispatchEvent(customEvent);
      }
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
