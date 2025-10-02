import { SidebarElements } from "../sidebar_elements.mjs";

export function showSidebarBoxPositionHint() {
  const marginTop = SidebarElements.sidebarBox.getProperty("margin-top");
  const marginLeft = SidebarElements.sidebarBox.getProperty("margin-left");
  const marginRight = SidebarElements.sidebarBox.getProperty("margin-right");
  const marginBottom = SidebarElements.sidebarBox.getProperty("margin-bottom");
  const width = SidebarElements.sidebarBox.getProperty("width");
  const height = SidebarElements.sidebarBox.getProperty("height");

  const parts = [];
  if (marginTop !== "unset")
    parts.push(`${Math.round(parseFloat(marginTop))}px`);
  if (marginBottom !== "unset")
    parts.push(`${Math.round(parseFloat(marginBottom))}px`);
  if (marginLeft !== "unset")
    parts.push(`${Math.round(parseFloat(marginLeft))}px`);
  if (marginRight !== "unset")
    parts.push(`${Math.round(parseFloat(marginRight))}px`);
  parts.push(`${Math.round(parseFloat(width))}px`);
  parts.push(`${Math.round(parseFloat(height))}px`);

  const hint = `offset: ${parts[0]}, ${parts[1]}; size: ${parts[2]} x ${parts[3]};`;
  SidebarElements.sidebarHint.setText(hint);
}
