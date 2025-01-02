import { XULElement } from "./xul_element.mjs";

export class Widget {
  constructor({
    id,
    classList = [],
    label,
    tooltiptext,
    icon,
    context = null,
    isNew = false,
  }) {
    this.element = null;
    this.onClick = null;
    this.icon = icon;
    this.widget = CustomizableUI.createWidget({
      id,
      label,
      tooltiptext,
      type: "button",
      localized: false,
      onCreated: (element) => {
        this.element = new XULElement(null, { element, classList });
        if (this.icon) {
          this.element.setAttribute("image", this.icon);
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
    if (isNew) {
      const placement = CustomizableUI.getPlacementOfWidget('new-web-panel');
      CustomizableUI.addWidgetToArea(id, placement.area, placement.position);
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

  setTooltipText(text) {
    if (this.element) {
      this.element.setAttribute("tooltiptext", text);
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
