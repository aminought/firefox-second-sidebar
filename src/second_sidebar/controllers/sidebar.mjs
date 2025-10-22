import {
  SidebarEvents,
  WebPanelEvents,
  listenEvent,
  sendEvents,
} from "./events.mjs";

import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { SidebarSettings } from "../settings/sidebar_settings.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { changeContainerBorder } from "../utils/containers.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

export class SidebarController {
  constructor() {
    this.#setupListeners();

    this.containerBorder = "left";
    this.autoHideSidebar = false;
    this.hideSidebarAnimated = false;
    this.hideToolbarAnimated = true;
  }

  #setupListeners() {
    /** @param {MouseEvent} event */
    this.onClickOutsideWhileFloating = (event) => {
      if (isLeftMouseButton(event) && this.isClickOutsideWhileFloating(event)) {
        this.close();
      }
    };

    const addWebPanelButtonListener = (event, callback) => {
      if (isLeftMouseButton(event)) {
        const webPanelController =
          SidebarControllers.webPanelsController.getActive();
        return callback(webPanelController);
      }
    };

    SidebarElements.sidebarToolbar.listenBackButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goBack(),
      );
    });
    SidebarElements.sidebarToolbar.listenForwardButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goForward(),
      );
    });
    SidebarElements.sidebarToolbar.listenReloadButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.reload(),
      );
    });
    SidebarElements.sidebarToolbar.listenHomeButtonClick((event) => {
      addWebPanelButtonListener(event, (webPanelController) =>
        webPanelController.goHome(),
      );
    });

    SidebarElements.sidebarToolbar.listenPinButtonClick(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      sendEvents(WebPanelEvents.EDIT_WEB_PANEL_PINNED, {
        uuid: webPanelController.getUUID(),
        pinned: !webPanelController.pinned(),
      });
      SidebarControllers.webPanelsController.saveSettings();
    });

    SidebarElements.sidebarToolbar.listenCloseButtonClick(() => {
      const webPanelController =
        SidebarControllers.webPanelsController.getActive();
      this.close();
      webPanelController.unload();
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_POSITION, (event) => {
      const value = event.detail.value;
      SidebarElements.sidebarWrapper.setPosition(value);
      SidebarElements.sidebarBoxArea.updatePosition();
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_PADDING, (event) => {
      const value = event.detail.value;
      SidebarControllers.sidebarMainController.setPadding(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_NEW_WEB_PANEL_POSITION, (event) => {
      const value = event.detail.value;
      SidebarControllers.webPanelNewController.setNewWebPanelPosition(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_BACK_BUTTON, (event) => {
      const value = event.detail.value;
      SidebarElements.sidebarToolbar
        .setAutoHideBackButton(value)
        .toggleBackButton(value);
    });

    listenEvent(
      SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_FORWARD_BUTTON,
      (event) => {
        const value = event.detail.value;
        SidebarElements.sidebarToolbar
          .setAutoHideForwardButton(value)
          .toggleForwardButton(value);
      },
    );

    listenEvent(SidebarEvents.EDIT_SIDEBAR_CONTAINER_BORDER, (event) => {
      const value = event.detail.value;
      this.setContainerBorder(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_TOOLTIP, (event) => {
      const value = event.detail.value;
      this.setWebPanelTooltip(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_TOOLTIP_FULL_URL, (event) => {
      const value = event.detail.value;
      this.setWebPanelTooltipFullUrl(value);
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_VISIBILITY, (event) => {
      this.setVisibilitySettings(
        event.detail.autoHideSidebar,
        event.detail.autoHideSidebarBehavior,
        event.detail.sidebarWidgetHideWebPanel,
        event.detail.sidebarWidgetShortcut,
      );
    });

    listenEvent(SidebarEvents.EDIT_SIDEBAR_AUTO_HIDE_ANIMATED, (event) => {
      const value = event.detail.value;
      this.hideSidebarAnimated = value;
    });

    listenEvent(
      SidebarEvents.EDIT_SIDEBAR_TOOLBAR_AUTO_HIDE_ANIMATED,
      (event) => {
        const value = event.detail.value;
        this.setHideToolbarAnimated(value);
      },
    );
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {boolean}
   */
  isClickOutsideWhileFloating(event) {
    const target = new XULElement({ element: event.target });
    const webPanelController =
      SidebarControllers.webPanelsController.getActive();

    return (
      webPanelController &&
      !webPanelController.pinned() &&
      !webPanelController.getAlwaysOnTop() &&
      !SidebarElements.webPanelsBrowser.activeWebPanelContains(target) &&
      !SidebarElements.sidebarMain.contains(target) &&
      !SidebarElements.sidebarBox.contains(target) &&
      !SidebarElements.sidebarSplitter.contains(target) &&
      !SidebarElements.webPanelPopupEdit.contains(target) &&
      !SidebarElements.sidebarMainPopupSettings.contains(target) &&
      !SidebarElements.sidebarMainMenuPopup.contains(target) &&
      !SidebarElements.webPanelMenuPopup.contains(target) &&
      !SidebarElements.sidebarCollapseButton.button.contains(target) &&
      !BrowserElements.notificationPopup.contains(target) &&
      !event.view.location.href.startsWith("about:devtools") &&
      !event.view.location.href.startsWith("chrome://devtools") &&
      !BrowserElements.menuApiPopup?.contains(target)
    );
  }

  open() {
    SidebarControllers.sidebarToolbarCollapser.clearTimers();

    const webPanelController =
      SidebarControllers.webPanelsController.getActive();
    const floatingGeometry = webPanelController.getFloatingGeometry();
    SidebarControllers.sidebarGeometry.setFloatingGeometry(floatingGeometry);

    SidebarElements.sidebarBox.show();
    this.updateToolbar(webPanelController);
    this.updatePinState(webPanelController);
  }

  close() {
    SidebarControllers.sidebarToolbarCollapser.clearTimers();
    SidebarElements.sidebarBox.hide();
    SidebarElements.sidebarSplitter.hide();
    SidebarElements.afterSplitter.hide();
    SidebarControllers.webPanelsController.close();
  }

  /**
   *
   * @returns {boolean}
   */
  closed() {
    return (
      SidebarElements.sidebarBox.hidden() &&
      SidebarElements.sidebarSplitter.hidden()
    );
  }

  pin() {
    SidebarElements.sidebarBox.setAttribute("pinned", true);
    SidebarElements.sidebarSplitter.show();
    SidebarElements.afterSplitter.show();
    SidebarElements.sidebarToolbar.changePinButton(true);
    SidebarControllers.sidebarGeometry.loadAndSetPinnedGeometry();
    document.removeEventListener("click", this.onClickOutsideWhileFloating);
  }

  unpin() {
    SidebarElements.sidebarBox.setAttribute("pinned", false);
    SidebarElements.sidebarSplitter.hide();
    SidebarElements.afterSplitter.hide();
    SidebarElements.sidebarToolbar.changePinButton(false);
    SidebarControllers.sidebarGeometry.loadAndSetFloatingGeometry();
    document.addEventListener("click", this.onClickOutsideWhileFloating);
  }

  /**
   *
   * @returns {boolean}
   */
  pinned() {
    return SidebarElements.sidebarBox.getAttributeBool("pinned");
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  updateToolbar(webPanelController) {
    const title = webPanelController.getTitle();
    const canGoBack = webPanelController.canGoBack();
    const canGoForward = webPanelController.canGoForward();
    SidebarElements.sidebarToolbar
      .setTitle(title)
      .toggleBackButton(!canGoBack)
      .toggleForwardButton(!canGoForward);

    const hideToolbar = webPanelController.getHideToolbar();
    hideToolbar ? this.collapseToolbar() : this.uncollapseToolbar();
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  updatePinState(webPanelController) {
    webPanelController.pinned() ? this.pin() : this.unpin();
  }

  /**
   *
   * @param {string} value
   */
  setContainerBorder(value) {
    this.containerBorder = value;
    changeContainerBorder(value);
  }

  /**
   *
   * @returns {string}
   */
  getWebPanelTooltip() {
    return this.tooltip;
  }

  /**
   *
   * @param {string} value
   */
  setWebPanelTooltip(value) {
    this.tooltip = value;
  }

  /**
   *
   * @returns {boolean}
   */
  getWebPanelTooltipFullUrl() {
    return this.tooltipFullUrl;
  }

  /**
   *
   * @param {boolean} value
   */
  setWebPanelTooltipFullUrl(value) {
    this.tooltipFullUrl = value;
  }

  /**
   *
   * @param {boolean} autoHideSidebar
   * @param {string} autoHideSidebarBehavior
   * @param {boolean} sidebarWidgetHideWebPanel
   * @param {string} sidebarWidgetShortcut
   */
  setVisibilitySettings(
    autoHideSidebar,
    autoHideSidebarBehavior,
    sidebarWidgetHideWebPanel,
    sidebarWidgetShortcut,
  ) {
    // auto-hide
    this.autoHideSidebar = autoHideSidebar;
    SidebarElements.sidebarCollapseButton
      .setDisabled(autoHideSidebar)
      .setOpen(!SidebarControllers.sidebarMainCollapser.collapsed());
    // auto-hide behavior
    this.autoHideSidebarBehavior = autoHideSidebarBehavior;
    if (autoHideSidebar && autoHideSidebarBehavior === "overlay") {
      SidebarElements.sidebarMain.setAttribute("overlay", true);
    } else {
      SidebarElements.sidebarMain.removeAttribute("overlay");
    }
    // hide web panel when sidebar is hidden
    this.sidebarWidgetHideWebPanel = sidebarWidgetHideWebPanel;
    // shortcut for widget
    this.sidebarWidgetShortcut = sidebarWidgetShortcut;
  }

  /**
   *
   * @returns {boolean}
   */
  getHideToolbarAnimated() {
    return this.hideToolbarAnimated;
  }

  /**
   *
   * @param {boolean} value
   */
  setHideToolbarAnimated(value) {
    this.hideToolbarAnimated = value;
    SidebarElements.sidebarToolbar.setAttribute("shouldAnimate", value);
  }

  collapseToolbar() {
    const height =
      SidebarElements.sidebarToolbar.getBoundingClientRect().height;
    SidebarElements.sidebarToolbar.setProperty("margin-top", -height + "px");
  }

  uncollapseToolbar() {
    SidebarElements.sidebarToolbar.setProperty("margin-top", "0px");
  }

  /**
   *
   * @returns {boolean}
   */
  toolbarCollapsed() {
    const zeros = ["0px", ""];
    const marginTop = SidebarElements.sidebarToolbar.getProperty("margin-top");
    return !zeros.includes(marginTop);
  }

  /**
   *
   * @param {SidebarSettings} settings
   */
  loadSettings(settings) {
    SidebarElements.sidebarWrapper.setPosition(settings.position);
    SidebarControllers.sidebarMainController.setPadding(settings.padding);
    SidebarControllers.webPanelNewController.setNewWebPanelPosition(
      settings.newWebPanelPosition,
    );
    SidebarControllers.sidebarGeometry.setDefaultFloatingOffset(
      settings.defaultFloatingOffset,
    );
    SidebarElements.sidebarToolbar.setAutoHideBackButton(
      settings.autoHideBackButton,
    );
    SidebarElements.sidebarToolbar.setAutoHideForwardButton(
      settings.autoHideForwardButton,
    );
    this.setContainerBorder(settings.containerBorder);
    this.setWebPanelTooltip(settings.tooltip);
    this.setWebPanelTooltipFullUrl(settings.tooltipFullUrl);
    this.setVisibilitySettings(
      settings.autoHideSidebar,
      settings.autoHideSidebarBehavior,
      settings.sidebarWidgetHideWebPanel,
      settings.sidebarWidgetShortcut,
    );
    this.hideSidebarAnimated = settings.hideSidebarAnimated;
    this.setHideToolbarAnimated(settings.hideToolbarAnimated);
    SidebarControllers.sidebarGeometry.setEnableSidebarBoxHint(
      settings.enableSidebarBoxHint,
    );
  }

  /**
   *
   * @returns {SidebarSettings}
   */
  dumpSettings() {
    return new SidebarSettings({
      position: SidebarElements.sidebarWrapper.getPosition(),
      padding: SidebarControllers.sidebarMainController.getPadding(),
      newWebPanelPosition:
        SidebarControllers.webPanelNewController.getNewWebPanelPosition(),
      defaultFloatingOffset:
        SidebarControllers.sidebarGeometry.getDefaultFloatingOffset(),
      autoHideBackButton:
        SidebarElements.sidebarToolbar.getAutoHideBackButton(),
      autoHideForwardButton:
        SidebarElements.sidebarToolbar.getAutoHideForwardButton(),
      containerBorder: this.containerBorder,
      tooltip: this.tooltip,
      tooltipFullUrl: this.tooltipFullUrl,
      autoHideSidebar: this.autoHideSidebar,
      autoHideSidebarBehavior: this.autoHideSidebarBehavior,
      sidebarWidgetHideWebPanel: this.sidebarWidgetHideWebPanel,
      sidebarWidgetShortcut: this.sidebarWidgetShortcut,
      hideSidebarAnimated: this.hideSidebarAnimated,
      hideToolbarAnimated: this.hideToolbarAnimated,
      enableSidebarBoxHint:
        SidebarControllers.sidebarGeometry.getEnableSidebarBoxHint(),
    });
  }

  saveSettings() {
    this.dumpSettings().save();
  }
}
