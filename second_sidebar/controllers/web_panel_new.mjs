import { SidebarController } from "./sidebar.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelNewButton } from "../xul/web_panel_new_button.mjs";
import { WebPanelPopupNew } from "../xul/web_panel_popup_new.mjs";
import { WebPanelsController } from "./web_panels.mjs";
import { fetchIconURL } from "../utils/icons.mjs";

export class WebPanelNewController {
  /**
   *
   * @param {WebPanelNewButton} webPanelNewButton
   * @param {WebPanelPopupNew} webPanelPopupNew
   */
  constructor(webPanelNewButton, webPanelPopupNew) {
    this.webPanelNewButton = webPanelNewButton;
    this.webPanelPopupNew = webPanelPopupNew;

    this.webPanelNewButton.listenClick(() => {
      this.openPopup();
    });

    this.webPanelPopupNew.listenInputChange((url) => {
      this.createWebPanelAndOpen(url);
    });

    this.webPanelPopupNew.listenSaveButtonClick((url) => {
      this.createWebPanelAndOpen(url);
    });

    this.webPanelPopupNew.listenCancelButtonClick((url) => {
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
    webPanelEditController
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
      .openPopup(this.webPanelNewButton);
  }

  async createWebPanelAndOpen(url) {
    try {
      NetUtil.newURI(url);
    } catch (error) {
      console.log("Invalid url");
      return;
    }

    this.hidePopup();

    const faviconURL = await fetchIconURL(url);
    const uuid = crypto.randomUUID();

    const webPanelTab = this.webPanelsController.makeWebPanelTab(uuid);
    const webPanel = this.webPanelsController.makeWebPanel(
      webPanelTab,
      uuid,
      url,
      faviconURL
    );
    const webPanelButton =
      this.webPanelsController.makeWebPanelButton(webPanel);

    const webPanelController = new WebPanelController(
      webPanel,
      webPanelButton,
      webPanelTab
    );
    webPanelController.setupDependencies(
      this.webPanelsController,
      this.sidebarController,
      this.webPanelEditController
    );

    this.webPanelsController.injectWebPanelTab(webPanelTab);
    this.webPanelsController.injectWebPanel(webPanel);
    webPanelController.initWebPanel();

    this.webPanelsController.injectWebPanelButton(webPanelButton);
    webPanelController.initWebPanelButton();

    this.sidebarController.close();
    this.sidebarController.open(
      webPanel.pinned,
      webPanel.width,
      webPanel.canGoBack(),
      webPanel.canGoForward(),
      webPanel.getTitle()
    );
    webPanelController.show();

    this.webPanelsController.add(webPanelController);
    this.webPanelsController.savePref();
  }

  hidePopup() {
    this.webPanelPopupNew.hidePopup();
  }
}
