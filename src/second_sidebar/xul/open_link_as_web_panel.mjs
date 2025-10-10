import { MenuItem } from "./base/menuitem.mjs";

export class OpenLinkAsWebPanelMenuItem extends MenuItem {
  constructor() {
    super({ id: "context-openlinkaswebpanel" });
    this.setLabel("Open Link in Second Sidebar");
  }
}
