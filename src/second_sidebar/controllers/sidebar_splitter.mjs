import {
  SidebarEvents,
  WebPanelEvents,
  sendEvent,
  sendEvents,
} from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarSplitterController {
  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    SidebarElements.sidebarSplitter.listenWidthChange(() => {
      const width = SidebarElements.sidebarBox.getAttribute("width");
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_PINNED_GEOMETRY, {
        uuid: webPanelController.getUUID(),
        width: width + "px",
      });
      sendEvent(WebPanelEvents.SAVE_WEB_PANELS);
    });
  }
}
