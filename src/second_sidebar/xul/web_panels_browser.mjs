import { AppConstantsWrapper } from "../wrappers/app_constants.mjs";
import { Browser } from "./base/browser.mjs";
import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { SessionStoreWrapper } from "../wrappers/session_store.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { Tab } from "./base/tab.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { XULElement } from "./base/xul_element.mjs";

const BEFORE_SHOW_EVENT = "browser-window-before-show";
const INITIALIZED_EVENT = "browser-delayed-startup-finished";
const BROWSER_QUIT_EVENT = "quit-application-granted";

const FIRST_TAB_INDEX = 0;

export class WebPanelsBrowser extends Browser {
  constructor() {
    super({
      id: `sb2-web-panels-browser_${crypto.randomUUID()}`,
      classList: ["sb2-web-panels-browser"],
    });
    this.removeAttribute("remote")
      .removeAttribute("type")
      .setAttribute(
        "xmlns",
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      )
      .setAttribute("messagemanagergroup", "browsers")
      .setAttribute("initialBrowsingContextGroupId", "1")
      .setAttribute("disableglobalhistory", "true")
      .setAttribute("disablehistory", "true")
      .setAttribute("disablefullscreen", "true")
      .setAttribute("autoscroll", "false")
      .setAttribute("tooltip", "aHTMLTooltip")
      .setAttribute("autocompletepopup", "PopupAutoComplete");

    this.initialized = false;
  }

  init() {
    if (this.initialized) {
      console.log("Web panels browser is already initialized");
      return;
    }
    console.log("Initializing web panels browser...");
    Services.obs.addObserver(this, BEFORE_SHOW_EVENT);
    Services.obs.addObserver(this, INITIALIZED_EVENT);
    Services.obs.addObserver(this, BROWSER_QUIT_EVENT);
    this.setAttribute("src", AppConstantsWrapper.BROWSER_CHROME_URL);
  }

  observe(subj, topic, data) {
    console.log(`Got event ${topic}`);
    if (topic === BEFORE_SHOW_EVENT) {
      this.initWindow();
    } else if (topic === INITIALIZED_EVENT) {
      this.initialized = true;
      console.log("Web panels browser initialized");
    } else if (topic === BROWSER_QUIT_EVENT) {
      SessionStoreWrapper.maybeDontRestoreTabs(this.window);
      this.remove();
      console.log("Web panels browser removed");
    }
  }

  initWindow() {
    const windowRoot = new XULElement({
      element: this.window.document.documentElement,
    });
    windowRoot.querySelector("#PersonalToolbar").setProperty("display", "none");
    windowRoot
      .querySelector("#navigator-toolbox")
      .setProperty("display", "none");
    windowRoot.querySelector("#tabbrowser-tabbox").element.handleCtrlTab =
      false;
  }

  /**
   * @returns {WindowWrapper}
   */
  get window() {
    return WindowWatcherWrapper.getWindowByName(this.id);
  }

  /**
   *
   * @param {string} uuid
   * @returns {number}
   */
  findTabIndex(uuid) {
    return this.window.gBrowser.tabs.findIndex(
      (tab) => tab.getAttribute("uuid") === uuid,
    );
  }

  /**
   *
   * @param {WebPanelSettings} webPanelSettings
   */
  addWebPanel(webPanelSettings) {
    this.waitInitialized(() => {
      const tab = this.window.gBrowser.addTab(webPanelSettings.url, {
        triggeringPrincipal: ScriptSecurityManagerWrapper.getSystemPrincipal(),
      });
      tab.setAttribute("uuid", webPanelSettings.uuid);

      const browser = this.window.gBrowser.getBrowserForTab(tab);

      browser.addProgressListener(() => {
        browser.setZoom(webPanelSettings.zoom);
        if (tab.isActive()) {
          const canGoBack = browser.canGoBack();
          const canGoForward = browser.canGoForward();
          const title = browser.getTitle();
          SidebarControllers.sidebarController.setToolbarBackButtonDisabled(
            !canGoBack,
          );
          SidebarControllers.sidebarController.setToolbarForwardButtonDisabled(
            !canGoForward,
          );
          SidebarControllers.sidebarController.setToolbarTitle(title);
        }
      });
    });
  }

  /**
   *
   * @param {string} uuid
   * @returns {Tab?}
   */
  getWebPanelTab(uuid) {
    const tabIndex = this.findTabIndex(uuid);
    if (tabIndex === -1) {
      console.log(`Cannot get tab: panel ${uuid} is not loaded`);
      return null;
    }
    return this.window.gBrowser.tabs[tabIndex];
  }

  /**
   *
   * @param {Tab} tab
   * @returns {Browser?}
   */
  getWebPanelBrowserForTab(tab) {
    const browser = this.window.gBrowser.getBrowserForTab(tab);
    if (browser) {
      return browser;
    }
    return null;
  }

  /**
   *
   * @param {string} uuid
   */
  selectWebPanelTab(uuid) {
    const tabIndex = this.findTabIndex(uuid);
    if (tabIndex === -1) {
      console.log(`Cannot select tab: panel ${uuid} is not loaded`);
      return;
    }
    this.window.gBrowser.selectTabAtIndex(tabIndex);
  }

  /**
   *
   * @param {string} uuid
   * @returns {boolean}
   */
  removeWebPanelTab(uuid) {
    const tab = this.getWebPanelTab(uuid);
    if (tab) {
      this.window.gBrowser.removeTab(tab);
      return true;
    }
    return false;
  }

  /**
   *
   * @param {string} uuid
   * @returns {boolean}
   */
  unloadWebPanelTab(uuid) {
    const tab = this.getWebPanelTab(uuid);
    if (tab) {
      this.window.gBrowser.selectTabAtIndex(FIRST_TAB_INDEX);
      this.window.gBrowser.discardBrowser(tab, true);
      return true;
    }
    return false;
  }

  waitInitialized(callback) {
    this.waitUntil(() => this.initialized, callback);
  }

  waitUntil(condition, callback, timeout = 10) {
    if (!condition()) {
      setTimeout(() => this.waitUntil(condition, callback, timeout), timeout);
    } else {
      callback();
    }
  }
}
