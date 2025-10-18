import { AppConstantsWrapper } from "../wrappers/app_constants.mjs";
import { Browser } from "./base/browser.mjs";
import { BrowserCommandsWrapper } from "../wrappers/browser_commands.mjs";
import { ObserversWrapper } from "../wrappers/observers.mjs";
import { PopupNotificationsPatcher } from "../patchers/popup_notifications_patcher.mjs";
import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { SessionStoreWrapper } from "../wrappers/session_store.mjs";
import { Style } from "./base/style.mjs";
import { UrlbarInputPatcher } from "../patchers/urlbar_input_patcher.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs"; // eslint-disable-line no-unused-vars
import { WebPanelState } from "../settings/web_panel_state.mjs"; // eslint-disable-line no-unused-vars
import { WebPanelTab } from "./web_panel_tab.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
import { WindowWrapper } from "../wrappers/window.mjs"; // eslint-disable-line no-unused-vars
import { XULElement } from "./base/xul_element.mjs";

const BEFORE_SHOW_EVENT = "browser-window-before-show";
const INITIALIZED_EVENT = "browser-delayed-startup-finished";
const DOM_WINDOW_CLOSED_EVENT = "domwindowclosed";
const DIALOG_OPEN_EVENT = "dialogopen";

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
      chromehidden: "",
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
      this.#hackSessionStore();
      this.#hackCloseWindowCommand();
      this.initialized = true;
      console.log(`${this.window.name}: web panels browser initialized`);
    }
  }

  /**
   *
   * @param {boolean} dontRestoreTabs
   */
  #hackSessionStore(dontRestoreTabs = true) {
    // Hack SessionStore to prevent restoring hidden window
    if (dontRestoreTabs) SessionStoreWrapper.maybeDontRestoreTabs(this.window);
    ObserversWrapper.notifyObservers(this.window.raw, DOM_WINDOW_CLOSED_EVENT);
  }

  #hackCloseWindowCommand() {
    // Hack browser commands to hack SessionStore
    // and remove sb2-web-panels-browser before closing window
    const elements = document.querySelectorAll('[command="cmd_closeWindow"]');
    for (const element of elements) {
      element.removeAttribute("command");
      element.addEventListener("click", (e) => {
        this.#hackSessionStore(false);
        this.remove();
        BrowserCommandsWrapper.tryToCloseWindow(e);
      });
    }
  }

  initWindow() {
    const windowRoot = new XULElement({
      element: this.window.document.documentElement,
    });
    windowRoot.setAttribute("chromehidden", "");

    const selectors = [
      "#PersonalToolbar",
      "#navigator-toolbox",
      "#sidebar-main",
      "#sidebar-launcher-splitter",
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

    // Position popups
    windowRoot.querySelector("#mainPopupSet").setProperty("margin-left", "8px");
    windowRoot
      .querySelector("#notification-popup")
      .setProperty("margin-top", "8px");

    // Add class for userChrome.css
    windowRoot.addClass("sb2-webpanels-window");

    // Close first dialog window within first 5 seconds
    this.#listenToFirstDialogAndClose();

    // Patch PopupNotifications
    PopupNotificationsPatcher.patch();

    // Patch #urlbar-input
    UrlbarInputPatcher.patch();
  }

  #listenToFirstDialogAndClose() {
    const closeDialog = () => {
      this.window.gDialogBox.closeDialog();
      this.window.removeEventListener(DIALOG_OPEN_EVENT, closeDialog);
    };
    this.window.addEventListener(DIALOG_OPEN_EVENT, closeDialog);
    setTimeout(() => {
      this.window.removeEventListener(DIALOG_OPEN_EVENT, closeDialog);
    }, 5000);
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
      this.window.gBrowser.addTab("about:blank", {
        triggeringPrincipal: ScriptSecurityManagerWrapper.getSystemPrincipal(),
        userContextId: webPanelSettings.userContextId,
      }),
    );
    tab.uuid = webPanelSettings.uuid;
    tab.linkedBrowser.addProgressListener(progressListener);

    // We need to add progress listener when loading unloaded tab
    tab.addTabBrowserInsertedListener(() => {
      tab.linkedBrowser.addProgressListener(progressListener);
    });

    // Set user agent
    if (webPanelSettings.mobile) {
      tab.linkedBrowser.setMobileUserAgent();
    } else {
      tab.linkedBrowser.unsetMobileUserAgent();
    }

    // Set zoom
    tab.linkedBrowser.setZoom(webPanelSettings.zoom);

    return tab;
  }

  /**
   *
   * @returns {WebPanelTab?}
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
