/* eslint-disable no-unused-vars */
import { NetUtilWrapper } from "../wrappers/net_utils.mjs";
import { SidebarController } from "./sidebar.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelNewButton } from "../xul/web_panel_new_button.mjs";
import { WebPanelPopupNew } from "../xul/web_panel_popup_new.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelsController } from "./web_panels.mjs";
import { WindowManagerWrapper } from "../wrappers/window_manager.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
import { fetchIconURL } from "../utils/icons.mjs";
import { gBrowserWrapper } from "../wrappers/g_browser.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";
/* eslint-enable no-unused-vars */

const Events = {
  OPEN_NEW_WEB_PANEL_POPUP: "open_new_web_panel_popup",
  CREATE_NEW_WEB_PANEL: "create_new_web_panel",
};

export class WebPanelNewController {
  /**
   *
   * @param {WebPanelNewButton} webPanelNewButton
   * @param {WebPanelPopupNew} webPanelPopupNew
   */
  constructor(webPanelNewButton, webPanelPopupNew) {
    this.webPanelNewButton = webPanelNewButton;
    this.webPanelPopupNew = webPanelPopupNew;

    window.addEventListener(Events.OPEN_NEW_WEB_PANEL_POPUP, () => {
      this.openPopup();
    });

    window.addEventListener(Events.CREATE_NEW_WEB_PANEL, async (event) => {
      const webPanelController = await this.createWebPanelController(
        event.detail.uuid,
        event.detail.url,
        event.detail.userContextId,
        event.detail.isWindowActive,
      );
      if (event.detail.isWindowActive) {
        this.openWebPanel(webPanelController);
      }
    });

    this.webPanelNewButton.listenClick((event) => {
      if (isLeftMouseButton(event)) {
        const lastWindow = WindowManagerWrapper.getMostRecentBrowserWindow();
        const customEvent = new CustomEvent(Events.OPEN_NEW_WEB_PANEL_POPUP);
        lastWindow.dispatchEvent(customEvent);
      }
    });

    this.webPanelPopupNew.listenSaveButtonClick(async (url, userContextId) => {
      const uuid = crypto.randomUUID();
      const lastWindow = WindowManagerWrapper.getMostRecentBrowserWindow();
      for (const window of WindowWatcherWrapper.getWindowEnumerator()) {
        const customEvent = new CustomEvent(Events.CREATE_NEW_WEB_PANEL, {
          detail: {
            uuid,
            url,
            userContextId,
            isWindowActive: window === lastWindow,
          },
        });
        window.dispatchEvent(customEvent);
      }
    });

    this.webPanelPopupNew.listenCancelButtonClick(() => {
      this.hidePopup();
    });
  }

  /**
   *
   * @param {SidebarController} sidebarController
   * @param {WebPanelsController} webPanelsController
   * @param {WebPanelEditController} webPanelEditController
   */
  setupDependencies(
    sidebarController,
    webPanelsController,
    webPanelEditController,
  ) {
    this.sidebarController = sidebarController;
    this.webPanelsController = webPanelsController;
    this.webPanelEditController = webPanelEditController;
  }

  openPopup() {
    let suggest = "https://";
    const currentURI = gBrowserWrapper.currentURI;

    if (["http", "https"].includes(currentURI.scheme)) {
      suggest = currentURI.spec;
    }

    this.webPanelPopupNew.openPopup(this.webPanelNewButton.button, suggest);
  }

  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} userContextId
   * @param {boolean} isWindowActive
   * @returns {WebPanelController}
   */
  async createWebPanelController(uuid, url, userContextId, isWindowActive) {
    try {
      NetUtilWrapper.newURI(url);
    } catch (error) {
      console.log("Invalid url:", error);
      return;
    }
    const faviconURL = await fetchIconURL(url);

    this.hidePopup();

    const webPanelTab = new WebPanelTab(uuid, userContextId);
    const webPanel = new WebPanel(webPanelTab, uuid, url, faviconURL).hide();
    const webPanelButton = new WebPanelButton(
      webPanel.uuid,
      this.newWebPanelPosition,
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

    webPanelController.setupDependencies(
      this.webPanelsController,
      this.sidebarController,
      this.webPanelEditController,
    );

    this.webPanelsController.add(webPanelController);

    if (isWindowActive) {
      this.webPanelsController.saveSettings();
      this.webPanelsController.injectWebPanelTab(webPanelTab);
      this.webPanelsController.injectWebPanel(webPanel);
      webPanelController.initWebPanel();
    }
    webPanelController.initWebPanelButton();

    return webPanelController;
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openWebPanel(webPanelController) {
    const webPanel = webPanelController.webPanel;
    this.sidebarController.close();
    this.sidebarController.open(
      webPanel.pinned,
      webPanel.width,
      webPanel.canGoBack(),
      webPanel.canGoForward(),
      webPanel.getTitle(),
      webPanel.getZoom(),
      webPanel.hideToolbar,
    );
    webPanelController.show();
  }

  hidePopup() {
    this.webPanelPopupNew.hidePopup();
  }

  /**
   *
   * @returns {string}
   */
  getNewWebPanelPosition() {
    return this.newWebPanelPosition;
  }

  /**
   *
   * @param {string} value
   */
  setNewWebPanelPosition(value) {
    this.newWebPanelPosition = value;
  }
}
