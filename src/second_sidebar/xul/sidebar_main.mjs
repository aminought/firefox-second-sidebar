import { Toolbar } from "./base/toolbar.mjs";

export class SidebarMain extends Toolbar {
  constructor() {
    super({ id: "sb2-main", classList: ["browser-toolbar"] });
    this.setAttribute("customizable", "true");
    this.setAttribute("customizationtarget", "sb2-main-buttons");
    this.setMode("icons").setContext("sb2-main-menupopup");
  }
}
