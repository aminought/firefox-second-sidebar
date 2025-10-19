import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";

const FULLSCREEN_ANIMATE_ATTRIBUTE = "fullscreenShouldAnimate";
const ANIMATE_ATTRIBUTE = "shouldAnimate";
const HIDE_DELAY = 500;
const SHOW_DELAY = 200;

export class SidebarMainCollapser {
  constructor() {
    this.window = new WindowWrapper();
    this.lastOpenedWebPanel = null;
    this.showSidebarTimer = null;
    this.hideSidebarTimer = null;
    this.#setupListeners();
  }

  #setupListeners() {
    BrowserElements.root.addEventListener("click", this);
    BrowserElements.root.addEventListener("mousemove", this);
    BrowserElements.root.addEventListener("dragover", this);
    BrowserElements.root.addEventListener("dragleave", this);
    BrowserElements.root.addEventListener("drop", this);
    BrowserElements.root.addEventListener("mouseleave", this);
    window.addEventListener("fullscreen", () => this.onWindowFullscreen());
    SidebarElements.sidebarCollapseButton.addEventListener("click", () =>
      this.onSidebarCollapseButtonClick(),
    );
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

  onWindowFullscreen() {
    if (window.fullScreen) {
      // Show sidebar and then immediately hide with fullscreen animation
      this.uncollapse({ delay: 0 });
      setTimeout(() => {
        this.collapse({ animate: false, fullScreenAnimate: true, delay: 0 });
      }, 0);
    } else {
      if (SidebarControllers.sidebarController.autoHideSidebar) {
        // Show sidebar and then immediately hide with fullscreen animation
        this.uncollapse({ delay: 0 });
        setTimeout(() => {
          this.collapse({
            animate: false,
            fullScreenAnimate: true,
            delay: 0,
          });
        });
      } else {
        this.uncollapse(
          SidebarControllers.sidebarController.hideSidebarAnimated,
        );
      }
    }
  }

  onSidebarCollapseButtonClick() {
    if (SidebarControllers.sidebarController.autoHideSidebar) {
      return;
    }
    if (this.collapsed()) {
      this.uncollapse({
        animate: SidebarControllers.sidebarController.hideSidebarAnimated,
        delay: 0,
      });
      SidebarElements.sidebarCollapseButton.setOpen(true);
    } else {
      this.collapse({
        animate: SidebarControllers.sidebarController.hideSidebarAnimated,
        delay: 0,
      });
      SidebarElements.sidebarCollapseButton.setOpen(false);
    }
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

    if (
      event.type === "click" &&
      SidebarControllers.sidebarController.isClickOutsideWhileFloating(event)
    ) {
      this.collapse({
        animate: SidebarControllers.sidebarController.hideSidebarAnimated,
        delay: 0,
      });
      return;
    }

    if (
      event.type === "mouseleave" &&
      SidebarControllers.sidebarController.closed()
    ) {
      this.collapse({
        animate: SidebarControllers.sidebarController.hideSidebarAnimated,
      });
      return;
    }

    const position = SidebarElements.sidebarWrapper.getPosition();
    const root = new XULElement({ element: window.document.documentElement });
    const rootRect = root.getBoundingClientRect();
    const sidebarRect = SidebarElements.sidebarMain.getBoundingClientRect();
    const leftEdge = window.mozInnerScreenX;
    const rightEdge = leftEdge + rootRect.width;

    const isInUncollapseArea =
      (position === "right" && event.screenX > rightEdge - sidebarRect.width) ||
      (position === "left" && event.screenX < leftEdge + sidebarRect.width);

    if (isInUncollapseArea) {
      this.uncollapse({
        animate: SidebarControllers.sidebarController.hideSidebarAnimated,
      });
    } else if (SidebarControllers.sidebarController.closed()) {
      this.collapse({
        animate: SidebarControllers.sidebarController.hideSidebarAnimated,
      });
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
   * @param {object} params
   * @param {boolean} params.animate
   * @param {boolean} params.fullScreenAnimate
   * @param {number} params.delay
   */
  collapse({
    animate = false,
    fullScreenAnimate = false,
    delay = HIDE_DELAY,
  } = {}) {
    clearTimeout(this.showSidebarTimer);
    this.showSidebarTimer = null;
    if (!this.hideSidebarTimer) {
      this.hideSidebarTimer = setTimeout(() => {
        this.shouldAnimate(animate);
        this.fullScreenShouldAnimate(fullScreenAnimate);
        SidebarControllers.sidebarMainController.collapse();
        const webPanelController =
          SidebarControllers.webPanelsController.getActive();
        if (webPanelController) {
          this.lastOpenedWebPanel = webPanelController.getUUID();
          SidebarControllers.sidebarController.close();
        }
        this.hideSidebarTimer = null;
      }, delay);
    }
  }

  /**
   *
   * @param {object} animate
   * @param {boolean} params.animate
   * @param {boolean} params.fullScreenAnimate
   * @param {number} params.delay
   */
  uncollapse({
    animate = false,
    fullScreenAnimate = false,
    delay = SHOW_DELAY,
  } = {}) {
    clearTimeout(this.hideSidebarTimer);
    this.hideSidebarTimer = null;
    if (!this.showSidebarTimer) {
      this.showSidebarTimer = setTimeout(() => {
        this.shouldAnimate(animate);
        this.fullScreenShouldAnimate(fullScreenAnimate);
        SidebarControllers.sidebarMainController.uncollapse();
        if (this.lastOpenedWebPanel) {
          const webPanelController = SidebarControllers.webPanelsController.get(
            this.lastOpenedWebPanel,
          );
          webPanelController.switchWebPanel();
          this.lastOpenedWebPanel = null;
        }
        this.showSidebarTimer = null;
      }, delay);
    }
  }
}
