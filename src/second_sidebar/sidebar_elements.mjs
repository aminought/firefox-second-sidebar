import { AfterSplitter } from "./xul/after_splitter.mjs";
import { CustomizableUIWrapper } from "./wrappers/customizable_ui.mjs";
import { GeometryHint } from "./xul/geometry_hint.mjs";
import { OpenLinkAsTempWebPanelMenuItem } from "./xul/open_link_as_temp_web_panel.mjs";
import { OpenLinkAsWebPanelMenuItem } from "./xul/open_link_as_web_panel.mjs";
import { SearchInWebPanelMenuItem } from "./xul/search_in_web_panel.mjs";
import { SidebarBox } from "./xul/sidebar_box.mjs";
import { SidebarBoxArea } from "./xul/sidebar_box_area.mjs";
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
import { WebPanelTooltip } from "./xul/web_panel_tooltip.mjs";
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
    this.sidebarBoxArea = new SidebarBoxArea();
    this.sidebarBox = new SidebarBox();
    this.sidebarToolbar = new SidebarToolbar();
    this.webPanelsBrowser = new WebPanelsBrowser();
    this.sidebarResizerTop = new SidebarResizer("top");
    this.sidebarResizerLeft = new SidebarResizer("left");
    this.sidebarResizerRight = new SidebarResizer("right");
    this.sidebarResizerBottom = new SidebarResizer("bottom");
    this.sidebarResizerTopLeft = new SidebarResizer("topleft");
    this.sidebarResizerTopRight = new SidebarResizer("topright");
    this.sidebarResizerBottomLeft = new SidebarResizer("bottomleft");
    this.sidebarResizerBottomRight = new SidebarResizer("bottomright");
    this.sidebarSplitter = new SidebarSplitter();
    this.afterSplitter = new AfterSplitter();
    this.geometryHint = new GeometryHint();

    const browser = new XULElement({
      element: document.getElementById("browser"),
    });
    browser.appendChildren(
      this.sidebarWrapper.appendChildren(
        this.sidebarMain,
        this.sidebarBoxArea.appendChildren(
          this.sidebarBox.appendChildren(
            this.sidebarToolbar,
            this.webPanelsBrowser,
            this.geometryHint,
            this.sidebarResizerTop,
            this.sidebarResizerLeft,
            this.sidebarResizerRight,
            this.sidebarResizerBottom,
            this.sidebarResizerTopLeft,
            this.sidebarResizerTopRight,
            this.sidebarResizerBottomLeft,
            this.sidebarResizerBottomRight,
          ),
          this.sidebarSplitter,
          this.afterSplitter,
        ),
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
    this.webPanelTooltip = new WebPanelTooltip();
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
      this.webPanelTooltip,
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
    this.openLinkAsWebPanelMenuItem = new OpenLinkAsWebPanelMenuItem();
    this.openLinkAsTempWebPanelMenuItem = new OpenLinkAsTempWebPanelMenuItem();
    this.searchInWebPanelMenuItem = new SearchInWebPanelMenuItem();

    const contentAreaContextMenu = new XULElement({
      element: document.getElementById("contentAreaContextMenu"),
    });
    const separator = new XULElement({
      element: document.getElementById("context-sep-open"),
    });
    const contextSearchSelect = new XULElement({
      element: document.getElementById("context-searchselect"),
    });

    contentAreaContextMenu.insertBefore(
      this.openLinkAsWebPanelMenuItem,
      separator,
    );
    contentAreaContextMenu.insertBefore(
      this.openLinkAsTempWebPanelMenuItem,
      separator,
    );
    contentAreaContextMenu.insertAfter(
      this.searchInWebPanelMenuItem,
      contextSearchSelect,
    );
  }
}
