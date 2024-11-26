import { Tab } from "./base/tab.mjs";

export class WebPanelTab extends Tab {
  /**
   *
   * @param {string} uuid
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor(uuid, { id = null, classList = [] } = {}) {
    super({ id, classList });
    this.setUUID(uuid);
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanelTab}
   */
  setUUID(uuid) {
    return this.setAttribute("uuid", uuid);
  }
}
