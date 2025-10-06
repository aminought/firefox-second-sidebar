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
    [
      SidebarElements.sidebarResizerTop,
      SidebarElements.sidebarResizerLeft,
      SidebarElements.sidebarResizerRight,
      SidebarElements.sidebarResizerBottom,
      SidebarElements.sidebarResizerTopLeft,
      SidebarElements.sidebarResizerTopRight,
      SidebarElements.sidebarResizerBottomLeft,
      SidebarElements.sidebarResizerBottomRight,
    ].forEach((resizer) => {
      resizer.addEventListener("mousedown", initResize);
    });

    let startX, startY;
    let startRect, currentResizer;

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

      let top = startRect.top;
      let left = startRect.left;
      let width = startRect.width;
      let height = startRect.height;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // calculate new position and size
      if (type == "top") {
        top = startRect.top + deltaY;
        height = startRect.height - deltaY;
      } else if (type == "left") {
        left = startRect.left + deltaX;
        width = startRect.width - deltaX;
      } else if (type == "right") {
        width = startRect.width + deltaX;
        height = startRect.height;
      } else if (type == "bottom") {
        height = startRect.height + deltaY;
      } else if (type == "topleft") {
        top = startRect.top + deltaY;
        left = startRect.left + deltaX;
        width = startRect.width - deltaX;
        height = startRect.height - deltaY;
      } else if (type === "topright") {
        top = startRect.top + deltaY;
        width = startRect.width + deltaX;
        height = startRect.height - deltaY;
      } else if (type === "bottomright") {
        width = startRect.width + deltaX;
        height = startRect.height + deltaY;
      } else if (type === "bottomleft") {
        left = startRect.left + deltaX;
        width = startRect.width - deltaX;
        height = startRect.height + deltaY;
      }

      // check minimal bounds
      if (width < SidebarResizer.MIN_WIDTH) {
        if (left != startRect.left) {
          left = left + width - SidebarResizer.MIN_WIDTH;
        }
        width = SidebarResizer.MIN_WIDTH;
      }
      if (height < SidebarResizer.MIN_HEIGHT) {
        if (top != startRect.top) {
          top = top + height - SidebarResizer.MIN_HEIGHT;
        }
        height = SidebarResizer.MIN_HEIGHT;
      }

      SidebarControllers.sidebarController.calculateAndSetFloatingPosition(
        top,
        left,
        width,
        height,
        {
          widthChanged: width != startRect.width,
          heightChanged: height != startRect.height,
        },
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
