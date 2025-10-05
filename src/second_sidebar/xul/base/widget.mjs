import { CustomizableUIWrapper } from "../../wrappers/customizable_ui.mjs";
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
    this.id = id;
    this.classList = classList;
    this.label = label;
    this.tooltipText = tooltipText;
    this.iconURL = iconURL;
    this.open = open;
    this.unloaded = unloaded;
    this.context = context;
    this.onClick = null;
    try {
      this.widget = CustomizableUIWrapper.createWidget({
        id,
        onCreated: async (element) => {
          console.log(`Widget ${id} was created`);
          this.#setup(new ToolbarButton({ element, classList }));
        },
        onClick: async (event) => {
          if (this.onClick) {
            this.onClick(event);
          }
        },
      });
    } catch {
      console.log(`Widget ${id} is already created`);
      this.#setup(this.button);
    }
    if (position) {
      const placement =
        CustomizableUIWrapper.getPlacementOfWidget("new-web-panel");
      CustomizableUIWrapper.addWidgetToArea(
        id,
        placement.area,
        placement.position + (position === "before" ? 0 : 1),
      );
    }
  }

  /**
   * @returns {ToolbarButton?}
   */
  get button() {
    const widget = CustomizableUIWrapper.getWidget(this.id);
    if (!widget) {
      return null;
    }
    const instance = widget.forWindow(window);
    if (!instance) {
      return null;
    }
    return new ToolbarButton({
      element: instance.node,
      classList: this.classList,
    });
  }

  /**
   *
   * @param {ToolbarButton} button
   */
  #setup(button) {
    button.setBadged(true);
    button.setOpen(this.open);
    button.setUnloaded(this.unloaded);
    if (this.iconURL) {
      button.setIcon(this.iconURL);
    }
    if (this.label) {
      button.setLabel(this.label);
    }
    if (this.tooltipText) {
      button.setTooltipText(this.tooltipText);
    }
    if (this.context) {
      button.setContext(this.context);
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
    const button = this.button;
    if (button) {
      button.setIcon(this.iconURL);
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
    const button = this.button;
    if (button) {
      button.setLabel(this.label);
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
    const button = this.button;
    if (button) {
      button.setTooltipText(this.tooltipText);
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
   * @returns {Widget}
   */
  setUnloaded(value) {
    this.unloaded = value;
    const button = this.button;
    if (button) {
      button.setUnloaded(value);
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
   * @returns {Widget}
   */
  setOpen(value) {
    this.open = value;
    const button = this.button;
    if (button) {
      button.setOpen(value);
    }
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {Widget}
   */
  setDisabled(value) {
    this.open = value;
    const button = this.button;
    if (button) {
      button.setDisabled(value);
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
    const button = this.button;
    if (button) {
      button.setAttribute(name, value);
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
    CustomizableUIWrapper.destroyWidget(this.id);
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

  /**
   *
   * @param {function():void} callback
   * @returns {Widget}
   */
  doWhenButtonImageReady(callback) {
    const interval = setInterval(() => {
      if (!this.button.getImageXUL()) {
        return;
      }
      clearInterval(interval);
      callback();
    }, 100);
    return this;
  }
}
