import { Div } from "./base/div.mjs";
import { Label } from "./base/label.mjs";
import { Panel } from "./base/panel.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { ToolbarButton } from "./base/toolbar_button.mjs"; // eslint-disable-line no-unused-vars

export class WebPanelTooltip extends Panel {
  constructor() {
    super({
      id: "sb2-web-panel-tooltip",
      classList: ["sb2-tooltip"],
    });
    this.setType("arrow").setRole("tooltip").setAttributes({
      orient: "vertical",
      "no-open-on-anchor": "true",
      norolluponanchor: "true",
      consumeoutsideclicks: "false",
      animate: "open",
    });

    this.container = new Div({
      classList: ["sb2-tooltip-container"],
    });
    this.titleLabel = new Label({
      id: "sb2-web-panel-tooltip-title",
    });
    this.urlLabel = new Label({
      id: "sb2-web-panel-tooltip-url",
    });

    this.appendChild(
      this.container.appendChildren(this.titleLabel, this.urlLabel),
    );
  }

  /**
   *
   * @param {ToolbarButton} target
   * @returns {Panel}
   */
  openPopup(target) {
    const uuid = target.id;
    const webPanelController = SidebarControllers.webPanelsController.get(uuid);

    const title = webPanelController.getTitle();
    const url = webPanelController.getUrlForTooltip();

    this.titleLabel.setText(title).hide();
    this.urlLabel.setText(url).hide();

    const tooltip = SidebarControllers.sidebarController.getWebPanelTooltip();
    tooltip === "off" ? this.hide() : this.show();
    if (tooltip === "title" && title) {
      this.titleLabel.show();
    } else if (tooltip === "url") {
      this.urlLabel.show();
    } else if (tooltip === "titleandurl") {
      this.titleLabel.show();
      this.urlLabel.show();
    }

    return Panel.prototype.openPopup.call(this, target);
  }
}
