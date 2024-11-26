import { XULElement } from "./xul_element.mjs";

export class ToolbarButton extends XULElement {
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
  }

  /**
   *
   * @param {string} url
   * @returns {ToolbarButton}
   */
  setIcon(url) {
    return this.setAttribute("image", url);
  }

  /**
   *
   * @returns {string}
   */
  getIcon() {
    return this.getAttribute("image");
  }

  /**
   *
   * @param {string} value
   * @returns {ToolbarButton}
   */
  setBadged(value) {
    return this.setAttribute("badged", value);
  }

  /**
   *
   * @param {string} value
   * @returns {ToolbarButton}
   */
  setType(value) {
    return this.setAttribute("type", value);
  }

  /**
   *
   * @param {string} value
   * @returns {ToolbarButton}
   */
  setTooltipText(text) {
    return this.setAttribute("tooltiptext", text);
  }

  /**
   *
   * @param {boolean} value
   * @returns {ToolbarButton}
   */
  setDisabled(value) {
    if (value) {
      this.setAttribute("disabled", true);
    } else {
      this.removeAttribute("disabled");
    }
    return true;
  }
}
