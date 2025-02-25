import { COMMON_CSS } from "./css/common.mjs";
import { CONTAINERS_CSS } from "./css/containers.mjs";
import { CONTEXT_ITEM_CSS } from "./css/context_item.mjs";
import { CUSTOMIZATION_CSS } from "./css/customization.mjs";
import { POPUPS_CSS } from "./css/popups.mjs";
import { SIDEBAR_BOX_CSS } from "./css/sidebar_box.mjs";
import { SIDEBAR_CSS } from "./css/sidebar.mjs";
import { SIDEBAR_MAIN_CSS } from "./css/sidebar_main.mjs";
import { SidebarControllers } from "./sidebar_controllers.mjs";
import { WEB_PANELS_BROWSER_CSS } from "./css/web_panels_browser.mjs";
import { WEB_PANEL_CSS } from "./css/web_panel.mjs";

const STYLE =
  COMMON_CSS +
  SIDEBAR_MAIN_CSS +
  SIDEBAR_BOX_CSS +
  SIDEBAR_CSS +
  WEB_PANELS_BROWSER_CSS +
  WEB_PANEL_CSS +
  POPUPS_CSS +
  CONTEXT_ITEM_CSS +
  CONTAINERS_CSS +
  CUSTOMIZATION_CSS;

export class SidebarDecorator {
  static decorate() {
    const style = document.createElement("style");
    style.innerHTML = STYLE;
    document.querySelector("head").appendChild(style);
    this.#collapse();
  }

  static #collapse() {
    setTimeout(() => {
      if (SidebarControllers.sidebarController.autoHideSidebar) {
        SidebarControllers.collapseController.collapse(false, true);
      }
    }, 100);
  }
}
