import { ToolbarButton } from "./toolbar_button.mjs";

export class Widget {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {string[]} params.classList
   * @param {string?} params.label
   * @param {string?} params.tooltipText
   * @param {string?} params.iconURL
   * @param {boolean} params.open
   * @param {boolean} params.unloaded
   * @param {string?} params.context
   * @param {string?} params.position
   */
  constructor({
    id,
    classList = [],
    label,
    tooltipText,
    iconURL,
    open = false,
    unloaded = true,
    context = null,
    position = null,
  }) {
    this.button = null;
    this.onClick = null;
    this.iconURL = iconURL;
    this.label = label;
    this.tooltipText = tooltipText;
    this.open = open;
    this.unloaded = unloaded;
    this.widget = CustomizableUI.createWidget({
      id,
      type: "button",
      localized: false,
      onCreated: (element) => {
        this.button = new ToolbarButton({ element, classList });
        this.button.setOpen(this.open);
        this.button.setUnloaded(this.unloaded);
        if (this.iconURL) {
          this.button.setIcon(this.iconURL);
        }
        if (this.label) {
          this.button.setLabel(this.label);
        }
        if (this.tooltipText) {
          this.button.setTooltipText(this.tooltipText);
        }
        if (context) {
          this.button.setContext(context);
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
    if (this.button) {
      this.button.setIcon(this.iconURL);
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
    if (this.button) {
      this.button.setLabel(this.label);
    }
    return this;
  }

  /**
   *
   * @param {string} iconURL
   * @returns {Widget}
   */
  setTooltipText(text) {
    this.tooltipText = text;
    if (this.button) {
      this.button.setTooltipText(this.tooltipText);
    }
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  isUnloaded() {
    return this.unloaded;
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  setUnloaded(value) {
    this.unloaded = value;
    if (this.button) {
      this.button.setUnloaded(value);
    }
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  isOpen() {
    return this.open;
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  setOpen(value) {
    this.open = value;
    if (this.button) {
      this.button.setOpen(value);
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
    if (this.button) {
      this.button.setAttribute(name, value);
    }
    return this;
  }

  /**
   *
   * @returns {HTMLElement?}
   */
  getXUL() {
    return this.button?.getXUL();
  }

  /**
   *
   * @returns {Widget}
   */
  remove() {
    CustomizableUI.destroyWidget(this.button.id);
    return this;
  }

  /**
   *
   * @param {function():void} callback
   * @returns {Widget}
   */
  doWhenButtonReady(callback) {
    const interval = setInterval(() => {
      if (!this.button) {
        return;
      }
      clearInterval(interval);
      callback();
    }, 100);
    return this;
  }
}
