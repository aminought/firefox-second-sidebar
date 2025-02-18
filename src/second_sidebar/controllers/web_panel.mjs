import { WebPanelEvents, sendEvent } from "./events.mjs";

import { Browser } from "../xul/base/browser.mjs";
import { ChromeUtilsWrapper } from "../wrappers/chrome_utils.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { Tab } from "../xul/base/tab.mjs";
import { WebPanelButton } from "../xul/web_panel_button.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";

export class WebPanelController {
  #progressListener;
  /**@type {WebPanelSettings} */
  #settings;
  /**@type {WebPanelButton} */
  #button;
  /**
   *
   * @param {WebPanelSettings} settings
   * @param {object?} params
   * @param {boolean?} params.loaded
   * @param {string?} params.position
   */
  constructor(settings, { loaded = false, position = null } = {}) {
    this.#settings = settings;
    this.#progressListener = this.#createProgressListener();
    this.#button = this.#createWebPanelButton(settings, loaded, position);
    if (loaded) {
      SidebarElements.webPanelsBrowser.addWebPanel(
        settings,
        this.#progressListener,
      );
    }
  }

  #createProgressListener() {
    return {
      QueryInterface: ChromeUtilsWrapper.generateQI([
        "nsIWebProgressListener",
        "nsIWebProgressListener2",
        "nsISupportsWeakReference",
        "nsIXULBrowserWindow",
      ]),
      onLocationChange: () => {
        this.browser.setZoom(this.#settings.zoom);
        if (this.tab.isActive()) {
          console.log("Location of active tab changed");
          const canGoBack = this.browser.canGoBack();
          const canGoForward = this.browser.canGoForward();
          const title = this.browser.getTitle();
          SidebarControllers.sidebarController.setToolbarBackButtonDisabled(
            !canGoBack,
          );
          SidebarControllers.sidebarController.setToolbarForwardButtonDisabled(
            !canGoForward,
          );
          SidebarControllers.sidebarController.setToolbarTitle(title);
        } else {
          console.log("Location changed");
        }
      },
    };
  }

  /**
   *
   * @param {WebPanelSettings} settings
   * @param {boolean} loaded
   * @param {string} position
   */
  #createWebPanelButton(settings, loaded, position) {
    const button = new WebPanelButton(settings, position);
    button.setUnloaded(!loaded);

    button.listenClick((event) => {
      sendEvent(WebPanelEvents.OPEN_WEB_PANEL, {
        uuid: this.#settings.uuid,
        event,
      });
    });

