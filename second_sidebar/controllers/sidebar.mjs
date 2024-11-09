import { Sidebar } from "../xul/sidebar.mjs";
import { SidebarBox } from "../xul/sidebar_box.mjs";
import { SidebarToolbar } from "../xul/sidebar_toolbar.mjs";
import { WebPanelsController } from "./web_panels.mjs";

export class SidebarController {
  /**
   *
   * @param {SidebarBox} sidebarBox
   * @param {Sidebar} sidebar
   * @param {SidebarToolbar} sidebarToolbar
   */
  constructor(sidebarBox, sidebar, sidebarToolbar) {
    this.sidebarBox = sidebarBox;
    this.sidebar = sidebar;
    this.sidebarToolbar = sidebarToolbar;
    this.#setupListeners();
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   */
  setupDepenedencies(webPanelsController) {
    this.webPanelsController = webPanelsController;
  }

  #setupListeners() {
    this.onClickOutsideWhileUnpinned = (event) => {
      if (
        !this.sidebarBox.element.contains(event.target) &&
        !["menuitem", "menupopup"].includes(event.target.tagName)
      ) {
        this.close();
      }
    };

    const addNavButtonListener = (event, callback) => {
      if (event.button !== 0) {
        return;
      }
      const webPanelController = this.webPanelsController.getActive();
      callback(webPanelController.webPanel);
    };

    this.sidebarToolbar.listenBackButtonClick((event) => {
      addNavButtonListener(event, (webPanel) => webPanel.goBack());
    });
    this.sidebarToolbar.listenForwardButtonClick((event) => {
      addNavButtonListener(event, (webPanel) => webPanel.goForward());
    });
    this.sidebarToolbar.listenReloadButtonClick((event) => {
      addNavButtonListener(event, (webPanel) => webPanel.reload());
    });
    this.sidebarToolbar.listenHomeButtonClick((event) => {
      addNavButtonListener(event, (webPanel) => webPanel.goHome());
    });

    this.sidebarToolbar.listenPinButtonClick((event) => {
      const webPanelController = this.webPanelsController.getActive();
      if (webPanelController.pinned()) {
        webPanelController.unpin();
        this.unpin();
      } else {
        webPanelController.pin();
        this.pin();
      }
      this.webPanelsController.save();
    });

    this.sidebarToolbar.listenCloseButtonClick(() => {
      const webPanelController = this.webPanelsController.getActive();
      webPanelController.unload();
      this.close();
    });
  }

  /**
   *
   * @param {boolean} pinned
   * @param {number} width
   * @param {boolean} canGoBack
   * @param {boolean} canGoForward
   * @param {string} title
   */
  open(pinned, width, canGoBack, canGoForward, title) {
    this.sidebarBox.show();
    this.setWidth(width);
    this.setToolbarBackButtonDisabled(!canGoBack);
    this.setToolbarForwardButtonDisabled(!canGoForward);
    this.setToolbarTitle(title);
    pinned ? this.pin() : this.unpin();
  }

  close() {
    this.sidebarBox.hide();
    this.unpin();
    this.webPanelsController.hideActive();
  }

  /**
   *
   * @returns {boolean}
   */
  closed() {
    return this.sidebarBox.hidden();
  }

  pin() {
    this.sidebar.pin();
    this.sidebarToolbar.setPinButtonIcon(true);
    document.removeEventListener("mousedown", this.onClickOutsideWhileUnpinned);
  }

  unpin() {
    this.sidebar.unpin();
    this.sidebarToolbar.setPinButtonIcon(false);
    document.addEventListener("mousedown", this.onClickOutsideWhileUnpinned);
  }

  /**
   *
   * @param {string} title
   */
  setToolbarTitle(title) {
    this.sidebarToolbar.setTitle(title);
  }

  /**
   *
   * @param {boolean} value
   */
  setToolbarBackButtonDisabled(value) {
    this.sidebarToolbar.backButton.setDisabled(value);
  }

  /**
   *
   * @param {boolean} value
   */
  setToolbarForwardButtonDisabled(value) {
    this.sidebarToolbar.forwardButton.setDisabled(value);
  }

  /**
   *
   * @param {number} width
   */
  setWidth(width) {
    this.sidebarBox.setWidth(width);
    this.sidebar.setWidth(width);
  }

  /**
   *
   * @returns {number}
   */
  getSidebarWidth() {
    return this.sidebar.getWidth();
  }

  /**
   *
   * @returns {number}
   */
  getSidebarBoxWidth() {
    return this.sidebarBox.getWidth();
  }
}
