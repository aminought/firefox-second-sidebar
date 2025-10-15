import { SidebarEvents, sendEvents } from "./events.mjs";
import {
  hideGeometryHint,
  showPinnedGeometryHint,
} from "../utils/geometry_hint.mjs";

import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class SidebarSplitterController {
  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    let resizing = false;

    SidebarElements.sidebarSplitter.addEventListener("mousedown", () => {
      resizing = true;
      showPinnedGeometryHint();
    });

    SidebarElements.sidebarSplitter.addEventListener("mousemove", () => {
      if (resizing) showPinnedGeometryHint();
    });

    SidebarElements.sidebarSplitter.addEventListener("mouseup", () => {
      const width = SidebarElements.sidebarBox.getAttribute("width");
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(SidebarEvents.EDIT_SIDEBAR_PINNED_GEOMETRY, {
        uuid: webPanelController.getUUID(),
        width: width + "px",
      });
      SidebarControllers.webPanelsController.saveSettings();
    });

    SidebarElements.sidebarSplitter.addEventListener("click", () => {
      resizing = false;
      hideGeometryHint();
    });
  }
}
