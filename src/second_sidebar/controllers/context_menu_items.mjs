import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export class ContextMenuItemsController {
  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    SidebarElements.openLinkAsWebPanelMenuItem.addEventListener("command", () =>
      this.#openLinkAsWebPanel(),
    );

    SidebarElements.openLinkAsTempWebPanelMenuItem.addEventListener(
      "command",
      () => this.#openLinkAsWebPanel(true),
    );
  }

  /**
   * @param {boolean} temporary
   */
  #openLinkAsWebPanel(temporary = false) {
    const url = gContextMenu.linkURL;
    SidebarControllers.webPanelNewController.createWebPanel(
      url,
      ScriptSecurityManagerWrapper.DEFAULT_USER_CONTEXT_ID,
      temporary,
    );
  }
}
