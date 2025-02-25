import { XULElement } from "./xul_element.mjs";

export class MenuPopup extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "menupopup", id, classList });

    this.addEventListener("popupshowing", () =>
      this.toggleAttribute("panelopen", true),
    );
    this.addEventListener("popuphiding", () =>
      this.toggleAttribute("panelopen", false),
    );
  }
}
