/* eslint-disable no-unused-vars */
import { WebPanelEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelPopupEdit } from "../xul/web_panel_popup_edit.mjs";

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

  #setupListeners() {
    this.webPanelPopupEdit.listenChanges({
      url: (uuid, url, timeout = 0) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_URL, {
          uuid,
          url,
          timeout,
        });
      },
      faviconURL: (uuid, faviconURL, timeout = 0) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_FAVICON_URL, {
          uuid,
          faviconURL,
          timeout,
        });
      },
      pinned: (uuid, pinned) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_PINNED, {
          uuid,
          pinned,
        });
      },
      userContextId: (uuid, userContextId) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_USER_CONTEXT_ID, {
          uuid,
          userContextId,
        });
      },
      mobile: (uuid, mobile) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_MOBILE, {
          uuid,
          mobile,
        });
      },
      loadOnStartup: (uuid, loadOnStartup) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_LOAD_ON_STARTUP, {
          uuid,
          loadOnStartup,
        });
      },
      unloadOnClose: (uuid, unloadOnClose) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_UNLOAD_ON_CLOSE, {
          uuid,
          unloadOnClose,
        });
      },
      hideToolbar: (uuid, hideToolbar) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_HIDE_TOOLBAR, {
          uuid,
          hideToolbar,
        });
      },
      zoomOut: (uuid) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_OUT, {
          uuid,
        });
        const webPanelController =
          SidebarControllers.webPanelsController.get(uuid);
        return webPanelController.getZoom();
      },
      zoomIn: (uuid) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_IN, {
          uuid,
        });
        const webPanelController =
          SidebarControllers.webPanelsController.get(uuid);
        return webPanelController.getZoom();
      },
      zoom: (uuid, value) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM, {
          uuid,
          value,
        });
        const webPanelController =
          SidebarControllers.webPanelsController.get(uuid);
        return webPanelController.getZoom();
      },
    });

    this.webPanelPopupEdit.listenCancelButtonClick(() => this.hidePopup());

    this.webPanelPopupEdit.listenSaveButtonClick(() => {
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);
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
