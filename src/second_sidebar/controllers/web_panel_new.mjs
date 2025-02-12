/* eslint-disable no-unused-vars */
import {
  WebPanelEvents,
  listenEvent,
  sendEvent,
  sendEvents,
} from "./events.mjs";

import { NetUtilWrapper } from "../wrappers/net_utils.mjs";
import { SidebarController } from "./sidebar.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelNewButton } from "../xul/web_panel_new_button.mjs";
import { WebPanelPopupNew } from "../xul/web_panel_popup_new.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelsController } from "./web_panels.mjs";
import { fetchIconURL } from "../utils/icons.mjs";
import { gBrowserWrapper } from "../wrappers/g_browser.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

/* eslint-enable no-unused-vars */

export class WebPanelNewController {
  /**
   *
   * @param {WebPanelNewButton} webPanelNewButton
   * @param {WebPanelPopupNew} webPanelPopupNew
   */
  constructor(webPanelNewButton, webPanelPopupNew) {
    this.webPanelNewButton = webPanelNewButton;
    this.webPanelPopupNew = webPanelPopupNew;

    listenEvent(WebPanelEvents.OPEN_NEW_WEB_PANEL_POPUP, () => {
      this.openPopup();
    });

    this.webPanelNewButton.listenClick((event) => {
      if (isLeftMouseButton(event)) {
        sendEvent(WebPanelEvents.OPEN_NEW_WEB_PANEL_POPUP);
      }
    });

    this.webPanelPopupNew.listenSaveButtonClick(async (url, userContextId) => {
      const uuid = crypto.randomUUID();
      sendEvents(WebPanelEvents.CREATE_WEB_PANEL, {
        uuid,
        url,
        userContextId,
        newWebPanelPosition: this.newWebPanelPosition,
      });
      this.hidePopup();
    });

    this.webPanelPopupNew.listenCancelButtonClick(() => {
      this.hidePopup();
    });
  }

  /**
   *
   * @param {SidebarController} sidebarController
   * @param {WebPanelsController} webPanelsController
   * @param {WebPanelEditController} webPanelEditController
   */
  setupDependencies(
    sidebarController,
    webPanelsController,
    webPanelEditController,
  ) {
    this.sidebarController = sidebarController;
    this.webPanelsController = webPanelsController;
    this.webPanelEditController = webPanelEditController;
  }

  openPopup() {
    let suggest = "https://";
    const currentURI = gBrowserWrapper.currentURI;

    if (["http", "https"].includes(currentURI.scheme)) {
      suggest = currentURI.spec;
    }

    this.webPanelPopupNew.openPopup(this.webPanelNewButton.button, suggest);
  }

  hidePopup() {
    this.webPanelPopupNew.hidePopup();
  }

  /**
   *
   * @returns {string}
   */
  getNewWebPanelPosition() {
    return this.newWebPanelPosition;
  }

  /**
   *
   * @param {string} value
   */
  setNewWebPanelPosition(value) {
    this.newWebPanelPosition = value;
  }
}
