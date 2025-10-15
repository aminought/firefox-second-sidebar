import { Label } from "./base/label.mjs";
import { Tooltip } from "./base/tooltip.mjs";

export class WebPanelTooltip extends Tooltip {
  constructor() {
    super({
      id: "sb2-web-panel-tooltip",
    });

    this.titleLabel = new Label({
      id: "sb2-web-panel-tooltip-title",
    });
    this.urlLabel = new Label({
      id: "sb2-web-panel-tooltip-url",
    });

    this.#compose();
  }

  #compose() {
    this.appendItems(this.titleLabel, this.urlLabel);
  }

  /**
   *
   * @param {string} title
   * @returns {WebPanelTooltip}
   */
  setTitle(title) {
    this.titleLabel.setText(title);
    return this;
  }

  /**
   *
   * @param {string} url
   * @returns {WebPanelTooltip}
   */
  setUrl(url) {
    this.urlLabel.setText(url);
    return this;
  }

  /**
   *
   * @returns {WebPanelTooltip}
   */
  hideContent() {
    this.titleLabel.hide();
    this.urlLabel.hide();
    return this;
  }

  /**
   *
   * @returns {WebPanelTooltip}
   */
  showTitle() {
    this.titleLabel.show();
    return this;
  }

  /**
   *
   * @returns {WebPanelTooltip}
   */
  showUrl() {
    this.urlLabel.show();
    return this;
  }
}
