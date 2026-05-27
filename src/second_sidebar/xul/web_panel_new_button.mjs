import { L } from "../i18n/index.mjs";
import { Widget } from "./base/widget.mjs";

const ICON = "chrome://global/skin/icons/plus.svg";

export class WebPanelNewButton extends Widget {
  constructor() {
    super({
      id: "new-web-panel",
      label: L.newButton.newPanel,
      tooltipText: L.newButton.newPanel,
      iconURL: ICON,
    });
  }
}
