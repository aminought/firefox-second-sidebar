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
    this.webPanelPopupEdit.listenChanges({
      url: (uuid, url, timeout = 0) => {
        const webPanelController = this.webPanelsController.get(uuid);
        const oldUrl = webPanelController.getURL();
        webPanelController.setURL(url);

        clearTimeout(this.urlTimeout);
        this.urlTimeout = setTimeout(() => {
          if (!webPanelController.isUnloaded() && oldUrl !== url) {
            webPanelController.go(url);
          }
        }, timeout);
      },
      faviconURL: (uuid, faviconURL, timeout = 0) => {
        const webPanelController = this.webPanelsController.get(uuid);
        const oldFaviconURL = webPanelController.getFaviconURL();
        webPanelController.setWebPanelFaviconURL(faviconURL);

        clearTimeout(this.faviconURLTimeout);
        this.faviconURLTimeout = setTimeout(() => {
          if (oldFaviconURL !== faviconURL) {
            webPanelController.setWebPanelButtonFaviconURL(faviconURL);
          }
        }, timeout);
      },
      pinned: (uuid, pinned) => {
        const webPanelController = this.webPanelsController.get(uuid);
        pinned ? webPanelController.pin() : webPanelController.unpin();
        if (webPanelController.isActive()) {
          pinned
            ? this.sidebarController.pin()
            : this.sidebarController.unpin();
        }
      },
      mobile: (uuid, mobile) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setMobile(mobile);
      },
      loadOnStartup: (uuid, loadOnStartup) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setLoadOnStartup(loadOnStartup);
      },
      unloadOnClose: (uuid, unloadOnClose) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setUnloadOnClose(unloadOnClose);
      },
      hideToolbar: (uuid, hideToolbar) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setHideToolbar(hideToolbar);
        this.sidebarController.setHideToolbar(hideToolbar);
      },
      zoom: (uuid, zoomIn = false, zoomOut = false, value = null) => {
        const webPanelController = this.webPanelsController.get(uuid);
        if (zoomIn) {
          webPanelController.zoomIn();
        } else if (zoomOut) {
          webPanelController.zoomOut();
        } else {
          webPanelController.setZoom(value);
        }
        return webPanelController.getZoom();
      },
    });

    this.webPanelPopupEdit.listenCancelButtonClick(() => this.hidePopup());

    this.webPanelPopupEdit.listenSaveButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      if (
        webPanelController.getUnloadOnClose() &&
        !webPanelController.isActive()
      ) {
        webPanelController.unload();
      }
      this.webPanelsController.saveSettings();
      this.hidePopup();
    });
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openPopup(webPanelController) {
    this.webPanelPopupEdit.openPopup(webPanelController);
  }

  hidePopup() {
    this.webPanelPopupEdit.hidePopup();
  }
}
