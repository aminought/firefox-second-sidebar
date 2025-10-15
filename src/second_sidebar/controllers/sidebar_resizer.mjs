import { SidebarEvents, sendEvents } from "./events.mjs";
import {
  hideGeometryHint,
  showFloatingGeometryHint,
} from "../utils/geometry_hint.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

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
    let webPanelController;

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
          hideGeometryHint();

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
      webPanelController = SidebarControllers.webPanelsController.getActive();
      showFloatingGeometryHint();

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
      if (type.startsWith("top")) {
        top += deltaY;
        height -= deltaHeight;
      }
      if (type.startsWith("bottom")) {
        if (centered) top -= deltaY;
        height += deltaHeight;
      }
      if (type.endsWith("left")) {
        left += deltaX;
        width -= deltaWidth;
      }
      if (type.endsWith("right")) {
        if (centered) left -= deltaX;
        width += deltaWidth;
      }

      // check minimal bounds
      if (width < SidebarResizer.MIN_WIDTH) {
        if (left != startRect.left) {
          left += width - SidebarResizer.MIN_WIDTH;
        }
        width = SidebarResizer.MIN_WIDTH;
      }
      if (height < SidebarResizer.MIN_HEIGHT) {
        if (top != startRect.top) {
          top += height - SidebarResizer.MIN_HEIGHT;
        }
        height = SidebarResizer.MIN_HEIGHT;
      }

      SidebarControllers.sidebarGeometry.calculateAndSetFloatingGeometry(
        webPanelController,
        {
          top,
          left,
          width: width !== startRect.width ? width : null,
          height: height !== startRect.height ? height : null,
        },
      );
      showFloatingGeometryHint();
    }

    function stopResize() {
      const geometry = webPanelController.getFloatingGeometry();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_FLOATING_GEOMETRY, {
        uuid: webPanelController.getUUID(),
        geometry,
      });
      SidebarControllers.webPanelsController.saveSettings();
    }
  }
}
