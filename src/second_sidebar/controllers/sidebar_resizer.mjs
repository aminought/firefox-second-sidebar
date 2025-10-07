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

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    }

    /**
     *
     * @param {MouseEvent} e
     */
    function resize(e) {
      if (!currentResizer) return;

      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      const centered = webPanelController.getAnchor() === "center";
      const type = currentResizer.getAttribute("type");

      let top = startRect.top;
      let left = startRect.left;
      let width = startRect.width;
      let height = startRect.height;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const deltaWidth = centered ? deltaX * 2 : deltaX;
      const deltaHeight = centered ? deltaY * 2 : deltaY;

      // calculate new position and size
      if (type == "top") {
        top = startRect.top + deltaY;
        height = startRect.height - deltaHeight;
      } else if (type == "left") {
        left = startRect.left + deltaX;
        width = startRect.width - deltaWidth;
      } else if (type == "right") {
        if (centered) left = startRect.left - deltaX;
        width = startRect.width + deltaWidth;
      } else if (type == "bottom") {
        if (centered) top = startRect.top - deltaY;
        height = startRect.height + deltaHeight;
      } else if (type == "topleft") {
        top = startRect.top + deltaY;
        left = startRect.left + deltaX;
        width = startRect.width - deltaWidth;
        height = startRect.height - deltaHeight;
      } else if (type === "topright") {
        top = startRect.top + deltaY;
        if (centered) left = startRect.left - deltaX;
        width = startRect.width + deltaWidth;
        height = startRect.height - deltaHeight;
      } else if (type === "bottomright") {
        if (centered) top = startRect.top - deltaY;
        if (centered) left = startRect.left - deltaX;
        width = startRect.width + deltaWidth;
        height = startRect.height + deltaHeight;
      } else if (type === "bottomleft") {
        if (centered) top = startRect.top - deltaY;
        left = startRect.left + deltaX;
        width = startRect.width - deltaWidth;
        height = startRect.height + deltaHeight;
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

      SidebarControllers.sidebarController.calculateAndSetFloatingPosition({
        top,
        left,
        width,
        height,
        widthChanged: width != startRect.width,
        heightChanged: height != startRect.height,
        widthType: webPanelController.getWidthType(),
        heightType: webPanelController.getHeightType(),
      });
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
