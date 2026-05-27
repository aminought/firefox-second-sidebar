import { L } from "../i18n/index.mjs";
import { Widget } from "./base/widget.mjs";

export class SidebarCollapseButton extends Widget {
  constructor() {
    super({
      id: "sb2-collapse-button",
      label: L.collapse.sidebar,
      tooltipText: L.collapse.sidebar,
    });
  }
}
