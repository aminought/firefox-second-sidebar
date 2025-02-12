import { ContextItemController } from "./controllers/context_item.mjs";
import { CustomizableUIWrapper } from "./wrappers/customizable_ui.mjs";
import { Sidebar } from "./xul/sidebar.mjs";
import { SidebarBox } from "./xul/sidebar_box.mjs";
import { SidebarBoxFiller } from "./xul/sidebar_box_filler.mjs";
import { SidebarController } from "./controllers/sidebar.mjs";
import { SidebarMain } from "./xul/sidebar_main.mjs";
import { SidebarMainController } from "./controllers/sidebar_main.mjs";
import { SidebarMainMenuPopup } from "./xul/sidebar_main_menupopup.mjs";
import { SidebarMainPopupSettings } from "./xul/sidebar_main_popup_settings.mjs";
import { SidebarMainSettingsController } from "./controllers/sidebar_main_settings.mjs";
import { SidebarSettings } from "./settings/sidebar_settings.mjs";
import { SidebarSplitterPinned } from "./xul/sidebar_splitter_pinned.mjs";
import { SidebarSplitterUnpinned } from "./xul/sidebar_splitter_unpinned.mjs";
import { SidebarSplittersController } from "./controllers/sidebar_splitters.mjs";
import { SidebarToolbar } from "./xul/sidebar_toolbar.mjs";
import { WebPanelDeleteController } from "./controllers/web_panel_delete.mjs";
import { WebPanelEditController } from "./controllers/web_panel_edit.mjs";
import { WebPanelMenuPopup } from "./xul/web_panel_menupopup.mjs";
import { WebPanelMoreController } from "./controllers/web_panel_more.mjs";
import { WebPanelNewButton } from "./xul/web_panel_new_button.mjs";
import { WebPanelNewController } from "./controllers/web_panel_new.mjs";
import { WebPanelPopupDelete } from "./xul/web_panel_popup_delete.mjs";
import { WebPanelPopupEdit } from "./xul/web_panel_popup_edit.mjs";
import { WebPanelPopupMore } from "./xul/web_panel_popup_more.mjs";
import { WebPanelPopupNew } from "./xul/web_panel_popup_new.mjs";
import { WebPanelTabs } from "./xul/web_panel_tabs.mjs";
import { WebPanels } from "./xul/web_panels.mjs";
import { WebPanelsController } from "./controllers/web_panels.mjs";
import { WebPanelsSettings } from "./settings/web_panels_settings.mjs";
import { XULElement } from "./xul/base/xul_element.mjs";
import { gNavToolboxWrapper } from "./wrappers/g_nav_toolbox.mjs";

export class SidebarInjector {
  /**
   *
   * @returns {boolean}
   */
  static inject() {
    this.sidebarSettings = SidebarSettings.load();
    if (this.#isPopupWindow() && this.sidebarSettings.hideInPopupWindows) {
      return false;
    }

    this.webPanelsSettings = WebPanelsSettings.load();

    console.log("Sidebar creation...");

    this.sidebarMain = new SidebarMain();
    this.sidebarBox = new SidebarBox();
    this.sidebarBoxFiller = new SidebarBoxFiller();
    this.sidebarSplitterPinned = new SidebarSplitterPinned();
    this.sidebarSplitterUnpinned = new SidebarSplitterUnpinned();
    this.sidebar = new Sidebar();
    this.sidebarToolbar = new SidebarToolbar();

    this.sidebarBox.appendChildren(
      this.sidebarBoxFiller,
      this.sidebarSplitterUnpinned,
      this.sidebar,
    );

    const browser = new XULElement({
      element: document.getElementById("browser"),
    });
    browser.appendChildren(
      this.sidebarSplitterPinned,
      this.sidebarBox,
      this.sidebarMain,
    );

    console.log("Registering area sb2-main");
    CustomizableUIWrapper.registerArea(this.sidebarMain.id, {
      defaultPlacements: ["new-web-panel"],
    });

    console.log("Registering toolbar node sb2-main");
    CustomizableUIWrapper.registerToolbarNode(
      document.getElementById(this.sidebarMain.id),
    );

    console.log("Elements creation...");
    const elements = this.#createElements();
    console.log("Elements injection...");
    this.#injectElements(elements);
    console.log("Building controllers...");
    this.#buildControllers(elements);
    console.log("Setup dependencies...");
    this.#setupDependencies();

    gNavToolboxWrapper.addEventListener("customizationready", () => {
      browser.hidden = false;
    });
    gNavToolboxWrapper.addEventListener("aftercustomization", () => {
      const springs = document.querySelectorAll("#sb2-main toolbarspring");
      for (const spring of springs) {
        spring.removeAttribute("context");
      }
    });

    this.#applySettings();
    this.contextItemController.injectContextItem();

    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  static #isPopupWindow() {
    const mainWindow = new XULElement({ id: "main-window", exists: true });
    return (
      mainWindow.hasAttribute("chromehidden") &&
      mainWindow.getAttribute("chromehidden").includes("extrachrome")
    );
  }

