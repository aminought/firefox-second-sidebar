import { SidebarEvents, WebPanelEvents, sendEvents } from "./events.mjs";
import {
  hideGeometryHint,
  showFloatingGeometryHint,
} from "../utils/geometry_hint.mjs";

import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarMover {
  constructor() {
    this.#setupListeners();
    setTimeout(() => this.#setupResizeObserver(), 1000);
  }

  #setupResizeObserver() {
    this.ro = new ResizeObserver(() => {
      SidebarElements.sidebarBoxArea.updatePosition();
    });
    this.ro.observe(BrowserElements.tabbrowserTabbox.element);
  }

  #setupListeners() {
    const toolbarTitleWrapper =
      SidebarElements.sidebarToolbar.toolbarTitleWrapper;

    let isDragging = false;
    let hasMoved = false;
    let dragStartX, dragStartY, startRect;

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
        hideGeometryHint();
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
      showFloatingGeometryHint();

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
        SidebarControllers.sidebarGeometry.calculateAndSetFloatingGeometry({
          top: startRect.top + deltaY,
          left: startRect.left + deltaX,
        });
        showFloatingGeometryHint();
      }
    }

    function stopDrag() {
      if (hasMoved) {
        const webPanelController =
          SidebarControllers.webPanelsController.getActive();
        sendEvents(SidebarEvents.EDIT_SIDEBAR_FLOATING_GEOMETRY, {
          uuid: webPanelController.getUUID(),
          top: SidebarElements.sidebarBox.getProperty("top"),
          left: SidebarElements.sidebarBox.getProperty("left"),
          right: SidebarElements.sidebarBox.getProperty("right"),
          bottom: SidebarElements.sidebarBox.getProperty("bottom"),
          width: SidebarElements.sidebarBox.getProperty("width"),
          height: SidebarElements.sidebarBox.getProperty("height"),
          margin: SidebarElements.sidebarBox.getProperty("margin"),
        });
        sendEvents(WebPanelEvents.SAVE_WEB_PANELS);
      }
    }
  }
}
