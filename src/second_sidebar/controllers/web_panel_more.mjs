/* eslint-disable no-unused-vars */
import { OPEN_URL_IN, openTrustedLinkIn } from "../wrappers/global.mjs";

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
      openTrustedLinkIn(
        webPanelController.getCurrentUrl(),
        event.ctrlKey ? OPEN_URL_IN.BACKGROUND_TAB : OPEN_URL_IN.TAB,
      );
    });

    this.webPanelPopupMore.listenCopyPageUrlButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      ClipboardHelperWrapper.copyString(webPanelController.getCurrentUrl());
    });

    this.webPanelPopupMore.listenMobileButtonClick((uuid, mobile) => {
      const webPanelController = this.webPanelsController.get(uuid);
      webPanelController.setMobile(mobile);
      this.webPanelsController.saveSettings();
    });

    this.webPanelPopupMore.listenZoomInButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      webPanelController.zoomIn();
      this.webPanelsController.saveSettings();
      return webPanelController.getZoom();
    });

    this.webPanelPopupMore.listenZoomOutButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      webPanelController.zoomOut();
      this.webPanelsController.saveSettings();
      return webPanelController.getZoom();
    });

    this.webPanelPopupMore.listenResetZoomButtonClick((uuid) => {
      const webPanelController = this.webPanelsController.get(uuid);
      webPanelController.resetZoom();
      this.webPanelsController.saveSettings();
      return webPanelController.getZoom();
    });
  }
}
