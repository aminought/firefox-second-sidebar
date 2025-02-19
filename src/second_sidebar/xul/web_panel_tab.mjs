import { Tab } from "./base/tab.mjs";

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
}
