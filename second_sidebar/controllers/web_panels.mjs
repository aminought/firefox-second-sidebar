import { SidebarController } from "./sidebar.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelButtons } from "../xul/web_panel_buttons.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelTabs } from "../xul/web_panel_tabs.mjs";
import { WebPanels } from "../xul/web_panels.mjs";

const PREF = "second-sidebar.web-panels";

export class WebPanelsController {
  /**
   *
   * @param {WebPanels} webPanels
   * @param {WebPanelButtons} webPanelButtons
   * @param {WebPanelTabs} webPanelTabs
   */
  constructor(webPanels, webPanelButtons, webPanelTabs) {
    this.webPanels = webPanels;
    this.webPanelButtons = webPanelButtons;
    this.webPanelTabs = webPanelTabs;

    /**@type {Array<WebPanelController>} */
    this.webPanelControllers = [];

    /**@type {Object<string, WebPanelController>} */
    this.webPanelControllersMap = {};
  }

  /**
   *
   * @param {SidebarController} sidebarController
   * @param {WebPanelEditController} webPanelEditController
   */
  setupDependencies(sidebarController, webPanelEditController) {
    this.sidebarController = sidebarController;
    this.webPanelEditController = webPanelEditController;
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  add(webPanelController) {
    this.webPanelControllers.push(webPanelController);
    this.webPanelControllersMap[webPanelController.getUUID()] =
      webPanelController;
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanelController?}
   */
  get(uuid) {
    return this.webPanelControllersMap[uuid] ?? null;
  }

  /**
   *
   * @returns {WebPanelController?}
   */
  getActive() {
    return (
      Object.values(this.webPanelControllers).find((webPanelController) =>
        webPanelController.webPanel.isActive()
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
   * @returns {boolean}
   */
  injectWebPanelButton(webPanelButton) {
    if (this.webPanelButtons.contains(webPanelButton)) {
      return false;
    }
    this.webPanelButtons.appendChild(webPanelButton);
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
   * @returns {boolean}
   */
  getIndex(uuid) {
    return this.webPanelControllers.findIndex(
      (webPanelController) => webPanelController.getUUID() === uuid
    );
  }

  /**
   *
   * @param {string} uuid
   */
  delete(uuid) {
    const index = this.getIndex(uuid);
    if (index !== -1) {
      this.webPanelControllers.splice(index, 1);
      delete this.webPanelControllersMap[uuid];
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
    return this.getIndex(uuid) === this.webPanelControllers.length - 1;
  }

  /**
   *
   * @param {string} uuid
   */
  moveUp(uuid) {
    const index = this.getIndex(uuid);
    if (index !== -1) {
      const [webPanelController] = this.webPanelControllers.splice(index, 1);
      this.webPanelControllers.splice(index - 1, 0, webPanelController);

      this.webPanelButtons.element.insertBefore(
        webPanelController.webPanelButton.element,
        webPanelController.webPanelButton.element.previousSibling
      );
    }
  }

  /**
   *
   * @param {string} uuid
   */
  moveDown(uuid) {
    const index = this.getIndex(uuid);
    if (index !== -1) {
      const [webPanelController] = this.webPanelControllers.splice(index, 1);
      this.webPanelControllers.splice(index + 1, 0, webPanelController);

      this.webPanelButtons.element.insertBefore(
        webPanelController.webPanelButton.element.nextSibling,
        webPanelController.webPanelButton.element
      );
    }

    return this;
  }

  /**
   *
   * @param {string} url
   * @returns {WebPanelTab}
   */
  makeWebPanelTab(url) {
    return new WebPanelTab(url);
  }

  /**
   *
   * @param {object} params
   * @param {string} params.uuid
   * @param {string} params.url
   * @param {string} params.faviconURL
   * @param {boolean} params.pinned
   * @param {string} params.width
   * @param {boolean} params.loadOnStartup
   * @param {boolean} params.unloadOnClose
   * @param {HTMLElement?} params.browserXUL
   * @returns {WebPanel}
   */
  makeWebPanel({
    uuid,
    url,
    faviconURL,
    pinned = false,
    width = "400",
    loadOnStartup = false,
    unloadOnClose = false,
    browserXUL,
  }) {
    return new WebPanel(
      uuid,
      url,
      faviconURL,
      pinned,
      width,
      loadOnStartup,
      unloadOnClose,
      { element: browserXUL }
    );
  }

  /**
   *
   * @param {object} webPanelPref
   * @param {object} params
   * @param {HTMLElement} params.browserXUL
   * @returns {WebPanel}
   */
  #makeWebPanelFromPref(webPanelPref, { browserXUL } = {}) {
    return this.makeWebPanel({
      uuid: webPanelPref.uuid ?? crypto.randomUUID(),
      url: webPanelPref.url,
      faviconURL: webPanelPref.faviconURL,
      pinned: webPanelPref.pinned ?? true,
      width: webPanelPref.width ?? "400",
      loadOnStartup: webPanelPref.loadOnStartup ?? false,
      unloadOnClose: webPanelPref.unloadOnClose ?? false,
      browserXUL,
    }).hide();
  }

  /**
   *
   * @param {WebPanel} webPanel
   * @returns {WebPanelButton}
   */
  makeWebPanelButton(webPanel) {
    return new WebPanelButton(webPanel.uuid)
      .setIcon(webPanel.faviconURL)
      .setUnloaded(!webPanel.loadOnStartup);
  }

  /**
   *
   * @param {WebPanel} webPanel
   * @param {WebPanelButton} webPanelButton
   * @param {WebPanelTab} webPanelTab
   * @returns {WebPanelController}
   */
  #makeWebPanelController(webPanel, webPanelButton, webPanelTab) {
    const webPanelController = new WebPanelController(
      webPanel,
      webPanelButton,
      webPanelTab
    );
    webPanelController.setupDependencies(
      this,
      this.sidebarController,
      this.webPanelEditController
    );
    return webPanelController;
  }

  load() {
    const prefs = JSON.parse(Services.prefs.getStringPref(PREF));
    for (const webPanelPref of prefs) {
      const webPanelTab = this.makeWebPanelTab(webPanelPref.url);
      const webPanel = this.#makeWebPanelFromPref(webPanelPref, {
        browserXUL: webPanelTab.getBrowserXUL(),
      });
      const webPanelButton = this.makeWebPanelButton(webPanel);

      const webPanelController = this.#makeWebPanelController(
        webPanel,
        webPanelButton,
        webPanelTab
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

  save() {
    const prefs = [];
    for (const webPanelController of this.webPanelControllers) {
      const webPanel = webPanelController.webPanel;
      prefs.push({
        uuid: webPanel.uuid,
        url: webPanel.url,
        faviconURL: webPanel.faviconURL,
        pinned: webPanel.pinned,
        width: webPanel.width,
        loadOnStartup: webPanel.loadOnStartup,
        unloadOnClose: webPanel.unloadOnClose,
      });
    }
    console.log("Saving prefs: ", prefs);
    Services.prefs.setStringPref(PREF, JSON.stringify(prefs));
  }
}
