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

    SidebarElements.webPanelTooltip.setTitle(title).setUrl(url).hideContent();

    const tooltipSetting =
      SidebarControllers.sidebarController.getWebPanelTooltip();
    if (tooltipSetting === "title" && title) {
      tooltip.showTitle().show();
    } else if (tooltipSetting === "url") {
      tooltip.showUrl().show();
    } else if (tooltipSetting === "titleandurl") {
      tooltip.showTitle().showUrl().show();
    } else {
      tooltip.hide();
    }
    SidebarElements.webPanelTooltip.openPopup(webPanelController.button.button);
  }

  hidePopup() {
    SidebarElements.webPanelTooltip.hidePopup();
  }
}
