import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { gNavToolboxWrapper } from "../wrappers/g_nav_toolbox.mjs";

const FULLSCREEN_ANIMATE_ATTRIBUTE = "fullscreenShouldAnimate";
const ANIMATE_ATTRIBUTE = "shouldAnimate";
const TRIGGER_WIDTH = 16;
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

    gNavToolboxWrapper.addEventListener("customizationready", () => {
      SidebarElements.sidebarMain.removeAttribute("overlay");
    });

    gNavToolboxWrapper.addEventListener("aftercustomization", () => {
      const { autoHideSidebar, autoHideSidebarBehavior } =
        SidebarControllers.sidebarController;
      if (autoHideSidebar && autoHideSidebarBehavior === "overlay") {
        SidebarElements.sidebarMain.setAttribute("overlay", true);
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

  onWindowFullscreen() {
    if (window.fullScreen) {
      // Show sidebar and then immediately hide with fullscreen animation
      this.uncollapse({ animate: false, delay: 0 });
      setTimeout(() => {
        this.collapse({ animate: false, fullScreenAnimate: true, delay: 0 });
      }, 0);
    } else {
      if (SidebarControllers.sidebarController.autoHideSidebar) {
        // Show sidebar and then immediately hide with fullscreen animation
        this.uncollapse({ animate: false, delay: 0 });
        setTimeout(() => {
          this.collapse({
            animate: false,
            fullScreenAnimate: true,
            delay: 0,
          });
        });
      } else {
        this.uncollapse({ delay: 0 });
      }
    }
  }

  onSidebarCollapseButtonClick() {
    if (SidebarControllers.sidebarController.autoHideSidebar) {
      return;
    }
    if (this.collapsed()) {
      this.uncollapse({
        delay: 0,
        restoreLastOpenedWebPanel:
          SidebarControllers.sidebarController.sidebarWidgetHideWebPanel,
      });
      SidebarElements.sidebarCollapseButton.setOpen(true);
    } else {
      this.collapse({
        delay: 0,
        saveLastOpenedWebPanel:
          SidebarControllers.sidebarController.sidebarWidgetHideWebPanel,
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

    const openedButtons = SidebarElements.sidebarMain.querySelectorAll(
      "toolbarbutton:not(.sb2-main-web-panel-button)[open]",
    );
    if (openedButtons.length > 0) {
      return;
    }

    if (event.type === "mouseleave") {
      if (event.explicitOriginalTarget?.id === "main-window") {
        this.collapse();
      }
      return;
    }

    if (
      event.type === "click" &&
      !this.isEventInsidePanel(event) &&
      !this.isEventInsideSidebarMain(event)
    ) {
      this.collapse({ delay: 0 });
      return;
    }

    const position = SidebarElements.sidebarWrapper.getPosition();
    const isLeft = position === "left";
    const isRight = position === "right";
    const collapsed = this.collapsed();
    const root = new XULElement({ element: window.document.documentElement });
    const rootRect = root.getBoundingClientRect();
    const sidebarRect = SidebarElements.sidebarMain.getBoundingClientRect();
    const leftEdge = window.mozInnerScreenX;
    const rightEdge = leftEdge + rootRect.width;

    const isInUncollapseArea =
      (collapsed &&
        ((isRight && event.screenX > rightEdge - TRIGGER_WIDTH) ||
          (isLeft && event.screenX < leftEdge + TRIGGER_WIDTH))) ||
      (!collapsed &&
        ((isRight && event.screenX > rightEdge - sidebarRect.width) ||
          (isLeft && event.screenX < leftEdge + sidebarRect.width)));

    if (isInUncollapseArea) {
      this.uncollapse();
    } else if (!this.isPanelOpened()) {
      this.collapse();
    }
  }

  /**
   *
   * @returns {boolean}
   */
  isPanelOpened() {
    return (
      SidebarElements.sidebarMainMenuPopup.isPanelOpen() ||
      SidebarElements.sidebarMainPopupSettings.isPanelOpen() ||
      SidebarElements.webPanelMenuPopup.isPanelOpen() ||
      SidebarElements.webPanelPopupNew.isPanelOpen() ||
      SidebarElements.webPanelPopupEdit.isPanelOpen() ||
      SidebarElements.webPanelPopupDelete.isPanelOpen()
    );
  }

  /**
   *
   * @param {MouseEvent} event
   */
  isEventInsidePanel(event) {
    const target = new XULElement({ element: event.target });
    return (
      SidebarElements.sidebarMainMenuPopup.contains(target) ||
      SidebarElements.sidebarMainPopupSettings.contains(target) ||
      SidebarElements.webPanelMenuPopup.contains(target) ||
      SidebarElements.webPanelPopupNew.contains(target) ||
      SidebarElements.webPanelPopupEdit.contains(target) ||
      SidebarElements.webPanelPopupDelete.contains(target)
    );
  }

  /**
   *
   * @param {MouseEvent} event
   */
  isEventInsideSidebarMain(event) {
    const target = new XULElement({ element: event.target });
    return SidebarElements.sidebarMain.contains(target);
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
   * @param {boolean} params.saveLastOpenedWebPanel
   */
  collapse({
    animate = SidebarControllers.sidebarController.hideSidebarAnimated,
    fullScreenAnimate = false,
    delay = HIDE_DELAY,
    saveLastOpenedWebPanel = false,
  } = {}) {
    clearTimeout(this.showSidebarTimer);
    this.showSidebarTimer = null;
    if (!this.hideSidebarTimer) {
      this.hideSidebarTimer = setTimeout(() => {
        this.shouldAnimate(animate);
        this.fullScreenShouldAnimate(fullScreenAnimate);
        SidebarControllers.sidebarMainController.collapse();
        if (saveLastOpenedWebPanel) {
          const webPanelController =
            SidebarControllers.webPanelsController.getActive();
          if (webPanelController) {
            this.lastOpenedWebPanel = webPanelController.getUUID();
            SidebarControllers.sidebarController.close();
          }
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
   * @param {boolean} params.restoreLastOpenedWebPanel
   */
  uncollapse({
    animate = SidebarControllers.sidebarController.hideSidebarAnimated,
    fullScreenAnimate = false,
    delay = SHOW_DELAY,
    restoreLastOpenedWebPanel = false,
  } = {}) {
    clearTimeout(this.hideSidebarTimer);
    this.hideSidebarTimer = null;
    if (!this.showSidebarTimer) {
      this.showSidebarTimer = setTimeout(() => {
        this.shouldAnimate(animate);
        this.fullScreenShouldAnimate(fullScreenAnimate);
        SidebarControllers.sidebarMainController.uncollapse();
        if (restoreLastOpenedWebPanel && this.lastOpenedWebPanel) {
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
