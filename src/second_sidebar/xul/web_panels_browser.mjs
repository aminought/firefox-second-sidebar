import { AppConstantsWrapper } from "../wrappers/app_constants.mjs";
import { Browser } from "./base/browser.mjs";
import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { SessionStoreWrapper } from "../wrappers/session_store.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { Style } from "./base/style.mjs";
import { Tab } from "./base/tab.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "./web_panel_tab.mjs";
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
    const selectors = [
      "#PersonalToolbar",
      // "#navigator-toolbox",
      "#context-bookmarkpage",
      "#context-viewsource",
    ];

    // Hide elements right after initialization
    for (const selector of selectors) {
      windowRoot.querySelector(selector).hide();
    }

    // Constantly hide elements
    const style = new Style(`
      ${selectors.join(", ")} {
        display: none;
      }
    `);
    windowRoot.appendChild(style);

    // Shrink to fit
    windowRoot.setProperty("min-width", "0px");

    // Disable key bindings
    windowRoot.querySelector("#tabbrowser-tabbox").element.handleCtrlTab =
      false;
  }

  /**
   *
   * @param {string} type
   * @param {function(WebPanelTab):void} callback
   */
  addTabBrowserEventListener(type, callback) {
    this.waitInitialization(() => {
      this.window.gBrowser.addEventListener(type, (event) => {
        const browser = new Browser({ element: event.target });
        const tab = this.window.gBrowser.getTabForBrowser(browser);
        callback(WebPanelTab.fromTab(tab));
      });
    });
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
  findWebPanelTabIndex(uuid) {
    return this.window.gBrowser.tabs.findIndex(
      (tab) => WebPanelTab.fromTab(tab).uuid === uuid,
    );
  }

  /**
   *
   * @param {WebPanelSettings} webPanelSettings
   * @param {object} progressListener
   */
  addWebPanelTab(webPanelSettings, progressListener) {
    this.waitInitialization(() => {
      const tab = WebPanelTab.fromTab(
        this.window.gBrowser.addTab(webPanelSettings.url, {
          triggeringPrincipal:
            ScriptSecurityManagerWrapper.getSystemPrincipal(),
          userContextId: webPanelSettings.userContextId,
        }),
      );
      tab.uuid = webPanelSettings.uuid;
      tab.linkedBrowser.addProgressListener(progressListener);

      // We need to add progress listener when loading unloaded tab
      tab.addEventListener("TabBrowserInserted", () => {
        tab.linkedBrowser.addProgressListener(progressListener);
      });
    });
  }

  /**
   *
   * @param {string} uuid
   * @param {object} progressListener
   */
  addWebPanelProgressListener(uuid, progressListener) {
    const webPanelTab = this.getWebPanelTab(uuid);
    webPanelTab.linkedBrowser.addProgressListener(progressListener);
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanelTab?}
   */
  getWebPanelTab(uuid) {
    const tabIndex = this.findWebPanelTabIndex(uuid);
    if (tabIndex === -1) {
      console.log(`Cannot get tab: panel ${uuid} is not loaded`);
      return null;
    }
    return WebPanelTab.fromTab(this.window.gBrowser.tabs[tabIndex]);
  }

  /**
   *
   * @returns {WebPanelTab}
   */
  getActiveWebPanelTab() {
    return WebPanelTab.fromTab(this.window.gBrowser.selectedTab);
  }

  /**
   *
   * @param {string} uuid
   */
  selectWebPanelTab(uuid) {
    const tabIndex = this.findWebPanelTabIndex(uuid);
    if (tabIndex === -1) {
      console.log(`Cannot select tab: panel ${uuid} is not loaded`);
      return;
    }
    this.window.gBrowser.selectTabAtIndex(tabIndex);
  }

  deselectWebPanelTab() {
    this.window.gBrowser.selectTabAtIndex(FIRST_TAB_INDEX);
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
      this.window.gBrowser.discardBrowser(tab, true);
      return true;
    }
    return false;
  }

  waitInitialization(callback) {
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
