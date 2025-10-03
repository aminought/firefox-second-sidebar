import { SidebarEvents, sendEvents } from "./events.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { showSidebarBoxPositionHint } from "../utils/hint.mjs";

export class SidebarResizer {
  static MIN_WIDTH = 200;
  static MIN_HEIGHT = 200;

  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    let startX, startY;
    let startRect, currentResizer;

    SidebarElements.sidebarResizerTl.addEventListener("mousedown", initResize);
    SidebarElements.sidebarResizerTr.addEventListener("mousedown", initResize);
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
          SidebarElements.sidebarHint.hide();

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
      SidebarElements.sidebarHint.show();

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

      let top, left, width, height;

      if (type == "tl") {
        top = startRect.top + deltaY;
        left = startRect.left + deltaX;
        width = startRect.width - deltaX;
        height = startRect.height - deltaY;
        if (width < SidebarResizer.MIN_WIDTH) {
          left = left + width - SidebarResizer.MIN_WIDTH;
          width = SidebarResizer.MIN_WIDTH;
        }
        if (height < SidebarResizer.MIN_HEIGHT) {
          top = top + height - SidebarResizer.MIN_HEIGHT;
          height = SidebarResizer.MIN_HEIGHT;
        }
      } else if (type === "tr") {
        top = startRect.top + deltaY;
        left = startRect.left;
        width = startRect.width + deltaX;
        height = startRect.height - deltaY;
        if (width < SidebarResizer.MIN_WIDTH) {
          width = SidebarResizer.MIN_WIDTH;
        }
        if (height < SidebarResizer.MIN_HEIGHT) {
          top = top + height - SidebarResizer.MIN_HEIGHT;
          height = SidebarResizer.MIN_HEIGHT;
        }
      } else if (type === "br") {
        top = startRect.top;
        left = startRect.left;
        width = startRect.width + deltaX;
        height = startRect.height + deltaY;
        if (width < SidebarResizer.MIN_WIDTH) {
          width = SidebarResizer.MIN_WIDTH;
        }
        if (height < SidebarResizer.MIN_HEIGHT) {
          height = SidebarResizer.MIN_HEIGHT;
        }
      } else if (type === "bl") {
        top = startRect.top;
        left = startRect.left + deltaX;
        width = startRect.width - deltaX;
        height = startRect.height + deltaY;
        if (width < SidebarResizer.MIN_WIDTH) {
          left = left + width - SidebarResizer.MIN_WIDTH;
          width = SidebarResizer.MIN_WIDTH;
        }
        if (height < SidebarResizer.MIN_HEIGHT) {
          height = SidebarResizer.MIN_HEIGHT;
        }
      }

      SidebarControllers.sidebarController.setUnpinnedBox(
        "resize",
        top,
        left,
        width,
        height,
      );
      showSidebarBoxPositionHint();
    }

    function stopResize() {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_FLOATING_POSITION, {
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
