import { SidebarElements } from "../sidebar_elements.mjs";

export function showSidebarBoxOffsetHint() {
  const marginTop = SidebarElements.sidebarBox.getProperty("margin-top");
  const marginLeft = SidebarElements.sidebarBox.getProperty("margin-left");
  const marginRight = SidebarElements.sidebarBox.getProperty("margin-right");
  const marginBottom = SidebarElements.sidebarBox.getProperty("margin-bottom");
  let hint = "offset: ";
  if (marginTop !== "unset") hint += `${Math.round(parseFloat(marginTop))}px `;
  if (marginBottom !== "unset")
    hint += `${Math.round(parseFloat(marginBottom))}px `;
  if (marginLeft !== "unset")
    hint += `${Math.round(parseFloat(marginLeft))}px `;
  if (marginRight !== "unset")
    hint += `${Math.round(parseFloat(marginRight))}px `;
  SidebarElements.sidebarHint.setText(hint);
}
