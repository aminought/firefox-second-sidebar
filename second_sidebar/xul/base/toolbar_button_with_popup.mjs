import { MenuItem } from "./menu_item.mjs";
import { MenuPopup } from "./menu_popup.mjs";
import { ToolbarButton } from "./toolbar_button.mjs";
import { XULElement } from "./xul_element.mjs";

export class ToolbarButtonWithPopup extends ToolbarButton {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super("toolbarbutton", {
      id,
      classList: [...classList, "toolbarbutton-1"],
    });
    this.setAttribute('type', 'menu');
    this.popupElement = new MenuPopup();
    this.appendChild(this.popupElement);
  }

  /**
   * 
   * @param {MenuPopup|MenuItem} params 
   * @returns {MenuPopup|MenuItem}
   */
  appendChildToPopup (element) {
    if (element instanceof MenuItem || element instanceof MenuPopup) {
      return this.popupElement.appendChild(element);
    }
    return this;
  }
}
