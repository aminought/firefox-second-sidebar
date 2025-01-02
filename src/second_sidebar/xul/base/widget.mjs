import { XULElement } from "./xul_element.mjs";

export class Widget {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {string[]} params.classList
   * @param {string?} params.iconURL
   * @param {string?} params.context
   * @param {string?} params.position
   */
  constructor({
    id,
    classList = [],
    label,
    iconURL,
    context = null,
    position = null,
  }) {
    this.element = null;
    this.onClick = null;
    this.iconURL = iconURL;
    this.label = label;
    this.widget = CustomizableUI.createWidget({
      id,
      label,
      type: "button",
      localized: false,
      onCreated: (element) => {
        this.element = new XULElement(null, { element, classList });
        if (this.iconURL) {
          this.element.setAttribute("image", this.iconURL);
        }
        if (this.label) {
          this.element.setAttribute("label", this.label);
          this.element.setAttribute("tooltiptext", this.label);
        }
        if (context) {
          this.element.setContext(context);
        }
      },
      onClick: (event) => {
        if (this.onClick) {
          this.onClick(event);
        }
      },
    });
    if (position) {
      const placement = CustomizableUI.getPlacementOfWidget("new-web-panel");
      CustomizableUI.addWidgetToArea(
        id,
        placement.area,
        placement.position + (position === "before" ? 0 : 1),
      );
    }
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {Widget}
   */
  setOnClick(callback) {
    this.onClick = callback;
    return this;
  }

  /**
   *
   * @param {string} iconURL
   * @returns {Widget}
   */
  setIcon(iconURL) {
    this.iconURL = iconURL;
    if (this.element) {
      this.element.setAttribute("image", this.iconURL);
    }
    return this;
  }

  /**
   *
   * @param {string} iconURL
   * @returns {Widget}
   */
  setLabel(text) {
    this.label = text;
    if (this.element) {
      this.element.setAttribute("label", this.label);
      this.element.setAttribute("tooltiptext", this.label);
    }
    return this;
  }

  /**
   *
   * @param {string} name
   * @param {string} value
   * @returns {Widget}
   */
  setAttribute(name, value) {
    if (this.element) {
      this.element.setAttribute(name, value);
    }
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  getXUL() {
    if (this.element) {
      return this.element.getXUL();
    }
    return null;
  }

  /**
   *
   * @returns {Widget}
   */
  remove() {
    CustomizableUI.destroyWidget(this.element.element.id);
    return this;
  }
}
