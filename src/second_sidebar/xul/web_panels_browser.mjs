/* eslint-disable no-unused-vars */

import { AppConstantsWrapper } from "../wrappers/app_constants.mjs";
import { Browser } from "./base/browser.mjs";
import { ObserversWrapper } from "../wrappers/observers.mjs";
import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { SessionStoreWrapper } from "../wrappers/session_store.mjs";
import { Style } from "./base/style.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelTab } from "./web_panel_tab.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { XULElement } from "./base/xul_element.mjs";

/* eslint-enable no-unused-vars */

const BEFORE_SHOW_EVENT = "browser-window-before-show";
const INITIALIZED_EVENT = "browser-delayed-startup-finished";

const FIRST_TAB_INDEX = 0;

export class WebPanelsBrowser extends Browser {
  constructor() {
    super({
      id: `sb2-web-panels-browser_${crypto.randomUUID()}`,
      classList: ["sb2-web-panels-browser"],
    });
    this.removeAttributes(["remote", "type"]).setAttributes({
      xmlns: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      messagemanagergroup: "browsers",
      initialBrowsingContextGroupId: "1",
      disableglobalhistory: "true",
      disablehistory: "true",
      disablefullscreen: "true",
      autoscroll: "false",
      tooltip: "aHTMLTooltip",
      autocompletepopup: "PopupAutoComplete",
    });

    this.initialized = false;
  }

  init() {
    if (this.initialized) {
      console.log("Web panels browser is already initialized");
      return;
    }
    console.log("Initializing web panels browser...");
    ObserversWrapper.addObserver(this, BEFORE_SHOW_EVENT);
    ObserversWrapper.addObserver(this, INITIALIZED_EVENT);
    this.setAttribute("src", AppConstantsWrapper.BROWSER_CHROME_URL);
  }

  /**
   *
   * @param {Window} subj
   * @param {string} topic
   */
  observe(subj, topic) {
    if (this.window.name !== subj.name) {
      return;
    }
    console.log(`${this.window.name}: got event ${topic}`);
    if (topic === BEFORE_SHOW_EVENT) {
      ObserversWrapper.removeObserver(this, BEFORE_SHOW_EVENT);
      this.initWindow();
    } else if (topic === INITIALIZED_EVENT) {
      ObserversWrapper.removeObserver(this, INITIALIZED_EVENT);
      SessionStoreWrapper.maybeDontRestoreTabs(this.window);
      this.initialized = true;
      console.log(`${this.window.name}: web panels browser initialized`);
    }
  }

  initWindow() {
    const windowRoot = new XULElement({
      element: this.window.document.documentElement,
    });
    const selectors = [
      "#PersonalToolbar",
      "#navigator-toolbox",
      "#sidebar-main",
      "#sidebar-wrapper",
      "#sidebar-box",
      "#context-bookmarkpage",
      "#context-viewsource",
    ];

    // Hide elements right after initialization
    for (const selector of selectors) {
      const element = windowRoot.querySelector(selector);
      if (element) {
        element.hide();
      }
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

    // Full height for content
    windowRoot
      .querySelector("#tabbrowser-tabbox")
      .setProperty("height", "100%");

    // Add class for userChrome.css
    windowRoot.addClass("sb2-webpanels-window");
  }

  /**
   *
   * @param {function(WebPanelTab):void} callback
   */
  addPageTitleChangeListener(callback) {
    this.window.gBrowser.addEventListener("pagetitlechanged", (event) => {
      const browser = new Browser({ element: event.target });
      const tab = this.window.gBrowser.getTabForBrowser(browser);
      callback(WebPanelTab.fromTab(tab));
    });
  }

  /**
   *
   * @param {function():void} callback
   */
  addTabSelectListener(callback) {
    this.window.gBrowser.tabpanels.addEventListener("select", () => callback());
  }

  /**
   *
   * @param {function(WebPanelTab):void} callback
   */
  addZoomChangeListener(callback) {
    this.window.addEventListener("FullZoomChange", (event) => {
      const browser = new Browser({ element: event.target });
      const tab = this.window.gBrowser.getTabForBrowser(browser);
      callback(WebPanelTab.fromTab(tab));
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
   * @param {WebPanelSettings} webPanelSettings
   * @param {object} progressListener
   * @returns {WebPanelTab}
   */
  addWebPanelTab(webPanelSettings, progressListener) {
    const tab = WebPanelTab.fromTab(
      this.window.gBrowser.addTab(webPanelSettings.url, {
        triggeringPrincipal: ScriptSecurityManagerWrapper.getSystemPrincipal(),
        userContextId: webPanelSettings.userContextId,
      }),
    );
    tab.uuid = webPanelSettings.uuid;
    tab.linkedBrowser.addProgressListener(progressListener);

    // We need to add progress listener when loading unloaded tab
    tab.addEventListener("TabBrowserInserted", () => {
      tab.linkedBrowser.addProgressListener(progressListener);
    });

    // Set user agent and reload
    if (webPanelSettings.mobile) {
      tab.linkedBrowser.setMobileUserAgent();
    } else {
      tab.linkedBrowser.unsetMobileUserAgent();
    }
    tab.linkedBrowser.go(webPanelSettings.url);

    // Set zoom
    tab.linkedBrowser.setZoom(webPanelSettings.zoom);

    return tab;
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
   * @param {WebPanelTab} tab
   */
  selectWebPanelTab(tab) {
    this.window.gBrowser.selectedTab = tab;
  }

  deselectWebPanelTab() {
    this.window.gBrowser.selectTabAtIndex(FIRST_TAB_INDEX);
  }

  /**
   *
   * @param {WebPanelTab} tab
   */
  removeWebPanelTab(tab) {
    this.window.gBrowser.removeTab(tab);
  }

  notifyWindowClosedAndRemove() {
    ObserversWrapper.notifyObservers(this.window.raw, "domwindowclosed");
    this.remove();
  }

  /**
   *
   * @param {XULElement} element
   * @returns {boolean}
   */
  activeWebPanelContains(element) {
    const webPanelTab = this.getActiveWebPanelTab();
    return (
      this.window.documentElement?.contains(element) ||
      webPanelTab.linkedBrowser.contentDocument === element.ownerDocument
    );
  }

  /**
   *
   * @param {function():void} callback
   */
  waitInitialization(callback) {
    this.waitUntil(() => this.initialized, callback);
  }

  /**
   *
   * @param {function():boolean} condition
   * @param {function():void} callback
   * @param {number} timeout
   */
  waitUntil(condition, callback, timeout = 10) {
    if (!condition()) {
      setTimeout(() => this.waitUntil(condition, callback, timeout), timeout);
    } else {
      callback();
    }
  }
}
