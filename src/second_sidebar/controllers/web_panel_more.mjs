import { OPEN_URL_IN, openTrustedLinkInWrapper } from "../wrappers/global.mjs";
import { WebPanelEvents, sendEvent, sendEvents } from "./events.mjs";

import { ClipboardHelperWrapper } from "../wrappers/clipboard_helper.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class WebPanelMoreController {
  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    SidebarElements.webPanelPopupMore.listenPopupShowing(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      SidebarElements.webPanelPopupMore.setDefaults(
        webPanelController.dumpSettings(),
      );
    });

    SidebarElements.webPanelPopupMore.listenOpenInNewTabButtonClick(
      (event, uuid) => {
        const webPanelController =
          SidebarControllers.webPanelsController.get(uuid);
        openTrustedLinkInWrapper(
          webPanelController.getCurrentUrl(),
          event.ctrlKey ? OPEN_URL_IN.BACKGROUND_TAB : OPEN_URL_IN.TAB,
        );
      },
    );

    SidebarElements.webPanelPopupMore.listenCopyPageUrlButtonClick((uuid) => {
      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      ClipboardHelperWrapper.copyString(webPanelController.getCurrentUrl());
    });

    SidebarElements.webPanelPopupMore.listenMobileButtonClick(
      (uuid, mobile) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_MOBILE, {
          uuid,
          mobile,
        });
        sendEvents(WebPanelEvents.SAVE_WEB_PANELS);
      },
    );

    SidebarElements.webPanelPopupMore.listenTemporaryButtonClick(
      (uuid, temporary) => {
        sendEvent(WebPanelEvents.EDIT_WEB_PANEL_TEMPORARY, {
          uuid,
          temporary,
        });
        sendEvent(WebPanelEvents.SAVE_WEB_PANELS);
      },
    );

    SidebarElements.webPanelPopupMore.listenAlwaysOnTopButtonClick(
      (uuid, alwaysOnTop) => {
        sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ALWAYS_ON_TOP, {
          uuid,
          alwaysOnTop,
        });
        sendEvents(WebPanelEvents.SAVE_WEB_PANELS);
      },
    );

    SidebarElements.webPanelPopupMore.listenZoomOutButtonClick((uuid) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_OUT, {
        uuid,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });

    SidebarElements.webPanelPopupMore.listenZoomInButtonClick((uuid) => {
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_IN, {
        uuid,
      });
      sendEvents(WebPanelEvents.SAVE_WEB_PANELS);

      const webPanelController =
        SidebarControllers.webPanelsController.get(uuid);
      return webPanelController.getZoom();
    });

    SidebarElements.webPanelPopupMore.listenResetZoomButtonClick((uuid) => {
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
