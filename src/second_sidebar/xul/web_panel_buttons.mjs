import { VBox } from "./base/vbox.mjs";

export class WebPanelButtons extends VBox {
  constructor() {
    super({ id: "sb2-main-web-panel-buttons" });
  }

  /**
   *
   * @param {string} uuid
   * @returns {number}
   */
  indexByUUID(uuid) {
    const webPanelButton = this.element.querySelector(`[uuid="${uuid}"]`);
    return Array.from(this.element.children).indexOf(webPanelButton);
  }
}
