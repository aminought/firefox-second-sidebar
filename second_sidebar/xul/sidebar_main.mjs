import { Toolbar } from "./base/toolbar.mjs";

export class SidebarMain extends Toolbar {
  constructor() {
    super({ id: "sidebar-2-main", classList: ["browser-toolbar"] });
    this.setMode("icons").setContext("sidebar-2-main-menupopup");
  }
}
