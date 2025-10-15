import { SidebarEvents, listenEvent, sendEvents } from "./events.mjs";

import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";

const FULLSCREEN_ANIMATE_ATTRIBUTE = "fullscreenShouldAnimate";
const ANIMATE_ATTRIBUTE = "shouldAnimate";

export class SidebarMainCollapser {
  constructor() {
    this.#setupListeners();
  }

  #setupListeners() {
    BrowserElements.root.addEventListener("mousemove", this);

    const window = new WindowWrapper();
    window.addEventListener("fullscreen", () => {
      if (window.fullScreen) {
        // Show sidebar and then immediately hide with fullscreen animation
        this.uncollapse();
        setTimeout(() => {
          this.collapse(false, true);
        }, 0);
      } else {
        if (SidebarControllers.sidebarController.autoHideSidebar) {
          // Show sidebar and then immediately hide with fullscreen animation
          this.uncollapse();
          setTimeout(() => {
            this.collapse(false, true);
          });
        } else {
          this.uncollapse(
            SidebarControllers.sidebarController.hideSidebarAnimated,
          );
        }
      }
    });

    SidebarElements.sidebarCollapseButton.addEventListener("click", () => {
      sendEvents(SidebarEvents.COLLAPSE_SIDEBAR);
    });

    listenEvent(SidebarEvents.COLLAPSE_SIDEBAR, (event) => {
      const isActiveWindow = event.detail.isActiveWindow;

      if (!isActiveWindow) {
        return;
      }

      if (SidebarControllers.sidebarController.autoHideSidebar) {
        return;
      }
      if (this.collapsed()) {
        this.uncollapse(
          SidebarControllers.sidebarController.hideSidebarAnimated,
        );
        SidebarElements.sidebarCollapseButton.setOpen(true);
      } else {
        this.collapse(SidebarControllers.sidebarController.hideSidebarAnimated);
        SidebarElements.sidebarCollapseButton.setOpen(false);
      }
    });
  }

  /**
   *
   * @param {boolean} animate
   */
  shouldAnimate(animate) {
    SidebarElements.sidebarMain.toggleAttribute(ANIMATE_ATTRIBUTE, animate);
  }

  /**
   *
   * @param {boolean} animate
   */
  fullScreenShouldAnimate(animate) {
    SidebarElements.sidebarMain.toggleAttribute(
      FULLSCREEN_ANIMATE_ATTRIBUTE,
      animate,
    );
  }

  /**
   *
   * @param {MouseEvent} event
   */
  handleEvent(event) {
    const window = new WindowWrapper();
    if (
      (!window.fullScreen &&
        !SidebarControllers.sidebarController.autoHideSidebar) ||
      window.document.fullscreenElement
    ) {
      return;
    }
    const position = SidebarElements.sidebarWrapper.getPosition();
    const root = new XULElement({ element: window.document.documentElement });
    const rootRect = root.getBoundingClientRect();
    const sidebarRect = SidebarElements.sidebarMain.getBoundingClientRect();
    const leftEdge = window.mozInnerScreenX;
    const rightEdge = leftEdge + rootRect.width;
    if (
      this.collapsed() &&
      ((position === "right" &&
        event.screenX > rightEdge - sidebarRect.width) ||
        (position === "left" && event.screenX < leftEdge + sidebarRect.width))
    ) {
      this.uncollapse(SidebarControllers.sidebarController.hideSidebarAnimated);
    } else if (
      !this.collapsed() &&
      ((position === "right" &&
        event.screenX < rightEdge - 2 * sidebarRect.width) ||
        (position === "left" &&
          event.screenX > leftEdge + 2 * sidebarRect.width))
    ) {
      this.collapse(SidebarControllers.sidebarController.hideSidebarAnimated);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  collapsed() {
    return SidebarControllers.sidebarMainController.collapsed();
  }

  /**
   *
   * @param {boolean} animate
   * @param {boolean} fullScreenAnimate
   */
  collapse(animate = false, fullScreenAnimate = false) {
    this.shouldAnimate(animate);
    this.fullScreenShouldAnimate(fullScreenAnimate);
    SidebarControllers.sidebarMainController.collapse();
  }

  /**
   *
   * @param {boolean} animate
   * @param {boolean} fullScreenAnimate
   */
  uncollapse(animate = false, fullScreenAnimate = false) {
    this.shouldAnimate(animate);
    this.fullScreenShouldAnimate(fullScreenAnimate);
    SidebarControllers.sidebarMainController.uncollapse();
  }
}
