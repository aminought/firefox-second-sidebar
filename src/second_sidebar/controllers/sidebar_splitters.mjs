/* eslint-disable no-unused-vars */
import { SidebarEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarSplitterPinned } from "../xul/sidebar_splitter_pinned.mjs";
import { SidebarSplitterUnpinned } from "../xul/sidebar_splitter_unpinned.mjs";

/* eslint-enable no-unused-vars */

export class SidebarSplittersController {
  /**
   *
   * @param {SidebarSplitterUnpinned} sidebarSplitterUnpinned
   * @param {SidebarSplitterPinned} sidebarSplitterPinned
   */
  constructor(sidebarSplitterUnpinned, sidebarSplitterPinned) {
    this.sidebarSplitterUnpinned = sidebarSplitterUnpinned;
    this.sidebarSplitterPinned = sidebarSplitterPinned;

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
