import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export function showSidebarBoxPositionHint() {
  const marginTop = parseProperty("margin-top");
  const marginLeft = parseProperty("margin-left");
  const marginRight = parseProperty("margin-right");
  const marginBottom = parseProperty("margin-bottom");
  const width = parseProperty("width");
  const height = parseProperty("height");

  const parts = [];
  if (marginTop !== null) parts.push(marginTop);
  if (marginBottom !== null) parts.push(marginBottom);
  if (marginLeft !== null) parts.push(marginLeft);
  if (marginRight !== null) parts.push(marginRight);

  const webPanelController = SidebarControllers.webPanelsController.getActive();
  const hint = `attach: ${webPanelController.getAttach()}, offset: [${parts[0]} ${parts[1]}], size: [${width} ${height}]`;
  SidebarElements.sidebarHint.setText(hint);
}

/**
 * @param {string} property
 * @returns {string}
 */
function parseProperty(property) {
  const value = SidebarElements.sidebarBox.getProperty(property);
  if (value === "unset") return null;
  if (value.endsWith("px")) {
    return Math.round(parseFloat(value)) + "px";
  }
  return "default";
}
