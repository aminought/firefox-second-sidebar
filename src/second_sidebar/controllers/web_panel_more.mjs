/* eslint-disable no-unused-vars */
import { OPEN_URL_IN, openTrustedLinkInWrapper } from "../wrappers/global.mjs";
import { WebPanelEvents, sendEvents } from "./events.mjs";

import { ClipboardHelperWrapper } from "../wrappers/clipboard_helper.mjs";
import { SidebarController } from "./sidebar.mjs";
import { WebPanelPopupMore } from "../xul/web_panel_popup_more.mjs";
import { WebPanelsController } from "./web_panels.mjs";

/* eslint-enable no-unused-vars */

export class WebPanelMoreController {
  /**
   *
   * @param {WebPanelPopupMore} webPanelPopupMore
   */
  constructor(webPanelPopupMore) {
    this.webPanelPopupMore = webPanelPopupMore;
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
    this.webPanelPopupMore.listenPopupShowing(() => {
      const webPanelController = this.webPanelsController.getActive();
      this.webPanelPopupMore.setDefaults(webPanelController.dumpSettings());
    });

    this.webPanelPopupMore.listenOpenInNewTabButtonClick((event, uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      openTrustedLinkInWrapper(
        webPanelController.getCurrentUrl(),
        event.ctrlKey ? OPEN_URL_IN.BACKGROUND_TAB : OPEN_URL_IN.TAB,
      );
    });

    this.webPanelPopupMore.listenCopyPageUrlButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      ClipboardHelperWrapper.copyString(webPanelController.getCurrentUrl());
    });

    this.webPanelPopupMore.listenMobileButtonClick((uuid, mobile) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_MOBILE, {
        uuid,
        mobile,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);
    });

    this.webPanelPopupMore.listenZoomOutButtonClick((uuid) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_OUT, {
        uuid,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);

      const webPanelController = this.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });

    this.webPanelPopupMore.listenZoomInButtonClick((uuid) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_IN, {
        uuid,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);

      const webPanelController = this.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });

    this.webPanelPopupMore.listenResetZoomButtonClick((uuid) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM, {
        uuid,
        value: 1,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);

      const webPanelController = this.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });
  }
}
