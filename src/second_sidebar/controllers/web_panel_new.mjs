/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelNewButton } from "../xul/web_panel_new_button.mjs";
import { WebPanelPopupNew } from "../xul/web_panel_popup_new.mjs";
import { WebPanelsController } from "./web_panels.mjs";
import { fetchIconURL } from "../utils/icons.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";
/* eslint-enable no-unused-vars */

export class WebPanelNewController {
  /**
   *
   * @param {WebPanelNewButton} webPanelNewButton
   * @param {WebPanelPopupNew} webPanelPopupNew
   */
  constructor(webPanelNewButton, webPanelPopupNew) {
    this.webPanelNewButton = webPanelNewButton;
    this.webPanelPopupNew = webPanelPopupNew;

    this.webPanelNewButton.listenClick((event) => {
      if (isLeftMouseButton(event)) {
        this.openPopup();
      }
    });

    this.webPanelPopupNew.listenInputChange((url) => {
      this.createWebPanelAndOpen(url);
    });

    this.webPanelPopupNew.listenSaveButtonClick((url, userContextId) => {
      this.createWebPanelAndOpen(url, userContextId);
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
    const currentURI = gBrowser.currentURI;

    if (["http", "https"].includes(currentURI.scheme)) {
      suggest = currentURI.spec;
    }

    this.webPanelPopupNew
      .setInputValue(suggest)
      .openPopup(this.webPanelNewButton.button);
  }

  async createWebPanelAndOpen(url, userContextId) {
    try {
      NetUtil.newURI(url);
    } catch (error) {
      console.log("Invalid url:", error);
      return;
    }

    this.hidePopup();

    const faviconURL = await fetchIconURL(url);
    const uuid = crypto.randomUUID();

    userContextId;

    const webPanelTab = this.webPanelsController.makeWebPanelTab(uuid);
    const webPanel = this.webPanelsController.makeWebPanel(
      webPanelTab,
      uuid,
      url,
      faviconURL,
      {
        userContextId,
      },
    );
    const webPanelButton = this.webPanelsController.makeWebPanelButton(
      webPanel,
      this.newWebPanelPosition,
    );

    const webPanelController = this.webPanelsController.makeWebPanelController(
      webPanel,
      webPanelButton,
      webPanelTab,
    );
    webPanelController.setupDependencies(
      this.webPanelsController,
      this.sidebarController,
      this.webPanelEditController,
    );

    this.webPanelsController.injectWebPanelTab(webPanelTab);
    this.webPanelsController.injectWebPanel(webPanel);
    webPanelController.initWebPanel();

    webPanelController.initWebPanelButton();

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

    this.webPanelsController.add(webPanelController);
    this.webPanelsController.saveSettings();
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
