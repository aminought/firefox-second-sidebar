import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";

const FULLSCREEN_ANIMATE_ATTRIBUTE = "fullscreenShouldAnimate";
const ANIMATE_ATTRIBUTE = "shouldAnimate";

export class CollapseController {
  constructor() {
    // elements
    this.sidebarMain = SidebarElements.sidebarMain;
    this.sidebarSettings = SidebarElements.sidebarMainPopupSettings;
    // controllers
    this.sidebarController = SidebarControllers.sidebarController;

    this.#setupListeners();
  }

  #setupListeners() {
    const window = new WindowWrapper();
    const root = new XULElement({ element: window.document.documentElement });

    root.addEventListener("mousemove", this);

    window.addEventListener("fullscreen", () => {
      if (window.fullScreen) {
        // Show sidebar and then immediately hide with fullscreen animation
        this.uncollapse();
        setTimeout(() => {
          this.collapse(false, true);
        }, 0);
      } else {
        if (this.sidebarController.autoHideSidebar) {
          // Show sidebar and then immediately hide with fullscreen animation
          this.uncollapse();
          setTimeout(() => {
            this.collapse(false, true);
          });
        } else {
          this.uncollapse(this.sidebarController.autoHideSidebarAnimated);
        }
      }
    });
  }

  /**
   *
   * @param {boolean} animate
   */
  shouldAnimate(animate) {
    this.sidebarMain.toggleAttribute(ANIMATE_ATTRIBUTE, animate);
  }

  /**
   *
   * @param {boolean} animate
   */
  fullScreenShouldAnimate(animate) {
    this.sidebarMain.toggleAttribute(FULLSCREEN_ANIMATE_ATTRIBUTE, animate);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  handleEvent(event) {
    const window = new WindowWrapper();
    if (!window.fullScreen && !this.sidebarController.autoHideSidebar) {
      return;
    }
    const position = this.sidebarController.getPosition();
    const root = new XULElement({ element: window.document.documentElement });
    const rootRect = root.getBoundingClientRect();
    const sidebarRect = this.sidebarMain.getBoundingClientRect();
    const leftEdge = window.mozInnerScreenX;
    const rightEdge = leftEdge + rootRect.width;
    if (
      this.collapsed() &&
      ((position === "right" &&
        event.screenX > rightEdge - sidebarRect.width) ||
        (position === "left" && event.screenX < leftEdge + sidebarRect.width))
    ) {
      this.uncollapse(this.sidebarController.autoHideSidebarAnimated);
    } else if (
      !this.collapsed() &&
      ((position === "right" &&
        event.screenX < rightEdge - 2 * sidebarRect.width) ||
        (position === "left" &&
          event.screenX > leftEdge + 2 * sidebarRect.width))
    ) {
      this.collapse(this.sidebarController.autoHideSidebarAnimated);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  collapsed() {
    return (
      this.sidebarMain.getProperty("margin-right") !== "0px" ||
      this.sidebarMain.getProperty("margin-left") !== "0px"
    );
  }

  /**
   *
   * @param {boolean} animate
   * @param {boolean} fullScreenAnimate
   */
  collapse(animate = false, fullScreenAnimate = false) {
    this.shouldAnimate(animate);
    this.fullScreenShouldAnimate(fullScreenAnimate);

    const position = this.sidebarController.getPosition();
    this.sidebarMain.setProperty(
      position === "right" ? "margin-right" : "margin-left",
      -this.sidebarMain.getBoundingClientRect().width + "px",
    );
  }

  /**
   *
   * @param {boolean} animate
   * @param {boolean} fullScreenAnimate
   */
  uncollapse(animate = false, fullScreenAnimate = false) {
    this.shouldAnimate(animate);
    this.fullScreenShouldAnimate(fullScreenAnimate);

    this.sidebarMain.setProperty("margin-right", "0px");
    this.sidebarMain.setProperty("margin-left", "0px");
  }
}
