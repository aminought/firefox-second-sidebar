import { Tab } from "./base/tab.mjs";

export class WebPanelTab extends Tab {
  /**
   *
   * @param {string} uuid
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor(uuid, { id = null, userContextId = 0, classList = [] } = {}) {
    super({ id, classList, userContextId });
    this.setUUID(uuid);
    this.setUserContextId(userContextId);
  }

  /**
   *
   * @param {string} uuid
   * @returns {WebPanelTab}
   */
  setUUID(uuid) {
    return this.setAttribute("uuid", uuid);
  }
  /**
   *
   * @param {string} uuid
   * @returns {WebPanelTab}
   */
  setUserContextId(userContextId) {
    return this.setAttribute("userContextId", userContextId);
  }
}
