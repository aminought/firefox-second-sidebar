import { SidebarEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";

export class SidebarResizer {
  static MIN_WIDTH = 200;
  static MIN_HEIGHT = 200;

  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    let startX, startY;
    let startWidth, startHeight;
    let startLeft, startTop;
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

      const window = new WindowWrapper();
      const styles = window.getComputedStyle(SidebarElements.sidebarBox);
      startWidth = parseInt(styles.width);
      startHeight = parseInt(styles.height);
      startLeft = parseInt(styles.left);
      startTop = parseInt(styles.top);

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
        let newWidth = startWidth + deltaX;
        let newHeight = startHeight + deltaY;
        if (newWidth < SidebarResizer.MIN_WIDTH) {
          newWidth = SidebarResizer.MIN_WIDTH;
        }
        if (newHeight < SidebarResizer.MIN_HEIGHT) {
          newHeight = SidebarResizer.MIN_HEIGHT;
        }
        SidebarControllers.sidebarController.setUnpinnedBox(
          "resize",
          startTop,
          startLeft,
          newWidth,
          newHeight,
        );
      } else if (type === "bl") {
        let newLeft = startLeft + deltaX;
        let newWidth = startWidth - deltaX;
        let newHeight = startHeight + deltaY;
        if (newWidth < SidebarResizer.MIN_WIDTH) {
          newLeft = newLeft + newWidth - SidebarResizer.MIN_WIDTH;
          newWidth = SidebarResizer.MIN_WIDTH;
        }
        if (newHeight < SidebarResizer.MIN_HEIGHT) {
          newHeight = SidebarResizer.MIN_HEIGHT;
        }
        SidebarControllers.sidebarController.setUnpinnedBox(
          "resize",
          startTop,
          newLeft,
          newWidth,
          newHeight,
        );
      }
    }

    function stopResize() {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      const box = SidebarControllers.sidebarController.getUnpinnedBox();

      sendEvents(SidebarEvents.EDIT_SIDEBAR_UNPINNED_BOX, {
        uuid: webPanelController.getUUID(),
        mode: "resize",
        top: parseInt(box.top),
        left: parseInt(box.left),
        width: parseInt(box.width),
        height: parseInt(box.height),
      });
      SidebarControllers.webPanelsController.saveSettings();
    }
  }
}