    return button;
  }

  /**
   * @returns {WebPanelButton}
   */
  get button() {
    return this.#button;
  }

  /**
   * @returns {Tab?}
   */
  get tab() {
    return SidebarElements.webPanelsBrowser.getWebPanelTab(this.getUUID());
  }

  /**
   * @returns {Browser?}
   */
  get browser() {
    if (this.tab) {
      return SidebarElements.webPanelsBrowser.getWebPanelBrowserForTab(
        this.tab,
      );
    }
    return null;
  }

  /**
   *
   * @returns {string}
   */
  getUUID() {
    return this.#settings.uuid;
  }

  /**
   *
   * @returns {string}
   */
  getURL() {
    return this.#settings.url;
  }

  /**
   *
   * @param {string} value
   */
  setURL(value) {
    this.#settings.url = value;
    this.button.setLabel(value).setTooltipText(value);
  }

  // /**
  //  *
  //  * @param {string} userContextId
  //  */
  // setUserContextId(userContextId) {
  //   const isActive = this.isActive();

  //   const webPanelTab = new WebPanelTab(this.getUUID(), userContextId);
  //   const webPanel = new WebPanel(
  //     webPanelTab,
  //     this.getUUID(),
  //     this.webPanel.url,
  //     this.webPanel.faviconURL,
  //     {
  //       pinned: this.webPanel.pinned,
  //       width: this.webPanel.width,
  //       mobile: this.webPanel.mobile,
  //       zoom: this.webPanel.zoom,
  //       loadOnStartup: this.webPanel.loadOnStartup,
  //       unloadOnClose: this.webPanel.unloadOnClose,
  //       hideToolbar: this.webPanel.hideToolbar,
  //     },
  //   );

  //   this.unhackAsyncTabSwitcher();
  //   this.webPanelTab.remove();
  //   this.webPanel.remove();

  //   this.webPanelTab = webPanelTab;
  //   this.webPanel = webPanel;
  //   this.webPanelButton.setUserContextId(userContextId);

  //   if (isActive) {
  //     // SidebarControllers.webPanelsController.injectWebPanelTab(webPanelTab);
  //     // SidebarControllers.webPanelsController.injectWebPanel(webPanel);
  //     // this.initWebPanel();
  //     // this.webPanel.setDocShellIsActive(true).preserveLayers(false);
  //   } else {
  //     webPanel.hide();
  //     this.webPanelButton.setUnloaded(true);
  //   }
  // }

  /**
   *
   * @returns {string}
   */
  getFaviconURL() {
    return this.#settings.faviconURL;
  }

  /**
   *
   * @param {string} faviconURL
   */
  setWebPanelFaviconURL(faviconURL) {
    this.#settings.faviconURL = faviconURL;
  }

  /**
   *
   * @param {string} faviconURL
   */
  setWebPanelButtonFaviconURL(faviconURL) {
    this.button.setIcon(faviconURL);
  }

  /**
   *
   * @returns {string}
   */
  getCurrentUrl() {
    return this.webPanelTab.getCurrentUrl();
  }

  switchWebPanel() {
    const activeWebPanelController =
      SidebarControllers.webPanelsController.getActive();
    if (activeWebPanelController) {
      activeWebPanelController.hide();
    }
    const uuid = this.getUUID();
    if (
      !SidebarControllers.sidebarController.closed() &&
      this.tab?.isActive()
    ) {
      SidebarControllers.sidebarController.close();
    } else {
      if (!this.tab) {
        SidebarElements.webPanelsBrowser.addWebPanel(
          this.#settings,
          this.#progressListener,
        );
      }
      SidebarElements.webPanelsBrowser.selectWebPanelTab(uuid);
      SidebarControllers.sidebarController.open(
        this.#settings.pinned,
        this.#settings.width,
        this.browser.canGoBack(),
        this.browser.canGoForward(),
        this.browser.getTitle(),
        this.browser.getZoom(),
        this.#settings.hideToolbar,
      );
      this.show();
    }
  }

  show() {
    this.#button.setOpen(true);
    this.#button.setUnloaded(false);
  }

  hide() {
    if (this.#settings.unloadOnClose) {
      this.unload();
    }
    this.#button.setOpen(false);
  }

  unload() {
    SidebarControllers.sidebarController.close();
    SidebarElements.webPanelsBrowser.unloadWebPanelTab(this.getUUID());
    this.#button.hidePlayingIcon().setUnloaded(true);
  }

  /**
   *
   * @returns {boolean}
   */
  isUnloaded() {
    return this.button.isUnloaded();
  }

  reload() {
    this.browser.reload();
  }

  goBack() {
    this.browser.goBack();
  }

  goForward() {
    this.browser.goForward();
  }

  goHome() {
    this.browser.go(this.#settings.url);
  }

  /**
   *
   * @param {boolean} value
   */
  setMobile(value) {
    this.webPanel.mobile = value;
    if (!this.isUnloaded()) {
      this.webPanel.goHome();
    }
  }

  /**
   *
   * @returns {number}
   */
  getZoom() {
    return this.webPanel.zoom;
  }

  zoomOut() {
    this.webPanel.zoomOut(this.isUnloaded());
  }

  zoomIn() {
    this.webPanel.zoomIn(this.isUnloaded());
  }

  /**
   *
   * @param {number} zoom
   */
  setZoom(zoom) {
    this.webPanel.setZoom(zoom, this.isUnloaded());
  }

  resetZoom() {
    this.webPanel.setZoom(1, this.isUnloaded());
  }

  /**
   *
   * @param {boolean} value
   */
  setLoadOnStartup(value) {
    this.webPanel.loadOnStartup = value;
  }

  /**
   *
   * @returns {boolean}
   */
  getUnloadOnClose() {
    return this.webPanel.unloadOnClose;
  }

  /**
   *
   * @param {boolean} value
   */
  setUnloadOnClose(value) {
    this.webPanel.unloadOnClose = value;
  }

  /**
   *
   * @param {boolean} value
   */
  setHideToolbar(value) {
    this.webPanel.hideToolbar = value;
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
   */
  go(url) {
    this.webPanel.go(url);
  }

  /**
   *
   * @returns {HTMLElement}
   */
  getInsertedBeforeXUL() {
    return this.button.nextSibling;
  }

  /**
   *
   * @returns {boolean}
   */
  isActive() {
    const tab = SidebarElements.webPanelsBrowser.getWebPanelTab(this.getUUID());
    return tab && tab.isActive();
  }

  remove() {
    SidebarElements.webPanelsBrowser.removeWebPanelTab(this.getUUID());
    this.#button.remove();
  }

  /**
   *
   * @returns {WebPanelSettings}
   */
  dumpSettings() {
    return this.#settings;
  }
}
