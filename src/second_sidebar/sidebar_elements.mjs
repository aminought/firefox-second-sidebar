import { CustomizableUIWrapper } from "./wrappers/customizable_ui.mjs";
import { OpenLinkInSidebarMenuItem } from "./xul/open_link_in_sidebar_menuitem.mjs";
import { Sidebar } from "./xul/sidebar.mjs";
import { SidebarBox } from "./xul/sidebar_box.mjs";
import { SidebarBoxFiller } from "./xul/sidebar_box_filler.mjs";
import { SidebarCollapseButton } from "./xul/sidebar_collapse_button.mjs";
import { SidebarMain } from "./xul/sidebar_main.mjs";
import { SidebarMainMenuPopup } from "./xul/sidebar_main_menupopup.mjs";
import { SidebarMainPopupSettings } from "./xul/sidebar_main_popup_settings.mjs";
import { SidebarSplitterPinned } from "./xul/sidebar_splitter_pinned.mjs";
import { SidebarSplitterUnpinned } from "./xul/sidebar_splitter_unpinned.mjs";
import { SidebarToolbar } from "./xul/sidebar_toolbar.mjs";
import { WebPanelMenuPopup } from "./xul/web_panel_menupopup.mjs";
import { WebPanelNewButton } from "./xul/web_panel_new_button.mjs";
import { WebPanelPopupDelete } from "./xul/web_panel_popup_delete.mjs";
import { WebPanelPopupEdit } from "./xul/web_panel_popup_edit.mjs";
import { WebPanelPopupMore } from "./xul/web_panel_popup_more.mjs";
import { WebPanelPopupNew } from "./xul/web_panel_popup_new.mjs";
import { WebPanels } from "./xul/web_panels.mjs";
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
    this.sidebarMain = new SidebarMain();
    this.sidebarBox = new SidebarBox();
    this.sidebarBoxFiller = new SidebarBoxFiller();
    this.sidebarSplitterPinned = new SidebarSplitterPinned();
    this.sidebarSplitterUnpinned = new SidebarSplitterUnpinned();
    this.sidebar = new Sidebar();
    this.sidebarToolbar = new SidebarToolbar();
    this.webPanels = new WebPanels();
    this.webPanelsBrowser = new WebPanelsBrowser();

    const browser = new XULElement({
      element: document.getElementById("browser"),
    });
    browser.appendChildren(
      this.sidebarSplitterPinned,
      this.sidebarBox.appendChildren(
        this.sidebarBoxFiller,
        this.sidebarSplitterUnpinned,
        this.sidebar.appendChildren(this.sidebarToolbar, this.webPanels),
      ),
      this.sidebarMain,
    );
    this.webPanels.appendChild(this.webPanelsBrowser);
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
