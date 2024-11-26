/* eslint-disable no-unused-vars */
import { MenuItem } from "../xul/base/menuitem.mjs";
import { WebPanelNewController } from "./web_panel_new.mjs";
/* eslint-enable no-unused-vars */

export class ContextItemController {
  /**
   *
   * @param {WebPanelNewController} webPanelNewController
   */
  setupDependencies(webPanelNewController) {
    this.webPanelNewController = webPanelNewController;
  }

  injectContextItem() {
    const menupopup = document.querySelector("#contentAreaContextMenu");
    const menuitem = new MenuItem({ id: "context-openlinkinsidebar" }).setLabel(
      "Open Link in Second Sidebar",
    );

    menuitem.addEventListener("command", () => {
      const url = gContextMenu.linkURL;
      this.webPanelNewController.createWebPanelAndOpen(url);
    });

    const separator = document.querySelector("#context-sep-open");
    menupopup.insertBefore(menuitem.getXUL(), separator);
  }
}
