import {
  SidebarEvents,
  WebPanelEvents,
  listenEvent,
  sendEvents,
} from "./events.mjs";

import { NetUtilWrapper } from "../wrappers/net_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelState } from "../settings/web_panel_state.mjs";
import { WebPanelsSettings } from "../settings/web_panels_settings.mjs";
import { WebPanelsState } from "../settings/web_panels_state.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { gCustomizeModeWrapper } from "../wrappers/g_customize_mode.mjs";

export class WebPanelsController {
  constructor() {
    /**@type {Map<string, WebPanelController>} */
    this.webPanelControllers = new Map();
    this.#setupListeners();
  }

  #setupListeners() {
    SidebarElements.webPanelMenuPopup.listenUnloadItemClick(
      (webPanelController) => {
        if (webPanelController.isActive()) {
          SidebarControllers.sidebarController.close();
        }
        webPanelController.unload();
      },
    );

    SidebarElements.webPanelMenuPopup.listenMuteItemClick(
      (webPanelController) => {
        webPanelController.toggleMuteAudio();
      },
    );

    SidebarElements.webPanelMenuPopup.listenResetPositionItemClick(
      (webPanelController) => {
        sendEvents(SidebarEvents.RESET_SIDEBAR_FLOATING_POSITION, {
          uuid: webPanelController.getUUID(),
        });
      },
    );

    SidebarElements.webPanelMenuPopup.listenResetWidthItemClick(
      (webPanelController) => {
        sendEvents(SidebarEvents.RESET_SIDEBAR_FLOATING_WIDTH, {
          uuid: webPanelController.getUUID(),
        });
      },
    );

    SidebarElements.webPanelMenuPopup.listenResetHeightItemClick(
      (webPanelController) => {
        sendEvents(SidebarEvents.RESET_SIDEBAR_FLOATING_HEIGHT, {
          uuid: webPanelController.getUUID(),
        });
      },
    );

    SidebarElements.webPanelMenuPopup.listenResetAllItemClick(
      (webPanelController) => {
        sendEvents(SidebarEvents.RESET_SIDEBAR_FLOATING_ALL, {
          uuid: webPanelController.getUUID(),
        });
      },
    );

    SidebarElements.webPanelMenuPopup.listenEditItemClick(
      (webPanelController) => {
        webPanelController.switchWebPanel({ forceOpen: true });
        SidebarControllers.webPanelEditController.openPopup(webPanelController);
      },
    );

    SidebarElements.webPanelMenuPopup.listenDeleteItemClick(
      (webPanelController) => {
        SidebarControllers.webPanelDeleteController.openPopup(
          webPanelController,
        );
      },
    );

    SidebarElements.webPanelMenuPopup.listenCustomizeItemClick(() => {
      gCustomizeModeWrapper.enter();
    });

