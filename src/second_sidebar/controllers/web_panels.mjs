/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelButtonMenuPopup } from "../xul/web_panel_button_menupopup.mjs";
import { WebPanelButtons } from "../xul/web_panel_buttons.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelDeleteController } from "./web_panel_delete.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelTabs } from "../xul/web_panel_tabs.mjs";
import { WebPanels } from "../xul/web_panels.mjs";
import { WebPanelsSettings } from "../settings/web_panels_settings.mjs";
/* eslint-enable no-unused-vars */

export class WebPanelsController {
  /**
   *
   * @param {WebPanels} webPanels
   * @param {WebPanelButtons} webPanelButtons
   * @param {WebPanelTabs} webPanelTabs
   * @param {WebPanelButtonMenuPopup} webPanelButtonMenuPopup
   */
  constructor(
    webPanels,
    webPanelButtons,
    webPanelTabs,
    webPanelButtonMenuPopup,
  ) {
    this.webPanels = webPanels;
    this.webPanelButtons = webPanelButtons;
    this.webPanelButtonsXUL = webPanelButtons.getXUL();
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
    this.webPanelButtonMenuPopup.listenUnloadItemClick((webPanelController) => {
      webPanelController.unload();
    });

    this.webPanelButtonMenuPopup.listenEditItemClick((webPanelController) => {
      this.webPanelEditController.openPopup(webPanelController);
    });

    this.webPanelButtonMenuPopup.listenDeleteItemClick((webPanelController) => {
      this.webPanelDeleteController.openPopup(webPanelController);
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
   * @param {WebPanelButton} webPanelButton
   * @param {string?} position
   * @returns {boolean}
   */
  injectWebPanelButton(webPanelButton, position = "end") {
    if (this.webPanelButtons.contains(webPanelButton)) {
      return false;
    }
    if (position === "start") {
      this.webPanelButtons.prependChild(webPanelButton);
    } else if (position === "end") {
      this.webPanelButtons.appendChild(webPanelButton);
    }
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
   * @returns {number}
   */
  getIndex(uuid) {
    return this.webPanelButtons.indexByUUID(uuid);
  }

  /**
   *
   * @param {string} uuid
   */
  delete(uuid) {
    const index = this.getIndex(uuid);
    if (index !== -1) {
      delete this.webPanelControllers[uuid];
    }
  }

  /**
   *
   * @param {string} uuid
   * @returns {boolean}
   */
  isFirst(uuid) {
    return this.getIndex(uuid) === 0;
  }

  /**
   *
   * @param {string} uuid
   * @returns {boolean}
   */
  isLast(uuid) {
    return (
      this.getIndex(uuid) === Object.values(this.webPanelControllers).length - 1
    );
  }

  /**
   *
   * @param {string} uuid
   * @param {HTMLElement} child
   */
  moveBefore(uuid, child) {
    const webPanelController = this.get(uuid);
    this.webPanelButtons.element.insertBefore(
      webPanelController.webPanelButton.element,
      child,
    );
  }

  /**
   *
   * @param {string} uuid
   */
  moveUp(uuid) {
    const webPanelController = this.get(uuid);
    const webPanelButtonXUL = webPanelController.webPanelButton.getXUL();
    if (webPanelButtonXUL.previousSibling) {
      this.webPanelButtonsXUL.insertBefore(
        webPanelButtonXUL,
        webPanelButtonXUL.previousSibling,
      );
    }
  }

  /**
   *
   * @param {string} uuid
   */
  moveDown(uuid) {
    const webPanelController = this.get(uuid);
    const webPanelButtonXUL = webPanelController.webPanelButton.getXUL();
    if (webPanelButtonXUL.nextSibling) {
      this.webPanelButtonsXUL.insertBefore(
        webPanelButtonXUL.nextSibling,
        webPanelButtonXUL,
      );
    }
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanelTab}
   */
  makeWebPanelTab(uuid) {
    return new WebPanelTab(uuid);
  }

  /**
   *
   * @param {WebPanelTab} webPanelTab
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {object} params
   * @param {boolean} params.pinned
   * @param {string} params.width
   * @param {boolean} params.mobile
   * @param {boolean} params.loadOnStartup
   * @param {boolean} params.unloadOnClose
   * @param {boolean} params.hideToolbar
   * @returns {WebPanel}
   */
  makeWebPanel(
    webPanelTab,
    uuid,
    url,
    faviconURL,
    {
      pinned = false,
      width = "400",
      mobile = false,
      zoom = 1,
      loadOnStartup = false,
      unloadOnClose = false,
      hideToolbar = false,
    } = {},
  ) {
    return new WebPanel(
      webPanelTab,
      uuid,
      url,
      faviconURL,
      pinned,
      width,
      mobile,
      zoom,
      loadOnStartup,
      unloadOnClose,
      hideToolbar,
    );
  }

  /**
   *
   * @param {WebPanelSettings} webPanelSettings
   * @param {WebPanelTab} webPanelTab
   * @returns {WebPanel}
   */
  #makeWebPanelFromPref(webPanelSettings, webPanelTab) {
    return this.makeWebPanel(
      webPanelTab,
      webPanelSettings.uuid,
      webPanelSettings.url,
      webPanelSettings.faviconURL,
      {
        pinned: webPanelSettings.pinned,
        width: webPanelSettings.width,
        mobile: webPanelSettings.mobile,
        zoom: webPanelSettings.zoom,
        loadOnStartup: webPanelSettings.loadOnStartup,
        unloadOnClose: webPanelSettings.unloadOnClose,
        hideToolbar: webPanelSettings.hideToolbar,
        webPanelTab,
      },
    ).hide();
  }

  /**
   *
   * @param {WebPanel} webPanel
   * @returns {WebPanelButton}
   */
  makeWebPanelButton(webPanel) {
    return new WebPanelButton(webPanel.uuid)
      .setIcon(webPanel.faviconURL)
      .setTooltipText(webPanel.url)
      .setUnloaded(!webPanel.loadOnStartup);
  }

  /**
   *
   * @param {WebPanel} webPanel
   * @param {WebPanelButton} webPanelButton
   * @param {WebPanelTab} webPanelTab
   * @returns {WebPanelController}
   */
  makeWebPanelController(webPanel, webPanelButton, webPanelTab) {
    const webPanelController = new WebPanelController(
      webPanel,
      webPanelButton,
      webPanelTab,
      this.webPanelButtonMenuPopup,
    );
    webPanelController.setupDependencies(
      this,
      this.sidebarController,
      this.webPanelEditController,
    );
    return webPanelController;
  }

  /**
   *
   * @param {WebPanelsSettings} webPanelsSettings
   */
  loadSettings(webPanelsSettings) {
    for (const webPanelSettings of webPanelsSettings.webPanels) {
      const webPanelTab = this.makeWebPanelTab(webPanelSettings.uuid);
      const webPanel = this.#makeWebPanelFromPref(
        webPanelSettings,
        webPanelTab,
      );

      const webPanelButton = this.makeWebPanelButton(webPanel);

      const webPanelController = this.makeWebPanelController(
        webPanel,
        webPanelButton,
        webPanelTab,
      );

      if (webPanel.loadOnStartup) {
        this.injectWebPanelTab(webPanelTab);
        this.injectWebPanel(webPanel);
        webPanelController.initWebPanel();
      }

      this.injectWebPanelButton(webPanelButton);
      webPanelController.initWebPanelButton();

      this.add(webPanelController);
    }
  }

  /**
   *
   * @returns {WebPanelsSettings}
   */
  dumpSettings() {
    return new WebPanelsSettings(
      Array.from(this.webPanelButtons.element.children).map((webPanelButton) =>
        this.webPanelControllers[
          webPanelButton.getAttribute("uuid")
        ].dumpSettings(),
      ),
    );
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
