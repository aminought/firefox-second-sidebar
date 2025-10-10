import {
  WebPanelEvents,
  listenEvent,
  sendEvent,
  sendEvents,
} from "./events.mjs";

import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

export class WebPanelNewController {
  constructor() {
    listenEvent(WebPanelEvents.OPEN_NEW_WEB_PANEL_POPUP, () => {
      this.openPopup();
    });

    SidebarElements.webPanelNewButton.listenClick((event) => {
      if (isLeftMouseButton(event)) {
        sendEvent(WebPanelEvents.OPEN_NEW_WEB_PANEL_POPUP);
      }
    });

    SidebarElements.webPanelPopupNew.listenSaveButtonClick(
      async (url, userContextId) => {
        this.createWebPanel(url, userContextId);
        this.hidePopup();
      },
    );

    SidebarElements.webPanelPopupNew.listenCancelButtonClick(() => {
      this.hidePopup();
    });
  }

  /**
   *
   * @param {string} url
   * @param {number} userContextId
   */
  createWebPanel(url, userContextId) {
    const uuid = crypto.randomUUID();
    sendEvents(WebPanelEvents.CREATE_WEB_PANEL, {
      uuid,
      url,
      userContextId,
      newWebPanelPosition: this.newWebPanelPosition,
    });
  }

  openPopup() {
    let suggest = "https://";
    const currentURI = new WindowWrapper().gBrowser.currentURI;

    if (["http", "https"].includes(currentURI.scheme)) {
      suggest = currentURI.spec;
    }

    SidebarElements.webPanelPopupNew.openPopup(
      SidebarElements.webPanelNewButton.button,
      suggest,
    );
  }

  hidePopup() {
    SidebarElements.webPanelPopupNew.hidePopup();
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
