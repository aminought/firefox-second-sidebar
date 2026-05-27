import { L } from "../i18n/index.mjs";
import { MenuItem } from "./base/menuitem.mjs";

export class OpenLinkAsWebPanelMenuItem extends MenuItem {
  constructor() {
    super({ id: "context-openlinkaswebpanel" });
    this.setLabel(L.contextMenu.openAsWebPanel);
  }
}
