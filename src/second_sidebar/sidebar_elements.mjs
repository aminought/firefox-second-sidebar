import { CustomizableUIWrapper } from "./wrappers/customizable_ui.mjs";
import { Sidebar } from "./xul/sidebar.mjs";
import { SidebarBox } from "./xul/sidebar_box.mjs";
import { SidebarBoxFiller } from "./xul/sidebar_box_filler.mjs";
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
import { WebPanelTabs } from "./xul/web_panel_tabs.mjs";
import { WebPanels } from "./xul/web_panels.mjs";
import { XULElement } from "./xul/base/xul_element.mjs";

export class SidebarElements {
  static create() {
    console.log("Sidebar creation...");
    this.#createSidebar();

    console.log("Sidebar registration...");
    this.#registerSidebar();

    console.log("Widgets creation...");
    this.#createWidgets();

    console.log("Web panel tabs creation...");
    this.#createWebPanelTabs();

    console.log("Popups creation...");
    this.#createPopups();
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
  }

  static #registerSidebar() {
    CustomizableUIWrapper.registerArea(this.sidebarMain.id, {
      defaultPlacements: ["new-web-panel"],
    });
    CustomizableUIWrapper.registerToolbarNode(this.sidebarMain.getXUL());
  }

  static #createWidgets() {
    this.webPanelNewButton = new WebPanelNewButton();
  }

  static #createWebPanelTabs() {
    this.webPanelTabs = new WebPanelTabs();

    const body = new XULElement({ element: document.body });
    body.appendChild(this.webPanelTabs);
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
}
