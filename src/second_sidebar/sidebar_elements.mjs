import { AfterSplitter } from "./xul/after_splitter.mjs";
import { CustomizableUIWrapper } from "./wrappers/customizable_ui.mjs";
import { OpenLinkInSidebarMenuItem } from "./xul/open_link_in_sidebar_menuitem.mjs";
import { SidebarBox } from "./xul/sidebar_box.mjs";
import { SidebarCollapseButton } from "./xul/sidebar_collapse_button.mjs";
import { SidebarMain } from "./xul/sidebar_main.mjs";
import { SidebarMainMenuPopup } from "./xul/sidebar_main_menupopup.mjs";
import { SidebarMainPopupSettings } from "./xul/sidebar_main_popup_settings.mjs";
import { SidebarResizer } from "./xul/sidebar_resizer.mjs";
import { SidebarSplitter } from "./xul/sidebar_splitter.mjs";
import { SidebarToolbar } from "./xul/sidebar_toolbar.mjs";
import { SidebarWrapper } from "./xul/sidebar_wrapper.mjs";
import { WebPanelMenuPopup } from "./xul/web_panel_menupopup.mjs";
import { WebPanelNewButton } from "./xul/web_panel_new_button.mjs";
import { WebPanelPopupDelete } from "./xul/web_panel_popup_delete.mjs";
import { WebPanelPopupEdit } from "./xul/web_panel_popup_edit.mjs";
import { WebPanelPopupMore } from "./xul/web_panel_popup_more.mjs";
import { WebPanelPopupNew } from "./xul/web_panel_popup_new.mjs";
import { WebPanelsBrowser } from "./xul/web_panels_browser.mjs";
import { XULElement } from "./xul/base/xul_element.mjs";

export class SidebarElements {
  static create() {
    console.log("Sidebar creation...");
    this.#createSidebar();

    console.log("Sidebar registration...");
    this.#registerSidebar();

    console.log("Widgets creation...");
    this.#createWidgets();

    console.log("Popups creation...");
    this.#createPopups();

    console.log("Context menu items creation...");
    this.#createContextMenuItems();
  }

  static #createSidebar() {
    this.sidebarWrapper = new SidebarWrapper();
    this.sidebarMain = new SidebarMain();
    this.sidebarBox = new SidebarBox();
    this.sidebarToolbar = new SidebarToolbar();
    this.webPanelsBrowser = new WebPanelsBrowser();
    this.sidebarResizerBl = new SidebarResizer("bl");
    this.sidebarResizerBr = new SidebarResizer("br");
    this.sidebarSplitter = new SidebarSplitter();
    this.afterSplitter = new AfterSplitter();

    const browser = new XULElement({
      element: document.getElementById("browser"),
    });
    browser.appendChildren(
      this.sidebarWrapper.appendChildren(
        this.sidebarMain,
        this.sidebarBox.appendChildren(
          this.sidebarToolbar,
          this.webPanelsBrowser,
          this.sidebarResizerBl,
          this.sidebarResizerBr,
        ),
        this.sidebarSplitter,
        this.afterSplitter,
      ),
    );
  }

  static #registerSidebar() {
    CustomizableUIWrapper.registerArea(this.sidebarMain.id, {
      defaultPlacements: ["new-web-panel"],
    });
    CustomizableUIWrapper.registerToolbarNode(this.sidebarMain.getXUL());
  }

  static #createWidgets() {
    this.webPanelNewButton = new WebPanelNewButton();
    this.sidebarCollapseButton = new SidebarCollapseButton();
  }

  static #createPopups() {
    this.webPanelMenuPopup = new WebPanelMenuPopup();
    this.webPanelPopupNew = new WebPanelPopupNew();
    this.webPanelPopupEdit = new WebPanelPopupEdit();
    this.webPanelPopupMore = new WebPanelPopupMore();
    this.webPanelPopupDelete = new WebPanelPopupDelete();
    this.sidebarMainPopupSettings = new SidebarMainPopupSettings();
    this.sidebarMainMenuPopup = new SidebarMainMenuPopup();

    const mainPopupSet = new XULElement({
      element: document.getElementById("mainPopupSet"),
    });
    mainPopupSet.appendChildren(
      this.webPanelMenuPopup,
      this.webPanelPopupNew,
      this.webPanelPopupEdit,
      this.webPanelPopupDelete,
      this.sidebarMainMenuPopup,
      this.sidebarMainPopupSettings,
    );
    this.sidebarToolbar.moreButton.appendChild(this.webPanelPopupMore);
  }

  static #createContextMenuItems() {
    this.openLinkInSidebarMenuItem = new OpenLinkInSidebarMenuItem();

    const contentAreaContextMenu = new XULElement({
      element: document.getElementById("contentAreaContextMenu"),
    });
    const separator = new XULElement({
      element: document.getElementById("context-sep-open"),
    });
    contentAreaContextMenu.insertBefore(
      this.openLinkInSidebarMenuItem,
      separator,
    );
  }
}
