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
   * @returns {WebPanelTab}
   */
  static fromTab(tab) {
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
  addTabCloseListener(callback) {
    this.addEventListener("TabClose", () => callback());
  }
}
