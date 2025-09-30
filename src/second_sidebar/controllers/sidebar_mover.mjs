import { SidebarEvents, sendEvents } from "./events.mjs";

import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";

export class SidebarMover {
  constructor() {
    this.#setupListeners();
    BrowserElements.tabbrowserTabbox.addEventListener("resize", () => {
      SidebarControllers.sidebarController.setUnpinnedBox("move");
    });
  }

  #setupListeners() {
    const toolbarTitleWrapper =
      SidebarElements.sidebarToolbar.toolbarTitleWrapper;

    let isDragging = false;
    let hasMoved = false;
    let dragStartX, dragStartY;
    let startPosLeft, startPosTop;

    toolbarTitleWrapper.addEventListener("mousedown", startDrag);

    document.addEventListener(
      "click",
      (e) => {
        if (SidebarControllers.sidebarController.pinned()) return;
        if (isDragging) {
          e.stopImmediatePropagation();
          e.preventDefault();

          if (hasMoved) {
            SidebarElements.webPanelsBrowser.setProperty("pointer-events", "");
            toolbarTitleWrapper.releasePointerCapture(e.pointerId);
          }
          toolbarTitleWrapper.setProperty("cursor", "grab");

          isDragging = false;
          hasMoved = false;

          document.removeEventListener("mousemove", drag);
          document.removeEventListener("mouseup", stopDrag);
        }
      },
      true,
    );

    /**
     *
     * @param {MouseEvent} e
     */
    function startDrag(e) {
      if (SidebarControllers.sidebarController.pinned()) return;
      isDragging = true;
      hasMoved = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      toolbarTitleWrapper.setProperty("cursor", "grabbing");

      const window = new WindowWrapper();
      const styles = window.getComputedStyle(SidebarElements.sidebarBox);
      startPosLeft = parseInt(styles.left);
      startPosTop = parseInt(styles.top);

      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    }

    /**
     *
     * @param {MouseEvent} e
     */
    function drag(e) {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        hasMoved = true;
        toolbarTitleWrapper.setPointerCapture(e.pointerId);
        SidebarElements.webPanelsBrowser.setProperty("pointer-events", "none");
        SidebarControllers.sidebarController.setUnpinnedBox(
          "move",
          startPosTop + deltaY,
          startPosLeft + deltaX,
        );
      }
    }

    function stopDrag() {
      if (hasMoved) {
        const webPanelController =
          SidebarControllers.webPanelsController.getActive();
        const box = SidebarControllers.sidebarController.getUnpinnedBox();

        sendEvents(SidebarEvents.EDIT_SIDEBAR_UNPINNED_BOX, {
          uuid: webPanelController.getUUID(),
          mode: "move",
          top: parseInt(box.top),
          left: parseInt(box.left),
          width: parseInt(box.width),
          height: parseInt(box.height),
        });
        SidebarControllers.webPanelsController.saveSettings();
      }
    }
  }
}
