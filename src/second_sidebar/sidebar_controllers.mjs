import { CollapseController } from "./controllers/collapse.mjs";
import { ContextMenuItemsController } from "./controllers/context_menu_items.mjs";
import { SidebarController } from "./controllers/sidebar.mjs";
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
    this.sidebarMainController = new SidebarMainController();
    this.sidebarMainSettingsController = new SidebarMainSettingsController();
    this.sidebarController = new SidebarController();
    this.sidebarSplittersController = new SidebarSplittersController();
    this.webPanelsController = new WebPanelsController();
    this.webPanelNewController = new WebPanelNewController();
    this.webPanelEditController = new WebPanelEditController();
    this.webPanelMoreController = new WebPanelMoreController();
    this.webPanelDeleteController = new WebPanelDeleteController();
    this.contextMenuItemsController = new ContextMenuItemsController();
    this.collapseController = new CollapseController();
  }
}
