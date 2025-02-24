import { SidebarControllers } from "../sidebar_controllers.mjs";
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
    const sidebarRect = this.sidebarMain.getBoundingClientRect();
    const position = SidebarControllers.sidebarController.getPosition();
    if (
      this.hidden() &&
      ((position === "right" &&
        event.screenX > rootRect.width - sidebarRect.width) ||
        (position === "left" && event.screenX < sidebarRect.width))
    ) {
      this.show();
    } else if (
      !this.hidden() &&
      this.sidebarBox.hidden() &&
      ((position === "right" &&
        event.screenX < rootRect.width - 2 * sidebarRect.width) ||
        (position === "left" && event.screenX > 2 * sidebarRect.width))
    ) {
      this.hide();
    }
  }

  /**
   *
   * @returns {boolean}
   */
  hidden() {
    return (
      this.sidebarMain.getProperty("margin-right") !== "" ||
      this.sidebarMain.getProperty("margin-left") !== ""
    );
  }

  /**
   *
   * @param {boolean} animate
   */
  hide(animate = false) {
    const position = SidebarControllers.sidebarController.getPosition();
    this.sidebarMain.toggleAttribute(SHOULD_ANIMATE_ATTRIBUTE, animate);
    this.sidebarMain.setProperty(
      position === "right" ? "margin-right" : "margin-left",
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
    this.sidebarMain.setProperty("margin-left", "");
  }
}
