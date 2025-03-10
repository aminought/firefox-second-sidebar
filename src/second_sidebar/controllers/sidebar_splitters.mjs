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
    /**@param {number} width */
    const changeWidth = (width) => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_WIDTH, {
        uuid: webPanelController.getUUID(),
        width,
      });
      SidebarControllers.webPanelsController.saveSettings();
    };
    this.sidebarSplitterUnpinned.listenWidthChange(() =>
      changeWidth(SidebarControllers.sidebarController.getSidebarWidth()),
    );
    this.sidebarSplitterPinned.listenWidthChange(() =>
      changeWidth(SidebarControllers.sidebarController.getSidebarBoxWidth()),
    );
  }
}
