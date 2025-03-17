import { WebPanelEvents, listenEvent } from "./events.mjs";
import { isLeftMouseButton, isMiddleMouseButton } from "../utils/buttons.mjs";

import { NetUtilWrapper } from "../wrappers/net_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelsSettings } from "../settings/web_panels_settings.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { fetchIconURL } from "../utils/icons.mjs";
import { gCustomizeModeWrapper } from "../wrappers/g_customize_mode.mjs";
import { parseNotifications } from "../utils/string.mjs";

export class WebPanelsController {
  constructor() {
    this.sidebarMain = SidebarElements.sidebarMain;
    this.sidebarBox = SidebarElements.sidebarBox;
    this.webPanelsBrowser = SidebarElements.webPanelsBrowser;
    this.webPanelMenuPopup = SidebarElements.webPanelMenuPopup;

    /**@type {Map<string, WebPanelController>} */
    this.webPanelControllers = new Map();
    this.#setupListeners();
  }

  #setupListeners() {
    this.webPanelMenuPopup.listenUnloadItemClick((webPanelController) => {
      if (webPanelController.isActive()) {
        SidebarControllers.sidebarController.close();
      }
      webPanelController.unload();
    });

    this.webPanelMenuPopup.listenMuteItemClick((webPanelController) => {
      webPanelController.toggleMuteAudio();
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
      const isActiveWindow = event.detail.isActiveWindow;

      const webPanelController = await this.createWebPanelController(
        uuid,
        url,
        userContextId,
        newWebPanelPosition,
        isActiveWindow,
      );
      if (isActiveWindow) {
        webPanelController.switchWebPanel();
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

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_HIDE_SOUND_ICON, (event) => {
      const uuid = event.detail.uuid;
      const hideSoundIcon = event.detail.hideSoundIcon;

      const webPanelController = this.get(uuid);
      webPanelController.setHideSoundIcon(hideSoundIcon);
    });

    listenEvent(
      WebPanelEvents.EDIT_WEB_PANEL_HIDE_NOTIFICATION_BADGE,
      (event) => {
        const uuid = event.detail.uuid;
        const hideNotificationBadge = event.detail.hideNotificationBadge;

        const webPanelController = this.get(uuid);
        webPanelController.setHideNotificationBadge(hideNotificationBadge);
      },
    );

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_PERIODIC_RELOAD, (event) => {
      const uuid = event.detail.uuid;
      const periodicReload = event.detail.periodicReload;

      const webPanelController = this.get(uuid);
      webPanelController.setPeriodicReload(periodicReload);
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
      const isActiveWindow = event.detail.isActiveWindow;
      if (isActiveWindow) {
        this.saveSettings();
      }
    });

    listenEvent(WebPanelEvents.SWITCH_WEB_PANEL, (event) => {
      const uuid = event.detail.uuid;
      const mouseEvent = event.detail.event;

      const webPanelController = this.get(uuid);
      if (isLeftMouseButton(mouseEvent)) {
        webPanelController.switchWebPanel();
      } else if (isMiddleMouseButton(mouseEvent)) {
        if (webPanelController.isActive()) {
          SidebarControllers.sidebarController.close();
        }
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

      if (event.detail.isActiveWindow) {
        this.saveSettings();
      }
    });
  }

  #setupWebPanelsBrowserListeners() {
    // Notify SessionStore about closing web panels window when main window is closed
    const window = new WindowWrapper();
    window.addEventListener("unload", () => {
      this.webPanelsBrowser.notifyWindowClosedAndRemove();
    });
    // Change toolbar title when title of selected tab is changed
    this.webPanelsBrowser.addPageTitleChangeListener((tab) => {
      const title = tab.linkedBrowser.getTitle();
      if (tab.selected) {
        SidebarControllers.sidebarController.setToolbarTitle(title);
      }
      const webPanelController = this.get(tab.uuid);
      const notifications = parseNotifications(title);
      webPanelController.button.setNotificationBadge(notifications);
    });
    // Open/close corresponding web panel when tab is selected
    this.webPanelsBrowser.addTabSelectListener(() => {
      const activeWebPanelTab = this.webPanelsBrowser.getActiveWebPanelTab();
      if (activeWebPanelTab.isEmpty()) {
        SidebarControllers.sidebarController.close();
      }
      for (const [uuid, webPanelController] of this.webPanelControllers) {
        if (uuid === activeWebPanelTab.uuid) {
          webPanelController.open();
        } else {
          webPanelController.close();
        }
      }
    });
    // Revert zoom to default when it's changed
    this.webPanelsBrowser.addZoomChangeListener((tab) => {
      const webPanelController = this.get(tab.uuid);
      const zoom = webPanelController.getZoom();
      if (tab.linkedBrowser.getZoom() != zoom) {
        webPanelController.setZoom(zoom);
      }
    });
  }

  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} userContextId
   * @param {string} newWebPanelPosition
   * @param {boolean} isActiveWindow
   * @returns {WebPanelController}
   */
  async createWebPanelController(
    uuid,
    url,
    userContextId,
    newWebPanelPosition,
    isActiveWindow,
  ) {
    try {
      NetUtilWrapper.newURI(url);
    } catch (error) {
      console.log("Invalid url:", error);
      return;
    }
    const faviconURL = await fetchIconURL(url);

    const webPanelSettings = new WebPanelSettings(uuid, url, faviconURL, {
      userContextId,
    });
    const webPanelController = new WebPanelController(webPanelSettings, {
      loaded: isActiveWindow,
      position: newWebPanelPosition,
    });
    this.add(webPanelController);

    if (isActiveWindow) {
      this.saveSettings();
    }

    return webPanelController;
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  add(webPanelController) {
    this.webPanelControllers.set(
      webPanelController.getUUID(),
      webPanelController,
    );
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanelController?}
   */
  get(uuid) {
    return this.webPanelControllers.get(uuid) ?? null;
  }

  /**
   *
   * @returns {WebPanelController?}
   */
  getActive() {
    const tab = this.webPanelsBrowser.getActiveWebPanelTab();
    return tab.isEmpty() ? null : this.get(tab.uuid);
  }

  /**
   *
   * @param {string} uuid
   */
  delete(uuid) {
    this.webPanelControllers.delete(uuid);
  }

  close() {
    this.webPanelsBrowser.deselectWebPanelTab();
  }

  /**
   *
   * @param {WebPanelsSettings} webPanelsSettings
   */
  loadSettings(webPanelsSettings) {
    console.log("Loading web panels...");

    // We need to display web panels window for a while to initialize it and
    // load startup web panels
    this.sidebarBox.show();
    this.webPanelsBrowser.init();

    this.webPanelsBrowser.waitInitialization(() => {
      // Relink docShell.treeOwner to the current window to fix status panel
      new WindowWrapper().relinkTreeOwner();
      // Setup web panels window listeners
      this.#setupWebPanelsBrowserListeners();
      // Load startup web panels
      for (const webPanelSettings of webPanelsSettings.webPanels) {
        const webPanelController = new WebPanelController(webPanelSettings, {
          loaded: webPanelSettings.loadOnStartup,
        });
        this.add(webPanelController);
      }
      // Hide web panels window after initialization
      this.sidebarBox.hide();
    });
  }

  /**
   *
   * @returns {WebPanelsSettings}
   */
  dumpSettings() {
    return new WebPanelsSettings(
      Array.from(this.webPanelControllers.values(), (webPanelController) =>
        webPanelController.dumpSettings(),
      ),
    );
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
