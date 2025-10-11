import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";

export class SidebarToolbarCollapser {
  constructor() {
    this.#setupListeners();

    this.showToolbarTimer = null;
    this.hideToolbarTimer = null;
  }

  #setupListeners() {
    BrowserElements.root.addEventListener("mousemove", this);
    BrowserElements.root.addEventListener("mousedown", this);
  }

  /**
   * @param {MouseEvent} event
   */
  handleEvent(event) {
    const webPanelController =
      SidebarControllers.webPanelsController.getActive();
    if (!webPanelController || !webPanelController.getHideToolbar()) {
      SidebarControllers.sidebarController.uncollapseToolbar();
      return;
    }

    const target = new XULElement({ element: event.target });
    const toolbarRect = SidebarElements.sidebarToolbar.getBoundingClientRect();
    const threshold = SidebarElements.sidebarBox.screenY + toolbarRect.height;
    const hideDelay = 500;
    const showDelay = 200;

    const isInsideSidebarBox =
      SidebarElements.sidebarBox.contains(target) ||
      SidebarElements.webPanelsBrowser.activeWebPanelContains(target);
    const isInSidebarBoxUncollapseArea =
      isInsideSidebarBox &&
      !target.hasClass("sb2-resizer") &&
      event.screenY < threshold;
    const isPopupMoreOpen = SidebarElements.sidebarToolbar.moreButton.isOpen();
    const isMovingWhilePopupMoreOpen =
      event.type === "mousemove" && isPopupMoreOpen;

    if (isInSidebarBoxUncollapseArea || isMovingWhilePopupMoreOpen) {
      clearTimeout(this.hideToolbarTimer);
      this.hideToolbarTimer = null;
      if (!this.showToolbarTimer) {
        this.showToolbarTimer = setTimeout(() => {
          SidebarControllers.sidebarController.uncollapseToolbar();
          this.showToolbarTimer = null;
        }, showDelay);
      }
    } else {
      clearTimeout(this.showToolbarTimer);
      this.showToolbarTimer = null;
      if (!this.hideToolbarTimer) {
        this.hideToolbarTimer = setTimeout(() => {
          SidebarControllers.sidebarController.collapseToolbar();
          this.hideToolbarTimer = null;
        }, hideDelay);
      }
    }
  }

  clearTimers() {
    clearTimeout(this.showToolbarTimer);
    this.showToolbarTimer = null;
    clearTimeout(this.hideToolbarTimer);
    this.hideToolbarTimer = null;
  }
}
