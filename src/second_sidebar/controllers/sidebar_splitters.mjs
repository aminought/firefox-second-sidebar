import { SidebarEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarSplittersController {
  constructor() {
    this.sidebarSplitterUnpinned = SidebarElements.sidebarSplitterUnpinned;
    this.sidebarSplitterPinned = SidebarElements.sidebarSplitterPinned;

    this.#setupListeners();
  }

  #setupListeners() {
    this.sidebarSplitterUnpinned.listenWidthChange(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_WIDTH, {
        uuid: webPanelController.getUUID(),
        width: SidebarControllers.sidebarController.getSidebarWidth(),
      });
      SidebarControllers.webPanelsController.saveSettings();
    });

    this.sidebarSplitterPinned.listenWidthChange(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_WIDTH, {
        uuid: webPanelController.getUUID(),
        width: SidebarControllers.sidebarController.getSidebarBoxWidth(),
      });
      SidebarControllers.webPanelsController.saveSettings();
    });
  }
}
