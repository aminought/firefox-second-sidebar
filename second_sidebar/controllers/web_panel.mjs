import { SidebarController } from "./sidebar.mjs";
import { WebPanel } from "../xul/web_panel.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelEditController } from "./web_panel_edit.mjs";
import { WebPanelTab } from "../xul/web_panel_tab.mjs";
import { WebPanelsController } from "./web_panels.mjs";

export class WebPanelController {
  /**
   *
   * @param {WebPanel} webPanel
   * @param {WebPanelButton} webPanelButton
   * @param {WebPanelTab} webPanelTab
   */
  constructor(webPanel, webPanelButton, webPanelTab) {
    this.webPanel = webPanel;
    this.webPanelButton = webPanelButton;
    this.webPanelTab = webPanelTab;
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   * @param {SidebarController} sidebarController
   * @param {WebPanelEditController} webPanelEditController
   */
  setupDependencies(
    webPanelsController,
    sidebarController,
    webPanelEditController
  ) {
    this.webPanelsController = webPanelsController;
    this.sidebarController = sidebarController;
    this.webPanelEditController = webPanelEditController;
  }

  /**
   *
   * @returns {string}
   */
  getUUID() {
    return this.webPanel.uuid;
  }

  initWebPanel() {
    this.webPanel.listenBrowserProgressListener(() => {
      if (this.webPanel.isActive()) {
        const canGoBack = this.webPanel.canGoBack();
        const canGoForward = this.webPanel.canGoForward();
        const title = this.webPanel.getTitle();
        this.sidebarController.setToolbarBackButtonDisabled(!canGoBack);
        this.sidebarController.setToolbarForwardButtonDisabled(!canGoForward);
        this.sidebarController.setToolbarTitle(title);
      }
      // mediaController can be changed, so listen here
      this.webPanel.listenPlaybackStateChange((isPlaying) => {
        this.webPanelButton.setPlaying(isPlaying);
      });
    });

    this.webPanel.goHome();
  }

  initWebPanelButton() {
    const switchWebPanel = () => {
      if (this.webPanel.isActive()) {
        this.sidebarController.close();
      } else {
        this.webPanelsController.hideActive();
        if (
          this.webPanelsController.injectWebPanelTab(this.webPanelTab) &&
          this.webPanelsController.injectWebPanel(this.webPanel)
        ) {
          this.initWebPanel();
        }
        this.sidebarController.open(
          this.webPanel.pinned,
          this.webPanel.width,
          this.webPanel.canGoBack(),
          this.webPanel.canGoForward(),
          this.webPanel.getTitle()
        );
        this.show();
      }
    };

    const openWebPanelEditPopup = () => {
      this.webPanelEditController.openPopup(this);
    };

    this.webPanelButton.listenClick((event) => {
      if (event.button === 0) {
        switchWebPanel();
      } else if (event.button === 1) {
        this.unload();
      } else if (event.button === 2) {
        openWebPanelEditPopup();
      }
    });
  }

  show() {
    this.webPanel.show().setDocShellIsActive(true).preserveLayers(false);
    this.webPanelButton.setOpen(true);
    this.webPanelButton.setUnloaded(false);
  }

  hide() {
    this.webPanel.hide().setDocShellIsActive(false).preserveLayers(true);
    if (this.webPanel.unloadOnClose) {
      this.unload();
    }
    this.webPanelButton.setOpen(false);
  }

  unload() {
    this.sidebarController.close();
    this.webPanel.remove();
    this.webPanelTab.remove();
    this.webPanelButton.setUnloaded(true).hidePlayingIcon();
  }

  /**
   *
   * @returns {boolean}
   */
  isFirst() {
    return this.webPanelsController.isFirst(this.getUUID());
  }

  /**
   *
   * @returns {boolean}
   */
  isLast() {
    return this.webPanelsController.isLast(this.getUUID());
  }

  /**
   *
   * @param {number} width
   */
  setWidth(width) {
    this.webPanel.width = width;
  }

  /**
   *
   * @returns {boolean}
   */
  pinned() {
    return this.webPanel.pinned;
  }

  pin() {
    this.webPanel.pinned = true;
  }

  unpin() {
    this.webPanel.pinned = false;
  }

  /**
   *
   * @param {string} url
   * @param {string} faviconURL
   * @param {boolean} mobile
   * @param {boolean} loadOnStartup
   * @param {boolean} unloadOnClose
   */
  set(url, faviconURL, mobile, loadOnStartup, unloadOnClose) {
    const needToGoHome = this.webPanel.mobile !== mobile;

    this.webPanel.url = url;
    this.webPanel.faviconURL = faviconURL;
    this.webPanel.mobile = mobile;
    this.webPanel.loadOnStartup = loadOnStartup;
    this.webPanel.unloadOnClose = unloadOnClose;
    this.webPanelButton.setIcon(faviconURL);

    if (needToGoHome) {
      this.webPanel.goHome();
    }
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    return this.webPanel.isActive();
  }

  remove() {
    this.webPanel.remove();
    this.webPanelTab.remove();
    this.webPanelButton.remove();
  }
}
