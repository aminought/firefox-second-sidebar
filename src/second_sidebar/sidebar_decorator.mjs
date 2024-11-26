import { COMMON_CSS } from "./css/common.mjs";
import { CONTEXT_ITEM_CSS } from "./css/context_item.mjs";
import { POPUP_CSS } from "./css/popup.mjs";
import { SIDEBAR_BOX_CSS } from "./css/sidebar_box.mjs";
import { SIDEBAR_CSS } from "./css/sidebar.mjs";
import { SIDEBAR_MAIN_CSS } from "./css/sidebar_main.mjs";
import { SIDEBAR_MAIN_POPUP_SETTINGS_CSS } from "./css/sidebar_main_popup_settings.mjs";
import { WEB_PANEL_CSS } from "./css/web_panel.mjs";
import { WEB_PANEL_POPUP_EDIT_CSS } from "./css/web_panel_popup_edit.mjs";
import { WEB_PANEL_POPUP_NEW_CSS } from "./css/web_panel_popup_new.mjs";

const STYLE =
  COMMON_CSS +
  SIDEBAR_MAIN_CSS +
  SIDEBAR_MAIN_POPUP_SETTINGS_CSS +
  SIDEBAR_BOX_CSS +
  SIDEBAR_CSS +
  WEB_PANEL_CSS +
  POPUP_CSS +
  WEB_PANEL_POPUP_NEW_CSS +
  WEB_PANEL_POPUP_EDIT_CSS +
  CONTEXT_ITEM_CSS;

export class SidebarDecorator {
  static decorate() {
    const style = document.createElement("style");
    style.innerHTML = STYLE;
    document.querySelector("head").appendChild(style);
  }
}
