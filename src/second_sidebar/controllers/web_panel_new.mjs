import { WebPanelEvents, sendEvents } from "./events.mjs";

import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

export class WebPanelNewController {
  constructor() {
    SidebarElements.webPanelNewButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isLeftMouseButton(event)) {
        this.openPopup();
      }
    });

    SidebarElements.webPanelPopupNew.listenSaveButtonClick(
      async (url, userContextId, temporary) => {
        this.createWebPanel(url, userContextId, temporary);
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
   * @param {boolean} temporary
   */
  createWebPanel(url, userContextId, temporary) {
    const uuid = crypto.randomUUID();
    sendEvents(WebPanelEvents.CREATE_WEB_PANEL, {
      uuid,
      url,
      userContextId,
      temporary,
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
