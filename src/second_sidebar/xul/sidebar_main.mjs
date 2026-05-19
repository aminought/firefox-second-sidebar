import { Toolbar } from "./base/toolbar.mjs";

export class SidebarMain extends Toolbar {
  constructor() {
    super({ id: "sb2-main", classList: ["chrome-block"] });
    this.setMode("icons")
      .setContext("sb2-main-menupopup")
      .setAttribute("customizable", "true")
      .setAttribute("fullscreentoolbar", "true");
  }
}
