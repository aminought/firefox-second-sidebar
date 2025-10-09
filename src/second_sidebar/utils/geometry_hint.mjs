import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export function showFloatingGeometryHint() {
  if (!SidebarControllers.sidebarGeometry.enableSidebarBoxHint) return;

  const top = parseProperty("top");
  const left = parseProperty("left");
  const right = parseProperty("right");
  const bottom = parseProperty("bottom");
  const width = parseProperty("width");
  const height = parseProperty("height");

  const parts = [];
  if (left !== null) parts.push(left);
  if (right !== null) parts.push(right);
  if (top !== null) parts.push(top);
  if (bottom !== null) parts.push(bottom);

  const webPanelController = SidebarControllers.webPanelsController.getActive();
  let anchor = webPanelController.getAnchor();
  if (anchor === "default") {
    anchor = SidebarControllers.sidebarGeometry.getDefaultAnchor();
  }

  const hint = `anchor: ${anchor}, offset: [${parts[0]} ${parts[1]}], size: [${width} ${height}]`;
  SidebarElements.geometryHint.setText(hint).show();
}

export function showPinnedGeometryHint() {
  if (!SidebarControllers.sidebarGeometry.enableSidebarBoxHint) return;
  const width = parseProperty("width");
  const hint = `width: ${width}`;
  SidebarElements.geometryHint.setText(hint).show();
}

export function hideGeometryHint() {
  SidebarElements.geometryHint.hide();
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
  if (value.endsWith("%") || value.endsWith("vw") || value.endsWith("vh")) {
    return Math.round(parseFloat(value)) + "%";
  }
  return "default";
}
