import { ContextMenuItemsController } from "./controllers/context_menu_items.mjs";
import { Shortcuts } from "./controllers/shortcuts.mjs";
import { SidebarController } from "./controllers/sidebar.mjs";
import { SidebarGeometry } from "./controllers/sidebar_geometry.mjs";
import { SidebarMainCollapser } from "./controllers/sidebar_main_collapser.mjs";
import { SidebarMainController } from "./controllers/sidebar_main.mjs";
import { SidebarMainSettingsController } from "./controllers/sidebar_main_settings.mjs";
import { SidebarMover } from "./controllers/sidebar_mover.mjs";
import { SidebarResizer } from "./controllers/sidebar_resizer.mjs";
import { SidebarSplitterController } from "./controllers/sidebar_splitter.mjs";
import { SidebarToolbarCollapser } from "./controllers/sidebar_toolbar_collapser.mjs";
import { WebPanelDeleteController } from "./controllers/web_panel_delete.mjs";
import { WebPanelEditController } from "./controllers/web_panel_edit.mjs";
import { WebPanelMoreController } from "./controllers/web_panel_more.mjs";
import { WebPanelNewController } from "./controllers/web_panel_new.mjs";
import { WebPanelTooltipController } from "./controllers/web_panel_tooltip.mjs";
import { WebPanelsController } from "./controllers/web_panels.mjs";

export class SidebarControllers {
  static create() {
    this.sidebarMainController = new SidebarMainController();
    this.sidebarMainCollapser = new SidebarMainCollapser();
    this.sidebarMainSettingsController = new SidebarMainSettingsController();
    this.sidebarController = new SidebarController();
    this.sidebarGeometry = new SidebarGeometry();
    this.sidebarToolbarCollapser = new SidebarToolbarCollapser();
    this.sidebarMover = new SidebarMover();
    this.sidebarResizer = new SidebarResizer();
    this.sidebarSplitterController = new SidebarSplitterController();
    this.webPanelTooltipController = new WebPanelTooltipController();
    this.webPanelsController = new WebPanelsController();
    this.webPanelsShortcuts = new Shortcuts();
    this.webPanelNewController = new WebPanelNewController();
    this.webPanelEditController = new WebPanelEditController();
    this.webPanelMoreController = new WebPanelMoreController();
    this.webPanelDeleteController = new WebPanelDeleteController();
    this.contextMenuItemsController = new ContextMenuItemsController();
  }
}
