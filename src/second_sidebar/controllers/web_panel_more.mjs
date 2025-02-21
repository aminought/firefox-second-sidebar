import { OPEN_URL_IN, openTrustedLinkInWrapper } from "../wrappers/global.mjs";
import { WebPanelEvents, sendEvents } from "./events.mjs";

import { ClipboardHelperWrapper } from "../wrappers/clipboard_helper.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class WebPanelMoreController {
  constructor() {
    this.webPanelPopupMore = SidebarElements.webPanelPopupMore;
    this.#setupListeners();
  }

  #setupListeners() {
    this.webPanelPopupMore.listenPopupShowing(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      this.webPanelPopupMore.setDefaults(webPanelController.dumpSettings());
    });

    this.webPanelPopupMore.listenOpenInNewTabButtonClick((event, uuid) => {
      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      openTrustedLinkInWrapper(
        webPanelController.getCurrentUrl(),
        event.ctrlKey ? OPEN_URL_IN.BACKGROUND_TAB : OPEN_URL_IN.TAB,
      );
    });

    this.webPanelPopupMore.listenCopyPageUrlButtonClick((uuid) => {
      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
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

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });

    this.webPanelPopupMore.listenZoomInButtonClick((uuid) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_IN, {
        uuid,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });

    this.webPanelPopupMore.listenResetZoomButtonClick((uuid) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM, {
        uuid,
        value: 1,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });
  }
}
