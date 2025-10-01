import { SidebarEvents, sendEvents } from "./events.mjs";

import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarMover {
  constructor() {
    this.#setupListeners();
    this.ro = new ResizeObserver(() => {
      SidebarElements.sidebarBoxArea.updatePosition();
      SidebarControllers.sidebarController.setUnpinnedBox("move");
    });
    this.ro.observe(BrowserElements.tabbrowserTabbox.element);
  }

  #setupListeners() {
    const toolbarTitleWrapper =
      SidebarElements.sidebarToolbar.toolbarTitleWrapper;

    let isDragging = false;
    let hasMoved = false;
    let dragStartX, dragStartY;
    let startRect;

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
      startRect = SidebarElements.sidebarBox.getBoundingClientRect();

      toolbarTitleWrapper.setProperty("cursor", "grabbing");

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
          startRect.top + deltaY,
          startRect.left + deltaX,
        );
      }
    }

    function stopDrag() {
      if (hasMoved) {
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
}
