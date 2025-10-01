import { SidebarEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarResizer {
  static MIN_WIDTH = 200;
  static MIN_HEIGHT = 200;

  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    let startX, startY;
    let startRect;
    let currentResizer;

    SidebarElements.sidebarResizerBl.addEventListener("mousedown", initResize);
    SidebarElements.sidebarResizerBr.addEventListener("mousedown", initResize);
    document.addEventListener(
      "click",
      (e) => {
        if (SidebarControllers.sidebarController.pinned()) return;
        if (currentResizer) {
          e.stopImmediatePropagation();
          e.preventDefault();
          SidebarElements.webPanelsBrowser.setProperty("pointer-events", "");
          currentResizer.releasePointerCapture(e.pointerId);
          currentResizer = null;

          document.removeEventListener("mousemove", resize);
          document.removeEventListener("mouseup", stopResize);
        }
      },
      true,
    );

    /**
     *
     * @param {MouseEvent} e
     */
    function initResize(e) {
      SidebarElements.webPanelsBrowser.setProperty("pointer-events", "none");
      currentResizer = e.target;
      currentResizer.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      startRect = SidebarElements.sidebarBox.getBoundingClientRect();

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    }

    /**
     *
     * @param {MouseEvent} e
     */
    function resize(e) {
      if (!currentResizer) return;
      const type = currentResizer.getAttribute("type");

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (type === "br") {
        let newWidth = startRect.width + deltaX;
        let newHeight = startRect.height + deltaY;
        if (newWidth < SidebarResizer.MIN_WIDTH) {
          newWidth = SidebarResizer.MIN_WIDTH;
        }
        if (newHeight < SidebarResizer.MIN_HEIGHT) {
          newHeight = SidebarResizer.MIN_HEIGHT;
        }
        SidebarControllers.sidebarController.setUnpinnedBox(
          "resize",
          startRect.top,
          startRect.left,
          newWidth,
          newHeight,
        );
      } else if (type === "bl") {
        let newLeft = startRect.left + deltaX;
        let newWidth = startRect.width - deltaX;
        let newHeight = startRect.height + deltaY;
        if (newWidth < SidebarResizer.MIN_WIDTH) {
          newLeft = newLeft + newWidth - SidebarResizer.MIN_WIDTH;
          newWidth = SidebarResizer.MIN_WIDTH;
        }
        if (newHeight < SidebarResizer.MIN_HEIGHT) {
          newHeight = SidebarResizer.MIN_HEIGHT;
        }
        SidebarControllers.sidebarController.setUnpinnedBox(
          "resize",
          startRect.top,
          newLeft,
          newWidth,
          newHeight,
        );
      }
    }

    function stopResize() {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_UNPINNED_BOX, {
        uuid: webPanelController.getUUID(),
        marginTop: SidebarElements.sidebarBox.getProperty("margin-top"),
        marginLeft: SidebarElements.sidebarBox.getProperty("margin-left"),
        marginRight: SidebarElements.sidebarBox.getProperty("margin-right"),
        marginBottom: SidebarElements.sidebarBox.getProperty("margin-bottom"),
        width: SidebarElements.sidebarBox.getProperty("width"),
        height: SidebarElements.sidebarBox.getProperty("height"),
      });
      SidebarControllers.webPanelsController.saveSettings();
    }
  }
}
