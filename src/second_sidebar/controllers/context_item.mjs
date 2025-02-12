import { MenuItem } from "../xul/base/menuitem.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";

export class ContextItemController {
  injectContextItem() {
    const menupopup = document.querySelector("#contentAreaContextMenu");
    const menuitem = new MenuItem({ id: "context-openlinkinsidebar" }).setLabel(
      "Open Link in Second Sidebar",
    );

    menuitem.addEventListener("command", () => {
      const url = gContextMenu.linkURL;
      SidebarControllers.webPanelNewController.createWebPanelAndOpen(url);
    });

    const separator = document.querySelector("#context-sep-open");
    menupopup.insertBefore(menuitem.getXUL(), separator);
  }
}
