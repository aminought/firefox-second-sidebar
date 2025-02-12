import { ContextItemController } from "./controllers/context_item.mjs";
import { SidebarController } from "./controllers/sidebar.mjs";
import { SidebarElements } from "./sidebar_elements.mjs";
import { SidebarMainController } from "./controllers/sidebar_main.mjs";
import { SidebarMainSettingsController } from "./controllers/sidebar_main_settings.mjs";
import { SidebarSplittersController } from "./controllers/sidebar_splitters.mjs";
import { WebPanelDeleteController } from "./controllers/web_panel_delete.mjs";
import { WebPanelEditController } from "./controllers/web_panel_edit.mjs";
import { WebPanelMoreController } from "./controllers/web_panel_more.mjs";
import { WebPanelNewController } from "./controllers/web_panel_new.mjs";
import { WebPanelsController } from "./controllers/web_panels.mjs";

export class SidebarControllers {
  static create() {
    this.sidebarMainController = new SidebarMainController(
      SidebarElements.sidebarMain,
      SidebarElements.sidebarMainMenuPopup,
    );

    this.sidebarMainSettingsController = new SidebarMainSettingsController(
      SidebarElements.sidebarMainPopupSettings,
    );

    this.sidebarController = new SidebarController(
      SidebarElements.sidebarBox,
      SidebarElements.sidebar,
      SidebarElements.sidebarToolbar,
      SidebarElements.sidebarSplitterUnpinned,
      SidebarElements.webPanelPopupEdit,
      SidebarElements.sidebarMainPopupSettings,
    );

    this.sidebarSplittersController = new SidebarSplittersController(
      SidebarElements.sidebarSplitterUnpinned,
      SidebarElements.sidebarSplitterPinned,
    );

    this.webPanelsController = new WebPanelsController(
      SidebarElements.webPanels,
      SidebarElements.sidebarMain,
      SidebarElements.webPanelTabs,
      SidebarElements.webPanelMenuPopup,
    );

    this.webPanelNewController = new WebPanelNewController(
      SidebarElements.webPanelNewButton,
      SidebarElements.webPanelPopupNew,
    );

    this.webPanelEditController = new WebPanelEditController(
      SidebarElements.webPanelPopupEdit,
    );

    this.webPanelMoreController = new WebPanelMoreController(
      SidebarElements.webPanelPopupMore,
    );

    this.webPanelDeleteController = new WebPanelDeleteController(
      SidebarElements.webPanelPopupDelete,
    );

    this.contextItemController = new ContextItemController();
  }
}
