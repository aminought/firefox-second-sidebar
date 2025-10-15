import { Tab } from "./base/tab.mjs";
import { WebPanelBrowser } from "./web_panel_browser.mjs";

export class WebPanelTab extends Tab {
  /**
   *
   * @param {HTMLElement} element
   */
  constructor(element) {
    super({ element });
  }

  /**
   *
   * @param {Tab} tab
   * @returns {WebPanelTab?}
   */
  static fromTab(tab) {
    if (!tab) return null;
    return new WebPanelTab(tab.getXUL());
  }

  /**
   * @returns {WebPanelBrowser}
   */
  get linkedBrowser() {
    return new WebPanelBrowser(this.element.linkedBrowser);
  }

  /**
   * @returns {string?}
   */
  get uuid() {
    return this.getAttribute("uuid");
  }

  /**
   * @param {string} uuid
   */
  set uuid(uuid) {
    this.setAttribute("uuid", uuid);
  }

  /**
   *
   * @returns {boolean}
   */
  isEmpty() {
    return !this.uuid;
  }

  /**
   *
   * @param {function():void} callback
   */
  addTabBrowserInsertedListener(callback) {
    this.addEventListener("TabBrowserInserted", () => callback());
  }

  /**
   *
   * @param {function():void} callback
   */
  addTabCloseListener(callback) {
    this.addEventListener("TabClose", () => callback());
  }

  /**
   *
   * @param {function(boolean, boolean, boolean, boolean, boolean, boolean):void} callback
   */
  addTabAttrModifiedListener(callback) {
    this.addEventListener("TabAttrModified", (event) => {
      const changed = event.detail?.changed ?? [];
      const soundplaying = changed.includes("soundplaying");
      const muted = changed.includes("muted");
      const image = changed.includes("image");
      const busy = changed.includes("busy");
      const progress = changed.includes("progress");
      const label = changed.includes("label");
      callback(soundplaying, muted, image, busy, progress, label);
    });
  }
}
