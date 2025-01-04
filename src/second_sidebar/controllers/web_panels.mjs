/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { SidebarMain } from "../xul/sidebar_main.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButtonMenuPopup } from "../xul/web_panel_button_menupopup.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelDeleteController } from "./web_panel_delete.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelTabs } from "../xul/web_panel_tabs.mjs";
import { WebPanels } from "../xul/web_panels.mjs";
import { WebPanelsSettings } from "../settings/web_panels_settings.mjs";
/* eslint-enable no-unused-vars */

export class WebPanelsController {
  /**
   *
   * @param {WebPanels} webPanels
   * @param {SidebarMain} sidebarMain
   * @param {WebPanelTabs} webPanelTabs
   * @param {WebPanelButtonMenuPopup} webPanelButtonMenuPopup
   */
  constructor(webPanels, sidebarMain, webPanelTabs, webPanelButtonMenuPopup) {
    this.webPanels = webPanels;
    this.sidebarMain = sidebarMain;
    this.webPanelTabs = webPanelTabs;
    this.webPanelButtonMenuPopup = webPanelButtonMenuPopup;

    /**@type {Object<string, WebPanelController>} */
    this.webPanelControllers = {};

    this.#setupListeners();
  }

  /**
   *
   * @param {SidebarController} sidebarController
   * @param {WebPanelEditController} webPanelEditController
   * @param {WebPanelDeleteController} webPanelDeleteController
   */
  setupDependencies(
    sidebarController,
    webPanelEditController,
    webPanelDeleteController,
  ) {
    this.sidebarController = sidebarController;
    this.webPanelEditController = webPanelEditController;
    this.webPanelDeleteController = webPanelDeleteController;
  }

  #setupListeners() {
    this.webPanelButtonMenuPopup.setWebPanelsController(this);

    this.webPanelButtonMenuPopup.listenUnloadItemClick((webPanelController) => {
      webPanelController.unload();
    });

    this.webPanelButtonMenuPopup.listenEditItemClick((webPanelController) => {
      this.webPanelEditController.openPopup(webPanelController);
    });

    this.webPanelButtonMenuPopup.listenDeleteItemClick((webPanelController) => {
      this.webPanelDeleteController.openPopup(webPanelController);
    });

    this.webPanelButtonMenuPopup.listenCustomizeItemClick(() => {
      gCustomizeMode.enter();
    });
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  add(webPanelController) {
    this.webPanelControllers[webPanelController.getUUID()] = webPanelController;
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanelController?}
   */
  get(uuid) {
    return this.webPanelControllers[uuid] ?? null;
  }

  /**
   *
   * @returns {WebPanelController?}
   */
  getActive() {
    return (
      Object.values(this.webPanelControllers).find((webPanelController) =>
        webPanelController.webPanel.isActive(),
      ) ?? null
    );
  }

  /**
   *
   * @param {WebPanel} webPanel
   * @returns {boolean}
   */
  injectWebPanel(webPanel) {
    if (this.webPanels.contains(webPanel)) {
      return false;
    }
    this.webPanels.appendChild(webPanel);
    return true;
  }

  /**
   *
   * @param {WebPanelTab} webPanelTab
   * @returns {boolean}
   */
  injectWebPanelTab(webPanelTab) {
    if (this.webPanelTabs.contains(webPanelTab)) {
      return false;
    }
    this.webPanelTabs.appendChild(webPanelTab);
    return true;
  }

  hideActive() {
    const webPanelController = this.getActive();
    if (webPanelController !== null) {
      webPanelController.hide();
    }
  }

  /**
   *
   * @param {string} uuid
   */
  delete(uuid) {
    delete this.webPanelControllers[uuid];
  }

  /**
   *
   * @param {WebPanelsSettings} webPanelsSettings
   */
  loadSettings(webPanelsSettings) {
    console.log("Loading web panels");
    for (const webPanelSettings of webPanelsSettings.webPanels) {
      const webPanelController =
        WebPanelController.fromSettings(webPanelSettings);
      webPanelController.setupDependencies(this, this.sidebarController);

      if (webPanelSettings.loadOnStartup) {
        this.injectWebPanelTab(webPanelController.webPanelTab);
        this.injectWebPanel(webPanelController.webPanel);
        webPanelController.initWebPanel();
      }
      webPanelController.initWebPanelButton();

      this.add(webPanelController);
    }

    console.log("Registering area sb2-main");
    const uuids = Object.keys(this.webPanelControllers);
    CustomizableUI.registerArea("sb2-main", {
      type: window.CustomizableUI.TYPE_TOOLBAR,
      defaultCollapsed: false,
      overflowable: false,
      defaultPlacements: uuids.concat(["new-web-panel"]),
    });

    console.log("Registering toolbar node sb2-main");
    CustomizableUI.registerToolbarNode(document.getElementById("sb2-main"));
  }

  /**
   *
   * @returns {WebPanelsSettings}
   */
  dumpSettings() {
    return new WebPanelsSettings(
      Object.values(this.webPanelControllers).map((webPanelController) =>
        webPanelController.dumpSettings(),
      ),
    );
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
