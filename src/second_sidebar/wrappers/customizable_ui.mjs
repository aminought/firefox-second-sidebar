/**
 * @typedef {Object} WidgetInstance
 * @property {HTMLElement} node
 */

/**
 * @typedef {Object} Widget
 * @property {Array<WidgetInstance>} instances
 * @property {function(Window):WidgetInstance} forWindow
 */

export class CustomizableUIWrapper {
  static TYPE_TOOLBAR = "toolbar";
  static TYPE_PANEL = "panel";

  /**
   * @param {string} id
   * @param {object} properties
   * @param {string} properties.type
   * @param {boolean} properties.defaultCollapsed
   * @param {boolean} properties.overflowable
   * @param {Array<string>} properties.defaultPlacements
   */
  static registerArea(
    id,
    {
      type = this.TYPE_TOOLBAR,
      defaultCollapsed = false,
      overflowable = false,
      defaultPlacements = [],
    } = {},
  ) {
    CustomizableUI.registerArea(id, {
      type,
      defaultCollapsed,
      overflowable,
      defaultPlacements,
    });
  }

  /**
   *
   * @param {HTMLElement} node
   */
  static registerToolbarNode(node) {
    CustomizableUI.registerToolbarNode(node);
  }

  /**
   *
   * @param {object} properties
   * @param {string} properties.id
   * @param {string} properties.type
   * @param {boolean} properties.localized
   * @param {function(HTMLElement):void} properties.onCreated
   * @param {function(MouseEvent):void} properties.onClick
   * @returns {object}
   */
  static createWidget({
    id,
    type = "button",
    localized = false,
    onCreated,
    onClick,
  }) {
    return CustomizableUI.createWidget({
      id,
      type,
      localized,
      onCreated,
      onClick,
    });
  }

  /**
   *
   * @param {string} id
   * @returns {Widget}
   */
  static getWidget(id) {
    return CustomizableUI.getWidget(id);
  }

  /**
   *
   * @param {string} id
   */
  static destroyWidget(id) {
    CustomizableUI.destroyWidget(id);
  }

  /**
   *
   * @param {string} id
   * @param {string} area
   * @param {number} position
   */
  static addWidgetToArea(id, area, position) {
    CustomizableUI.addWidgetToArea(id, area, position);
  }

  /**
   *
   * @param {string} id
   * @returns {object}
   */
  static getPlacementOfWidget(id) {
    return CustomizableUI.getPlacementOfWidget(id);
  }
}
