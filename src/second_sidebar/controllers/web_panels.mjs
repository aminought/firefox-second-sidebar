/* eslint-disable no-unused-vars */
import { WebPanelEvents, listenEvent } from "./events.mjs";
import { isLeftMouseButton, isMiddleMouseButton } from "../utils/buttons.mjs";

import { NetUtilWrapper } from "../wrappers/net_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarMain } from "../xul/sidebar_main.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelMenuPopup } from "../xul/web_panel_menupopup.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelTabs } from "../xul/web_panel_tabs.mjs";
import { WebPanels } from "../xul/web_panels.mjs";
import { WebPanelsSettings } from "../settings/web_panels_settings.mjs";
import { fetchIconURL } from "../utils/icons.mjs";
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

  #setupListeners() {
    this.webPanelMenuPopup.setWebPanelsController(this);

    this.webPanelMenuPopup.listenUnloadItemClick((webPanelController) => {
      webPanelController.unload();
    });

    this.webPanelMenuPopup.listenEditItemClick((webPanelController) => {
      SidebarControllers.webPanelEditController.openPopup(webPanelController);
    });

    this.webPanelMenuPopup.listenDeleteItemClick((webPanelController) => {
      SidebarControllers.webPanelDeleteController.openPopup(webPanelController);
    });

    this.webPanelMenuPopup.listenCustomizeItemClick(() => {
      gCustomizeModeWrapper.enter();
    });

    listenEvent(WebPanelEvents.CREATE_WEB_PANEL, async (event) => {
      const uuid = event.detail.uuid;
      const url = event.detail.url;
      const userContextId = event.detail.userContextId;
      const newWebPanelPosition = event.detail.newWebPanelPosition;
      const isWindowActive = event.detail.isWindowActive;

      const webPanelController = await this.createWebPanelController(
        uuid,
        url,
        userContextId,
        newWebPanelPosition,
        isWindowActive,
      );
      if (isWindowActive) {
        webPanelController.openWebPanel();
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_URL, (event) => {
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

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_FAVICON_URL, (event) => {
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
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_PINNED, (event) => {
      const uuid = event.detail.uuid;
      const pinned = event.detail.pinned;

      const webPanelController = this.get(uuid);
      pinned ? webPanelController.pin() : webPanelController.unpin();
      if (webPanelController.isActive()) {
        pinned
          ? SidebarControllers.sidebarController.pin()
          : SidebarControllers.sidebarController.unpin();
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_USER_CONTEXT_ID, (event) => {
      const uuid = event.detail.uuid;
      const userContextId = event.detail.userContextId;

      const webPanelController = this.get(uuid);
      webPanelController.setUserContextId(userContextId);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_MOBILE, (event) => {
      const uuid = event.detail.uuid;
      const mobile = event.detail.mobile;

      const webPanelController = this.get(uuid);
      webPanelController.setMobile(mobile);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_LOAD_ON_STARTUP, (event) => {
      const uuid = event.detail.uuid;
      const loadOnStartup = event.detail.loadOnStartup;

      const webPanelController = this.get(uuid);
      webPanelController.setLoadOnStartup(loadOnStartup);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_UNLOAD_ON_CLOSE, (event) => {
      const uuid = event.detail.uuid;
      const unloadOnClose = event.detail.unloadOnClose;

      const webPanelController = this.get(uuid);
      webPanelController.setUnloadOnClose(unloadOnClose);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_HIDE_TOOLBAR, (event) => {
      const uuid = event.detail.uuid;
      const hideToolbar = event.detail.hideToolbar;

      const webPanelController = this.get(uuid);
      webPanelController.setHideToolbar(hideToolbar);
      SidebarControllers.sidebarController.setHideToolbar(hideToolbar);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_OUT, (event) => {
      const uuid = event.detail.uuid;

      const webPanelController = this.get(uuid);
      webPanelController.zoomOut();
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_ZOOM_IN, (event) => {
      const uuid = event.detail.uuid;

      const webPanelController = this.get(uuid);
      webPanelController.zoomIn();
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_ZOOM, (event) => {
      const uuid = event.detail.uuid;
      const value = event.detail.value;

      const webPanelController = this.get(uuid);
      webPanelController.setZoom(value);
    });

    listenEvent(WebPanelEvents.SAVE_WEB_PANELS, (event) => {
      const isWindowActive = event.detail.isWindowActive;
      if (isWindowActive) {
        this.saveSettings();
      }
    });

    listenEvent(WebPanelEvents.OPEN_WEB_PANEL, (event) => {
      const uuid = event.detail.uuid;
      const mouseEvent = event.detail.event;

      const webPanelController = this.get(uuid);
      if (isLeftMouseButton(mouseEvent)) {
        webPanelController.switchWebPanel();
      } else if (isMiddleMouseButton(mouseEvent)) {
        webPanelController.unload();
      }
    });

    listenEvent(WebPanelEvents.DELETE_WEB_PANEL, async (event) => {
      const uuid = event.detail.uuid;

      const webPanelController = this.get(uuid);
      if (webPanelController.isActive()) {
        SidebarControllers.sidebarController.close();
      }
      webPanelController.remove();
      this.delete(uuid);

      if (event.detail.isWindowActive) {
        this.saveSettings();
      }
    });
  }

  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} userContextId
   * @param {string} newWebPanelPosition
   * @param {boolean} isWindowActive
   * @returns {WebPanelController}
   */
  async createWebPanelController(
    uuid,
    url,
    userContextId,
    newWebPanelPosition,
    isWindowActive,
  ) {
    try {
      NetUtilWrapper.newURI(url);
    } catch (error) {
      console.log("Invalid url:", error);
      return;
    }
    const faviconURL = await fetchIconURL(url);

    const webPanelTab = new WebPanelTab(uuid, userContextId);
    const webPanel = new WebPanel(webPanelTab, uuid, url, faviconURL).hide();
    const webPanelButton = new WebPanelButton(
      webPanel.uuid,
      newWebPanelPosition,
    )
      .setUserContextId(userContextId)
      .setIcon(faviconURL)
      .setLabel(url)
      .setTooltipText(url);

    const webPanelController = new WebPanelController(
      webPanel,
      webPanelButton,
      webPanelTab,
    );
    this.add(webPanelController);

    if (isWindowActive) {
      this.saveSettings();
      this.injectWebPanelTab(webPanelTab);
      this.injectWebPanel(webPanel);
      webPanelController.initWebPanel();
    }
    webPanelController.initWebPanelButton();

    return webPanelController;
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
    console.log("Loading web panels...");
    for (const webPanelSettings of webPanelsSettings.webPanels) {
      const webPanelController =
        WebPanelController.fromSettings(webPanelSettings);
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
