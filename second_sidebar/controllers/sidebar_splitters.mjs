import { SidebarController } from "./sidebar.mjs";
import { SidebarSplitterPinned } from "../xul/sidebar_splitter_pinned.mjs";
import { SidebarSplitterUnpinned } from "../xul/sidebar_splitter_unpinned.mjs";
import { WebPanelsController } from "./web_panels.mjs";

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
      const width = this.sidebarController.getSidebarWidth();
      this.sidebarController.setWidth(width);
      const webPanelController = this.webPanelsController.getActive();
      webPanelController.setWidth(width);
      this.webPanelsController.savePref();
    });

    this.sidebarSplitterPinned.listenWidthChange(() => {
      const width = this.sidebarController.getSidebarBoxWidth();
      this.sidebarController.setWidth(width);
      const webPanelController = this.webPanelsController.getActive();
      webPanelController.setWidth(width);
      this.webPanelsController.savePref();
    });
  }
}
