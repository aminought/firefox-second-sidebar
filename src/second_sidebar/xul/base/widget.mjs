import { XULElement } from "./xul_element.mjs";

export class Widget {
  constructor({
    id,
    classList = [],
    label,
    icon,
    context = null,
    position = null,
  }) {
    this.element = null;
    this.onClick = null;
    this.icon = icon;
    this.label = label;
    this.widget = CustomizableUI.createWidget({
      id,
      label,
      type: "button",
      localized: false,
      onCreated: (element) => {
        this.element = new XULElement(null, { element, classList });
        if (this.icon) {
          this.element.setAttribute("image", this.icon);
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
      const placement = CustomizableUI.getPlacementOfWidget('new-web-panel');
      CustomizableUI.addWidgetToArea(id, placement.area, placement.position + (position === "before" ? 0 : 1));
    }
  }

  setOnClick(callback) {
    this.onClick = callback;
    return this;
  }

  setIcon(icon) {
    this.icon = icon;
    if (this.element) {
      this.element.setAttribute("image", this.icon);
    }
    return this;
  }

  setLabel(text) {
    this.label = text;
    if (this.element) {
      this.element.setAttribute("label", this.label);
      this.element.setAttribute("tooltiptext", this.label);
    }
    return this;
  }

  setAttribute(name, value) {
    if (this.element) {
      this.element.setAttribute(name, value);
    }
    return this;
  }

  getXUL() {
    if (this.element) {
      return this.element.getXUL();
    }
    return null;
  }

  remove() {
    CustomizableUI.destroyWidget(this.element.element.id);
  }
}
