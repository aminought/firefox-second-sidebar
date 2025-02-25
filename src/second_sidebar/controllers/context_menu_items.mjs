import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class ContextMenuItemsController {
  constructor() {
    this.openLinkInSidebarMenuItem = SidebarElements.openLinkInSidebarMenuItem;

    this.#setupListeners();
  }

  #setupListeners() {
    this.openLinkInSidebarMenuItem.addEventListener("command", () => {
      const url = gContextMenu.linkURL;
      SidebarControllers.webPanelNewController.createWebPanel(
        url,
        ScriptSecurityManagerWrapper.DEFAULT_USER_CONTEXT_ID,
      );
    });
  }
}
