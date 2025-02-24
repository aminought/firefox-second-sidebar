import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";

const SHOULD_ANIMATE_ATTRIBUTE = "fullscreenShouldAnimate";

export class FullScreenController {
  constructor() {
    this.sidebarMain = SidebarElements.sidebarMain;
    this.sidebarBox = SidebarElements.sidebarBox;

    this.#setupListeners();
  }

  #setupListeners() {
    const window = new WindowWrapper();
    window.addEventListener("fullscreen", () => {
      const root = new XULElement({ element: window.document.documentElement });
      root.addEventListener("mousemove", this);

      if (window.fullScreen) {
        this.hide(true);
      } else {
        root.removeEventListener("mousemove", this);
        this.show();
      }
    });
  }

  /**
   *
   * @param {MouseEvent} event
   */
  handleEvent(event) {
    if (event.type !== "mousemove") {
      return;
    }
    const root = new XULElement({ element: window.document.documentElement });
    const rootRect = root.getBoundingClientRect();
    const sidebarRect = SidebarElements.sidebarMain.getBoundingClientRect();
    if (this.hidden() && event.screenX > rootRect.width - sidebarRect.width) {
      this.show();
    } else if (
      !this.hidden() &&
      SidebarElements.sidebarBox.hidden() &&
      event.screenX < rootRect.width - 2 * sidebarRect.width
    ) {
      this.hide();
    }
  }

  /**
   *
   * @returns {boolean}
   */
  hidden() {
    return this.sidebarMain.getProperty("margin-right") !== "";
  }

  /**
   *
   * @param {boolean} animate
   */
  hide(animate = false) {
    this.sidebarMain.toggleAttribute(SHOULD_ANIMATE_ATTRIBUTE, animate);
    this.sidebarMain.setProperty(
      "margin-right",
      -this.sidebarMain.getBoundingClientRect().width + "px",
    );
  }

  /**
   *
   * @param {boolean} animate
   */
  show(animate = false) {
    this.sidebarMain.toggleAttribute(SHOULD_ANIMATE_ATTRIBUTE, animate);
    this.sidebarMain.setProperty("margin-right", "");
  }
}
