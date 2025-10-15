import { CustomizableUIWrapper } from "../../wrappers/customizable_ui.mjs";
import { ToolbarButton } from "./toolbar_button.mjs";
import { XULElement } from "./xul_element.mjs"; // eslint-disable-line no-unused-vars

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
      this.wrapper = CustomizableUIWrapper.createWidget({
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
   * @returns {boolean}
   */
  get isWrapped() {
    return (
      this.button.parentElement &&
      this.button.parentElement.tagName === "toolbarpaletteitem"
    );
  }

  /**
   *
   * @returns {XULElement?}
   */
  get parentElement() {
    return this.button.parentElement;
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
   * @param {string} event
   * @param {function(MouseEvent):void} callback
   * @returns {Widget}
   */
  addEventListener(event, callback) {
    return this.doWhenButtonReady(() => {
      this.button.addEventListener(event, callback);
    });
  }

  /**
   *
   * @param {string} iconURL
   * @returns {Widget}
   */
  setIcon(iconURL) {
    return this.doWhenButtonReady(() => {
      this.iconURL = iconURL;
      this.button.setIcon(iconURL);
    });
  }

  /**
   *
   * @param {string} iconURL
   * @returns {Widget}
   */
  setLabel(text) {
    this.doWhenButtonReady(() => {
      this.label = text;
      this.button.setLabel(text);
    });
    return this;
  }

  /**
   *
   * @param {string} iconURL
   * @returns {Widget}
   */
  setTooltipText(text) {
    this.doWhenButtonReady(() => {
      this.tooltipText = text;
      this.button.setTooltipText(text);
    });
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
    this.doWhenButtonReady(() => {
      this.unloaded = value;
      this.button.setUnloaded(value);
    });
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
    this.doWhenButtonReady(() => {
      this.open = value;
      this.button.setOpen(value);
    });
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {Widget}
   */
  setDisabled(value) {
    this.doWhenButtonReady(() => {
      this.open = value;
      this.button.setDisabled(value);
    });
    return this;
  }

  /**
   *
   * @param {string} name
   * @param {string} value
   * @returns {Widget}
   */
  setAttribute(name, value) {
    this.doWhenButtonReady(() => {
      this.button.setAttribute(name, value);
    });
    return this;
  }

  /**
   *
   * @param {string} name
   * @returns {Widget}
   */
  removeAttribute(name) {
    this.doWhenButtonReady(() => {
      this.button.removeAttribute(name);
    });
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
      if (!this.button) return;
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
      if (!this.button.getImageXUL()) return;
      clearInterval(interval);
      callback();
    }, 100);
    return this;
  }
}