  /**
   *
   * @returns {object<string, XULElement>}
   */
  static #createElements() {
    return {
      root: new XULElement({ element: document.documentElement }),
      webPanelNewButton: new WebPanelNewButton(),
      webPanelTabs: new WebPanelTabs(),
      webPanelMenuPopup: new WebPanelMenuPopup(),
      webPanelPopupNew: new WebPanelPopupNew(),
      webPanelPopupEdit: new WebPanelPopupEdit(),
      webPanelPopupMore: new WebPanelPopupMore(),
      webPanelPopupDelete: new WebPanelPopupDelete(),
      webPanels: new WebPanels(),
      sidebarMainPopupSettings: new SidebarMainPopupSettings(),
      sidebarMainMenuPopup: new SidebarMainMenuPopup(),
    };
  }

  /**
   *
   * @param {Object<string, XULElement>} elements
   */
  static #injectElements(elements) {
    this.sidebarToolbar.moreButton.appendChild(elements.webPanelPopupMore);
    this.sidebar.appendChildren(this.sidebarToolbar, elements.webPanels);

    const mainPopupSet = new XULElement({
      element: document.getElementById("mainPopupSet"),
    });
    mainPopupSet.appendChildren(
      elements.webPanelMenuPopup,
      elements.webPanelPopupNew,
      elements.webPanelPopupEdit,
      elements.webPanelPopupDelete,
      elements.sidebarMainMenuPopup,
      elements.sidebarMainPopupSettings,
    );

    const body = new XULElement({ element: document.body });
    body.appendChild(elements.webPanelTabs);
  }

  /**
   *
   * @param {Object<string, XULElement>} elements
   */
  static #buildControllers(elements) {
    this.sidebarMainController = new SidebarMainController(
      this.sidebarMain,
      elements.sidebarMainMenuPopup,
      elements.root,
    );
    this.sidebarMainSettingsController = new SidebarMainSettingsController(
      elements.sidebarMainPopupSettings,
    );
    this.sidebarController = new SidebarController(
      this.sidebarBox,
      this.sidebar,
      this.sidebarToolbar,
      this.sidebarSplitterUnpinned,
      elements.webPanelPopupEdit,
      elements.sidebarMainPopupSettings,
      elements.root,
    );
    this.sidebarSplittersController = new SidebarSplittersController(
      this.sidebarSplitterUnpinned,
      this.sidebarSplitterPinned,
    );
    this.webPanelsController = new WebPanelsController(
      elements.webPanels,
      this.sidebarMain,
      elements.webPanelTabs,
      elements.webPanelMenuPopup,
    );
    this.webPanelNewController = new WebPanelNewController(
      elements.webPanelNewButton,
      elements.webPanelPopupNew,
    );
    this.webPanelEditController = new WebPanelEditController(
      elements.webPanelPopupEdit,
    );
    this.webPanelMoreController = new WebPanelMoreController(
      elements.webPanelPopupMore,
    );
    this.webPanelDeleteController = new WebPanelDeleteController(
      elements.webPanelPopupDelete,
    );
    this.contextItemController = new ContextItemController();
  }

  static #setupDependencies() {
    this.sidebarMainController.setupDependencies(
      this.sidebarMainSettingsController,
      this.sidebarController,
    );
    this.sidebarMainSettingsController.setupDependencies(
      this.sidebarMainController,
      this.sidebarController,
      this.webPanelNewController,
    );
    this.sidebarController.setupDepenedencies(
      this.sidebarMainController,
      this.webPanelsController,
      this.webPanelNewController,
    );
    this.sidebarSplittersController.setupDependencies(
      this.sidebarController,
      this.webPanelsController,
    );
    this.webPanelsController.setupDependencies(
      this.sidebarController,
      this.webPanelEditController,
      this.webPanelDeleteController,
    );
    this.webPanelNewController.setupDependencies(
      this.sidebarController,
      this.webPanelsController,
      this.webPanelEditController,
    );
    this.webPanelEditController.setupDependencies(
      this.webPanelsController,
      this.sidebarController,
    );
    this.webPanelMoreController.setupDependencies(
      this.webPanelsController,
      this.sidebarController,
    );
    this.webPanelDeleteController.setupDependencies(
      this.webPanelsController,
      this.sidebarController,
    );
    this.contextItemController.setupDependencies(this.webPanelNewController);
  }

  static #applySettings() {
    this.sidebarController.loadSettings(this.sidebarSettings);
    this.webPanelsController.loadSettings(this.webPanelsSettings);
  }
}
