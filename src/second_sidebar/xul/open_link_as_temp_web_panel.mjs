import { MenuItem } from "./base/menuitem.mjs";

export class OpenLinkAsTempWebPanelMenuItem extends MenuItem {
  constructor() {
    super({ id: "context-openlinkastempwebpanel" });
    this.setLabel("Preview Link in Second Sidebar");
  }
}
