import { BrowserElements } from "../browser_elements.mjs";
import { Div } from "./base/div.mjs";

/**
 * Represents the area where the sidebar box is positioned.
 * This class handles the positioning of the sidebar relative to the main browser tab area.
 */
export class SidebarBoxArea extends Div {
  constructor() {
    super({ id: "sb2-box-area" });
    this.updatePosition();
  }

  /**
   * Updates the position of the sidebar box area to match the dimensions
   * and position of the main browser tab area.
   * @returns {SidebarBoxArea} This instance for method chaining.
   */
  updatePosition() {
    const rect = BrowserElements.tabbrowserTabbox.getBoundingClientRect();
    this.setProperty("left", `${rect.left}px`)
      .setProperty("top", 0)
      .setProperty("width", `${rect.width}px`)
      .setProperty("height", `${rect.height}px`);
    return this;
  }
}