    listenEvent(WebPanelEvents.CREATE_WEB_PANEL, async (event) => {
      const {
        uuid,
        url,
        userContextId,
        temporary,
        newWebPanelPosition,
        isActiveWindow,
      } = event.detail;

      const create = async () => {
        return await this.createWebPanelController(
          uuid,
          url,
          userContextId,
          temporary,
          newWebPanelPosition,
          isActiveWindow,
        );
      };

      if (temporary) {
        if (isActiveWindow) {
          const webPanelController = await create();
          webPanelController.switchWebPanel();
          setTimeout(() => this.#unwrapButtons(), 100);
        }
      } else {
        const webPanelController = await create();
        if (isActiveWindow) {
          webPanelController.switchWebPanel();
        }
        setTimeout(() => this.#unwrapButtons(), 100);
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

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_TITLE, (event) => {
      const { uuid, dynamicTitle, title } = event.detail;

      const webPanelController = this.get(uuid);
      webPanelController.setTitle(dynamicTitle, title);
      webPanelController.updateTitle();
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_FAVICON_URL, (event) => {
      const { uuid, dynamicFavicon, faviconURL, timeout } = event.detail;

      const webPanelController = this.get(uuid);
      webPanelController.setFaviconURL(dynamicFavicon, faviconURL);

      clearTimeout(this.faviconURLTimeout);
      this.faviconURLTimeout = setTimeout(() => {
        webPanelController.updateFavicon();
      }, timeout);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_SELECTOR_ENABLED, (event) => {
      const uuid = event.detail.uuid;
      const selectorEnabled = event.detail.selectorEnabled;

      const webPanelController = this.get(uuid);
      const oldSelectorEnabled = webPanelController.getSelectorEnabled();
      webPanelController.setSelectorEnabled(selectorEnabled);

      if (
        !webPanelController.isUnloaded() &&
        oldSelectorEnabled !== selectorEnabled
      ) {
        webPanelController.reload();
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_SELECTOR, (event) => {
      const uuid = event.detail.uuid;
      const selector = event.detail.selector;
      const timeout = event.detail.timeout;

      const webPanelController = this.get(uuid);
      const oldSelector = webPanelController.getSelector();
      webPanelController.setSelector(selector);

      clearTimeout(this.urlTimeout);
      this.urlTimeout = setTimeout(() => {
        if (!webPanelController.isUnloaded() && oldSelector !== selector) {
          webPanelController.reload();
        }
      }, timeout);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_PINNED, (event) => {
      const uuid = event.detail.uuid;
      const pinned = event.detail.pinned;

      const webPanelController = this.get(uuid);
      pinned ? webPanelController.pin() : webPanelController.unpin();

      if (webPanelController.isActive()) {
        SidebarControllers.sidebarController.updatePinState(webPanelController);
        SidebarControllers.sidebarController.updateToolbar(webPanelController);
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_ANCHOR, (event) => {
      const uuid = event.detail.uuid;
      const anchor = event.detail.anchor;

      const webPanelController = this.get(uuid);
      webPanelController.setAnchor(anchor);

      if (webPanelController.isActive()) {
        SidebarControllers.sidebarGeometry.calculateAndSetFloatingGeometry(
          webPanelController,
          {
            forceUpdate: true,
          },
        );
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_OFFSET_X_TYPE, (event) => {
      const uuid = event.detail.uuid;
      const offsetXType = event.detail.offsetXType;

      const webPanelController = this.get(uuid);
      webPanelController.setOffsetXType(offsetXType);

      if (webPanelController.isActive()) {
        SidebarControllers.sidebarGeometry.calculateAndSetFloatingGeometry(
          webPanelController,
          {
            forceUpdate: true,
          },
        );
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_OFFSET_Y_TYPE, (event) => {
      const uuid = event.detail.uuid;
      const offsetYType = event.detail.offsetYType;

      const webPanelController = this.get(uuid);
      webPanelController.setOffsetYType(offsetYType);

      if (webPanelController.isActive()) {
        SidebarControllers.sidebarGeometry.calculateAndSetFloatingGeometry(
          webPanelController,
          {
            forceUpdate: true,
          },
        );
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_WIDTH_TYPE, (event) => {
      const uuid = event.detail.uuid;
      const widthType = event.detail.widthType;

      const webPanelController = this.get(uuid);
      webPanelController.setWidthType(widthType);

      if (webPanelController.isActive()) {
        SidebarControllers.sidebarGeometry.calculateAndSetFloatingGeometry(
          webPanelController,
          {
            forceUpdate: true,
          },
        );
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_HEIGHT_TYPE, (event) => {
      const uuid = event.detail.uuid;
      const heightType = event.detail.heightType;

      const webPanelController = this.get(uuid);
      webPanelController.setHeightType(heightType);

      if (webPanelController.isActive()) {
        SidebarControllers.sidebarGeometry.calculateAndSetFloatingGeometry(
          webPanelController,
          {
            forceUpdate: true,
          },
        );
      }
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_USER_CONTEXT_ID, (event) => {
      const uuid = event.detail.uuid;
      const userContextId = event.detail.userContextId;
      const webPanelController = this.get(uuid);
      webPanelController.setUserContextId(userContextId);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_ALWAYS_ON_TOP, (event) => {
      const uuid = event.detail.uuid;
      const alwaysOnTop = event.detail.alwaysOnTop;

      const webPanelController = this.get(uuid);
      webPanelController.setAlwaysOnTop(alwaysOnTop);
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

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_LOAD_LAST_URL, (event) => {
      const uuid = event.detail.uuid;
      const loadLastUrl = event.detail.loadLastUrl;

      const webPanelController = this.get(uuid);
      webPanelController.setLoadLastUrl(loadLastUrl);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_UNLOAD_ON_CLOSE, (event) => {
      const uuid = event.detail.uuid;
      const unloadOnClose = event.detail.unloadOnClose;

      const webPanelController = this.get(uuid);
      webPanelController.setUnloadOnClose(unloadOnClose);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_SHORTCUT, (event) => {
      const uuid = event.detail.uuid;
      const shortcut = event.detail.shortcut;

      const webPanelController = this.get(uuid);
      webPanelController.setShortcut(shortcut);
    });

    listenEvent(WebPanelEvents.EDIT_WEB_PANEL_HIDE_TOOLBAR, (event) => {
      const uuid = event.detail.uuid;
      const hideToolbar = event.detail.hideToolbar;

      const webPanelController = this.get(uuid);
      webPanelController.setHideToolbar(hideToolbar);
      hideToolbar
        ? SidebarControllers.sidebarController.collapseToolbar()
        : SidebarControllers.sidebarController.uncollapseToolbar();
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

    listenEvent(WebPanelEvents.DELETE_WEB_PANEL, async (event) => {
      const uuid = event.detail.uuid;

      const webPanelController = this.get(uuid);
      if (webPanelController.isActive()) {
        SidebarControllers.sidebarController.close();
      }
      webPanelController.remove();
      this.delete(uuid);
    });
  }

  #setupWebPanelsBrowserListeners() {
    // Open/close corresponding web panel when tab is selected
    SidebarElements.webPanelsBrowser.addTabSelectListener(() => {
      const activeWebPanelTab =
        SidebarElements.webPanelsBrowser.getActiveWebPanelTab();
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
    SidebarElements.webPanelsBrowser.addZoomChangeListener((tab) => {
      const webPanelController = this.get(tab.uuid);
      const zoom = webPanelController.getZoom();
      if (tab.linkedBrowser.getZoom() != zoom) {
        webPanelController.setZoom(zoom);
      }
    });
  }

  #unwrapButtons() {
    const buttons = [
      SidebarElements.webPanelNewButton,
      ...[...this.webPanelControllers.values()].map(
        (webPanelController) => webPanelController.button,
      ),
    ];
    for (const button of buttons) {
      if (button.isWrapped) {
        gCustomizeModeWrapper.unwrapToolbarItem(button.parentElement.getXUL());
      }
    }
  }

  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} userContextId
   * @param {boolean} temporary
   * @param {string} newWebPanelPosition
   * @param {boolean} isActiveWindow
   * @returns {Promise<WebPanelController>}
   */
  async createWebPanelController(
    uuid,
    url,
    userContextId,
    temporary,
    newWebPanelPosition,
    isActiveWindow,
  ) {
    try {
      NetUtilWrapper.newURI(url);
    } catch (error) {
      console.log("Invalid url:", error);
      return;
    }

    const webPanelSettings = new WebPanelSettings(
      SidebarElements.sidebarWrapper.getPosition(),
      SidebarControllers.sidebarGeometry.getDefaultFloatingOffsetCSS(),
      uuid,
      url,
      {
        userContextId,
        temporary,
      },
    );
    const webPanelState = new WebPanelState(uuid);

    const webPanelController = new WebPanelController(
      webPanelSettings,
      webPanelState,
      {
        loaded: isActiveWindow,
        position: newWebPanelPosition,
      },
    );
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
    const tab = SidebarElements.webPanelsBrowser.getActiveWebPanelTab();
    return tab && !tab.isEmpty() ? this.get(tab.uuid) : null;
  }

  /**
   *
   * @returns {WebPanelController[]}
   */
  getAll() {
    return [...this.webPanelControllers.values()];
  }

  /**
   *
   * @param {string} uuid
   */
  delete(uuid) {
    this.webPanelControllers.delete(uuid);
  }

  close() {
    SidebarElements.webPanelsBrowser.deselectWebPanelTab();
  }

  /**
   *
   * @param {WebPanelsSettings} webPanelsSettings
   * @param {WebPanelsState} webPanelsState
   */
  loadSettingsAndState(webPanelsSettings, webPanelsState) {
    console.log("Loading web panels...");

    // We need to display web panels window for a while to initialize it and
    // load startup web panels
    SidebarElements.sidebarBox.show();
    SidebarElements.webPanelsBrowser.init();

    SidebarElements.webPanelsBrowser.waitInitialization(() => {
      // Relink docShell.treeOwner to the current window to fix status panel
      new WindowWrapper().relinkTreeOwner();
      // Setup web panels window listeners
      this.#setupWebPanelsBrowserListeners();
      // Load startup web panels
      const webPanelsStateMap = new Map();
      for (const webPanelState of webPanelsState.webPanelsState) {
        webPanelsStateMap.set(webPanelState.uuid, webPanelState);
      }
      for (const webPanelSettings of webPanelsSettings.webPanels) {
        const uuid = webPanelSettings.uuid;
        const webPanelState =
          webPanelsStateMap.get(uuid) ?? new WebPanelState(uuid);
        const webPanelController = new WebPanelController(
          webPanelSettings,
          webPanelState,
          {
            loaded: webPanelSettings.loadOnStartup,
          },
        );
        this.add(webPanelController);
      }
      // Hide web panels window after initialization
      SidebarElements.sidebarBox.hide();
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

  dumpState() {
    return new WebPanelsState(
      Array.from(this.webPanelControllers.values(), (webPanelController) =>
        webPanelController.dumpState(),
      ),
    );
  }

  saveState() {
    this.dumpState().save();
  }
}
