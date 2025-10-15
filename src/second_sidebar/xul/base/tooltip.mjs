import { Div } from "./div.mjs";
import { Panel } from "./panel.mjs";

export class Tooltip extends Panel {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({
      id,
      classList: ["sb2-tooltip", ...classList],
    });
    this.setType("arrow").setRole("tooltip").setAttributes({
      orient: "vertical",
      "no-open-on-anchor": "true",
      noautofocus: "true",
      norolluponanchor: "true",
      consumeoutsideclicks: "false",
      animate: "open",
    });

    this.container = new Div({
      classList: ["sb2-tooltip-container"],
    });
    this.appendChild(this.container);
  }

  /**
   *
   * @param {XULElement} item
   * @returns {Tooltip}
   */
  appendItem(item) {
    this.container.appendChild(item);
    return this;
  }

  /**
   *
   * @param {Array<XULElement>} items
   * @returns {Tooltip}
   */
  appendItems(...items) {
    items.forEach((item) => this.appendItem(item));
    return this;
  }
}
