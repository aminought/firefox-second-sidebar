import { SidebarEvents, sendEvents } from "./events.mjs";

/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { SidebarSplitterPinned } from "../xul/sidebar_splitter_pinned.mjs";
import { SidebarSplitterUnpinned } from "../xul/sidebar_splitter_unpinned.mjs";
import { WebPanelsController } from "./web_panels.mjs";

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

  /**
   * @param {SidebarController} sidebarController
   * @param {WebPanelsController} webPanelsController
   */
  setupDependencies(sidebarController, webPanelsController) {
    this.sidebarController = sidebarController;
    this.webPanelsController = webPanelsController;
  }

  #setupListeners() {
    this.sidebarSplitterUnpinned.listenWidthChange(() => {
      const webPanelController = this.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_WIDTH, {
        uuid: webPanelController.getUUID(),
        width: this.sidebarController.getSidebarWidth(),
      });
      this.webPanelsController.saveSettings();
    });

    this.sidebarSplitterPinned.listenWidthChange(() => {
      const webPanelController = this.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_WIDTH, {
        uuid: webPanelController.getUUID(),
        width: this.sidebarController.getSidebarBoxWidth(),
      });
      this.webPanelsController.saveSettings();
    });
  }
}
