import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WebPanelController } from "./web_panel.mjs"; // eslint-disable-line no-unused-vars

export class WebPanelTooltipController {
  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openPopup(webPanelController) {
    const tooltip = SidebarElements.webPanelTooltip;
    const title = webPanelController.getTitle();
    const url = webPanelController.getUrlForTooltip();

    SidebarElements.webPanelTooltip.hideContent();
    SidebarElements.webPanelTooltip.setTitle(title);
    SidebarElements.webPanelTooltip.setUrl(url);

    const tooltipSetting =
      SidebarControllers.sidebarController.getWebPanelTooltip();
    tooltipSetting === "off" ? tooltip.hide() : tooltip.show();
    if (tooltipSetting === "title" && title) {
      tooltip.showTitle();
    } else if (tooltipSetting === "url") {
      tooltip.showUrl();
    } else if (tooltipSetting === "titleandurl") {
      tooltip.showTitle();
      tooltip.showUrl();
    }
    SidebarElements.webPanelTooltip.openPopup(webPanelController.button.button);
  }

  hidePopup() {
    SidebarElements.webPanelTooltip.hidePopup();
  }
}
