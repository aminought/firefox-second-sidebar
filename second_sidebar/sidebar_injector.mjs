import { ContextItemController } from "./controllers/context_item.mjs";
import { Settings } from "./settings.mjs";
import { Sidebar } from "./xul/sidebar.mjs";
import { SidebarBox } from "./xul/sidebar_box.mjs";
import { SidebarBoxFiller } from "./xul/sidebar_box_filler.mjs";
import { SidebarController } from "./controllers/sidebar.mjs";
import { SidebarMain } from "./xul/sidebar_main.mjs";
import { SidebarMainController } from "./controllers/sidebar_main.mjs";
import { SidebarMainMenuPopup } from "./xul/sidebar_main_menupopup.mjs";
import { SidebarMainPopupSettings } from "./xul/sidebar_main_popup_settings.mjs";
import { SidebarMainSettingsController } from "./controllers/sidebar_main_settings.mjs";
import { SidebarSplitterPinned } from "./xul/sidebar_splitter_pinned.mjs";
import { SidebarSplitterUnpinned } from "./xul/sidebar_splitter_unpinned.mjs";
import { SidebarSplittersController } from "./controllers/sidebar_splitters.mjs";
import { SidebarToolbar } from "./xul/sidebar_toolbar.mjs";
import { WebPanelButtons } from "./xul/web_panel_buttons.mjs";
import { WebPanelEditController } from "./controllers/web_panel_edit.mjs";
import { WebPanelNewButton } from "./xul/web_panel_new_button.mjs";
import { WebPanelNewController } from "./controllers/web_panel_new.mjs";
import { WebPanelPopupEdit } from "./xul/web_panel_popup_edit.mjs";
import { WebPanelPopupNew } from "./xul/web_panel_popup_new.mjs";
import { WebPanelTabs } from "./xul/web_panel_tabs.mjs";
import { WebPanels } from "./xul/web_panels.mjs";
import { WebPanelsController } from "./controllers/web_panels.mjs";
import { XULElement } from "./xul/base/xul_element.mjs";

export class SidebarInjector {
  static inject() {
    const elements = this.#createElements();
    this.#injectElements(elements);
    this.#buildControllers(elements);
    this.#setupDependencies();
    this.#loadPrefs();
    this.contextItemController.injectContextItem();
  }

  /**
   *
   * @returns {object<string, XULElement>}
   */
  static #createElements() {
    return {
      sidebarMain: new SidebarMain(),
      webPanelTabs: new WebPanelTabs(),
      webPanelButtons: new WebPanelButtons(),
      webPanelNewButton: new WebPanelNewButton(),
      webPanelPopupNew: new WebPanelPopupNew(),
      webPanelPopupEdit: new WebPanelPopupEdit(),
      sidebarBox: new SidebarBox(),
      sidebar: new Sidebar(),
      sidebarToolbar: new SidebarToolbar(),
      webPanels: new WebPanels(),
      sidebarSplitterPinned: new SidebarSplitterPinned(),
      sidebarSplitterUnpinned: new SidebarSplitterUnpinned(),
      sidebarBoxFiller: new SidebarBoxFiller(),
      sidebarMainPopupSettings: new SidebarMainPopupSettings(),
      sidebarMainMenuPopup: new SidebarMainMenuPopup(),
    };
  }

  /**
   *
   * @param {Object<string, XULElement>} elements
   */
  static #injectElements(elements) {
    elements.sidebarMain.appendChildren(
      elements.webPanelButtons,
      elements.webPanelNewButton
    );
    elements.sidebar.appendChildren(
      elements.sidebarToolbar,
      elements.webPanels
    );
    elements.sidebarBox.appendChildren(
      elements.sidebarBoxFiller,
      elements.sidebarSplitterUnpinned,
      elements.sidebar
    );

    const browser = new XULElement(null, {
      element: document.querySelector("#browser"),
    });
    browser.appendChildren(
      elements.sidebarSplitterPinned,
      elements.sidebarBox,
      elements.sidebarMain
    );

    const mainPopupSet = new XULElement(null, {
      element: document.querySelector("#mainPopupSet"),
    });
    mainPopupSet.appendChildren(
      elements.webPanelPopupNew,
      elements.webPanelPopupEdit,
      elements.sidebarMainMenuPopup,
      elements.sidebarMainPopupSettings
    );

    const body = new XULElement(null, { element: document.body });
    body.appendChild(elements.webPanelTabs);
  }

  /**
   *
   * @param {Object<string, XULElement>} elements
   */
  static #buildControllers(elements) {
    this.sidebarMainController = new SidebarMainController(
      elements.sidebarMain,
      elements.sidebarMainMenuPopup
    );
    this.sidebarMainSettingsController = new SidebarMainSettingsController(
      elements.sidebarMainPopupSettings
    );
    this.sidebarController = new SidebarController(
      elements.sidebarBox,
      elements.sidebar,
      elements.sidebarToolbar,
      elements.sidebarSplitterUnpinned
    );
    this.sidebarSplittersController = new SidebarSplittersController(
      elements.sidebarSplitterUnpinned,
      elements.sidebarSplitterPinned
    );
    this.webPanelsController = new WebPanelsController(
      elements.webPanels,
      elements.webPanelButtons,
      elements.webPanelTabs
    );
    this.webPanelNewController = new WebPanelNewController(
      elements.webPanelNewButton,
      elements.webPanelPopupNew
    );
    this.webPanelEditController = new WebPanelEditController(
      elements.webPanelPopupEdit
    );
    this.contextItemController = new ContextItemController();
  }

  static #setupDependencies() {
    this.sidebarMainController.setupDependencies(
      this.sidebarMainSettingsController
    );
    this.sidebarMainSettingsController.setupDependencies(
      this.sidebarController
    );
    this.sidebarController.setupDepenedencies(this.webPanelsController);
    this.sidebarSplittersController.setupDependencies(
      this.sidebarController,
      this.webPanelsController
    );
    this.webPanelsController.setupDependencies(
      this.sidebarController,
      this.webPanelEditController
    );
    this.webPanelNewController.setupDependencies(
      this.sidebarController,
      this.webPanelsController,
      this.webPanelEditController
    );
    this.webPanelEditController.setupDependencies(
      this.webPanelsController,
      this.sidebarController
    );
    this.contextItemController.setupDependencies(this.webPanelNewController);
  }

  static #loadPrefs() {
    this.webPanelsController.loadPref(Settings.loadWebPanelsPref());
    this.sidebarController.loadPref(Settings.loadSidebarSettingsPref());
  }
}
