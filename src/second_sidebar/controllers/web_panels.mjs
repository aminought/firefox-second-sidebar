/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { SidebarMain } from "../xul/sidebar_main.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelDeleteController } from "./web_panel_delete.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelEvents } from "./events.mjs";
import { WebPanelMenuPopup } from "../xul/web_panel_menupopup.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelTabs } from "../xul/web_panel_tabs.mjs";
import { WebPanels } from "../xul/web_panels.mjs";
import { WebPanelsSettings } from "../settings/web_panels_settings.mjs";
import { gCustomizeModeWrapper } from "../wrappers/g_customize_mode.mjs";
/* eslint-enable no-unused-vars */

export class WebPanelsController {
  /**
   *
   * @param {WebPanels} webPanels
   * @param {SidebarMain} sidebarMain
   * @param {WebPanelTabs} webPanelTabs
   * @param {WebPanelMenuPopup} webPanelMenuPopup
   */
  constructor(webPanels, sidebarMain, webPanelTabs, webPanelMenuPopup) {
    this.webPanels = webPanels;
    this.sidebarMain = sidebarMain;
    this.webPanelTabs = webPanelTabs;
    this.webPanelMenuPopup = webPanelMenuPopup;

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
    this.webPanelMenuPopup.setWebPanelsController(this);

    this.webPanelMenuPopup.listenUnloadItemClick((webPanelController) => {
      webPanelController.unload();
    });

    this.webPanelMenuPopup.listenEditItemClick((webPanelController) => {
      this.webPanelEditController.openPopup(webPanelController);
    });

    this.webPanelMenuPopup.listenDeleteItemClick((webPanelController) => {
      this.webPanelDeleteController.openPopup(webPanelController);
    });

    this.webPanelMenuPopup.listenCustomizeItemClick(() => {
      gCustomizeModeWrapper.enter();
    });

    window.addEventListener(WebPanelEvents.EDIT_WEB_PANEL_URL, (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const uuid = event.detail.uuid;
      const url = event.detail.url;
      const timeout = event.detail.timeout;

      const webPanelController = this.get(uuid);
      const oldUrl = webPanelController.getURL();
      webPanelController.setURL(url);

      clearTimeout(this.urlTimeout);
      this.urlTimeout = setTimeout(() => {
        if (!webPanelController.isUnloaded() && oldUrl !== url) {
          webPanelController.go(url);
        }
      }, timeout);
    });

    window.addEventListener(
      WebPanelEvents.EDIT_WEB_PANEL_FAVICON_URL,
      (event) => {
        console.log(`Got event ${event.type}:`, event.detail);
        const uuid = event.detail.uuid;
        const faviconURL = event.detail.faviconURL;
        const timeout = event.detail.timeout;

        const webPanelController = this.get(uuid);
        const oldFaviconURL = webPanelController.getFaviconURL();
        webPanelController.setWebPanelFaviconURL(faviconURL);

        clearTimeout(this.faviconURLTimeout);
        this.faviconURLTimeout = setTimeout(() => {
          if (oldFaviconURL !== faviconURL) {
            webPanelController.setWebPanelButtonFaviconURL(faviconURL);
          }
        }, timeout);
      },
    );

    window.addEventListener(WebPanelEvents.EDIT_WEB_PANEL_PINNED, (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const uuid = event.detail.uuid;
      const pinned = event.detail.pinned;

      const webPanelController = this.get(uuid);
      pinned ? webPanelController.pin() : webPanelController.unpin();
      if (webPanelController.isActive()) {
        pinned ? this.sidebarController.pin() : this.sidebarController.unpin();
      }
    });

    window.addEventListener(
      WebPanelEvents.EDIT_WEB_PANEL_USER_CONTEXT_ID,
      (event) => {
        console.log(`Got event ${event.type}:`, event.detail);
        const uuid = event.detail.uuid;
        const userContextId = event.detail.userContextId;

        const webPanelController = this.get(uuid);
        webPanelController.setUserContextId(userContextId);
      },
    );

    window.addEventListener(WebPanelEvents.EDIT_WEB_PANEL_MOBILE, (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const uuid = event.detail.uuid;
      const mobile = event.detail.mobile;

      const webPanelController = this.get(uuid);
      webPanelController.setMobile(mobile);
    });

    window.addEventListener(
      WebPanelEvents.EDIT_WEB_PANEL_LOAD_ON_STARTUP,
      (event) => {
        console.log(`Got event ${event.type}:`, event.detail);
        const uuid = event.detail.uuid;
        const loadOnStartup = event.detail.loadOnStartup;

        const webPanelController = this.get(uuid);
        webPanelController.setLoadOnStartup(loadOnStartup);
      },
    );

    window.addEventListener(
      WebPanelEvents.EDIT_WEB_PANEL_UNLOAD_ON_CLOSE,
      (event) => {
        console.log(`Got event ${event.type}:`, event.detail);
        const uuid = event.detail.uuid;
        const unloadOnClose = event.detail.unloadOnClose;

        const webPanelController = this.get(uuid);
        webPanelController.setUnloadOnClose(unloadOnClose);
      },
    );

    window.addEventListener(
      WebPanelEvents.EDIT_WEB_PANEL_HIDE_TOOLBAR,
      (event) => {
        console.log(`Got event ${event.type}:`, event.detail);
        const uuid = event.detail.uuid;
        const hideToolbar = event.detail.hideToolbar;

        const webPanelController = this.get(uuid);
        webPanelController.setHideToolbar(hideToolbar);
        this.sidebarController.setHideToolbar(hideToolbar);
      },
    );

    window.addEventListener(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_OUT, (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const uuid = event.detail.uuid;

      const webPanelController = this.get(uuid);
      webPanelController.zoomOut();
    });

    window.addEventListener(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_IN, (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const uuid = event.detail.uuid;

      const webPanelController = this.get(uuid);
      webPanelController.zoomIn();
    });

    window.addEventListener(WebPanelEvents.EDIT_WEB_PANEL_ZOOM, (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const uuid = event.detail.uuid;
      const value = event.detail.value;

      const webPanelController = this.get(uuid);
      webPanelController.setZoom(value);
    });

    window.addEventListener(WebPanelEvents.SAVE_WEB_PANELS, (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const isWindowActive = event.detail.isWindowActive;
      if (isWindowActive) {
        this.saveSettings();
      }
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
