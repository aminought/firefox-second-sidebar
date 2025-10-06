import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";

export function showSidebarBoxPositionHint() {
  /**
   * @param {string} value
   * @returns {string}
   */
  const parse = (value) => {
    if (value === "unset") return null;
    if (value.endsWith("px")) {
      return Math.round(parseFloat(value)) + "px";
    }
    return "default";
  };

  const marginTop = parse(SidebarElements.sidebarBox.getProperty("margin-top"));
  const marginLeft = parse(
    SidebarElements.sidebarBox.getProperty("margin-left"),
  );
  const marginRight = parse(
    SidebarElements.sidebarBox.getProperty("margin-right"),
  );
  const marginBottom = parse(
    SidebarElements.sidebarBox.getProperty("margin-bottom"),
  );
  const width = parse(SidebarElements.sidebarBox.getProperty("width"));
  const height = parse(SidebarElements.sidebarBox.getProperty("height"));

  const webPanelController = SidebarControllers.webPanelsController.getActive();
  const attach = webPanelController.getAttach();

  const parts = [];
  if (marginTop !== null) parts.push(marginTop);
  if (marginBottom !== null) parts.push(marginBottom);
  if (marginLeft !== null) parts.push(marginLeft);
  if (marginRight !== null) parts.push(marginRight);

  const hint = `attach: ${attach}, offset: [${parts[0]} ${parts[1]}], size: [${width} ${height}]`;
  SidebarElements.sidebarHint.setText(hint);
}
