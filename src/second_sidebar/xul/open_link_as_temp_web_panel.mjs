import { L } from "../i18n/index.mjs";
import { MenuItem } from "./base/menuitem.mjs";

export class OpenLinkAsTempWebPanelMenuItem extends MenuItem {
  constructor() {
    super({ id: "context-openlinkastempwebpanel" });
    this.setLabel(L.contextMenu.openAsTempWebPanel);
  }
}
