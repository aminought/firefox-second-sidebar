import { Div } from "./base/div.mjs";
import { HBox } from "./base/hbox.mjs";
import { Label } from "./base/label.mjs";
import { PeriodicReloadBadge } from "./periodic_reload_badge.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { Toolbar } from "./base/toolbar.mjs";
import { ToolbarButton } from "./base/toolbar_button.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";
import { useAvailableIcon } from "../utils/icons.mjs";

const ICONS = {
  BACK: "chrome://browser/skin/back.svg",
  FORWARD: "chrome://browser/skin/forward.svg",
  RELOAD: "chrome://global/skin/icons/reload.svg",
  HOME: "chrome://browser/skin/home.svg",
  MORE: "chrome://global/skin/icons/more.svg",
  PINNED:
    "chrome://activity-stream/content/data/content/assets/glyph-unpin-16.svg",
  PINNED_ALT: "chrome://newtab/content/data/content/assets/glyph-unpin-16.svg",
  FLOATING:
    "chrome://activity-stream/content/data/content/assets/glyph-pin-16.svg",
  FLOATING_ALT: "chrome://newtab/content/data/content/assets/glyph-pin-16.svg",
  CLOSE: "chrome://global/skin/icons/close.svg",
};

export class SidebarToolbar extends Toolbar {
  /**@type {string?} */
  #periodicReloadPanelUUID = null;
  /** @type {number?} */
  #countdownUpdateInterval = null;
  #destroyed = false;

  constructor() {
    super({ id: "sb2-toolbar" });
    this.setMode("icons").setAttribute("fullscreentoolbar", "true");

    // Settings
    this.autoHideBackButton = false;
    this.autoHideForwardButton = false;

    // Navigation buttons
    this.backButton = this.#createButton("Back", ICONS.BACK);
    this.forwardButton = this.#createButton("Forward", ICONS.FORWARD);
    this.reloadButton = this.#createButton("Reload", ICONS.RELOAD);
    this.periodicReloadBadge = new PeriodicReloadBadge();
    this.reloadButtonWrapper = this.#createReloadButtonWrapper();
    this.homeButton = this.#createButton("Home", ICONS.HOME);
    this.navButtons = this.#createNavButtons();

    // Title
    this.toolbarTitle = this.#createToolbarTitle();
    this.toolbarTitleWrapper = this.#createToolbarTitleWrapper(
      this.toolbarTitle,
    );

    // Sidebar buttons
    this.moreButton = this.#createMenuButton("More", ICONS.MORE);
    this.pinButton = this.#createButton();
    this.closeButton = this.#createButton("Unload", ICONS.CLOSE);
    this.sidebarButtons = this.#createSidebarButtons();
    this.#setupCountdownListeners();
  }

  #setupCountdownListeners() {
    const onVisibilityChange = () => this.refreshPeriodicReload();
    const observer = new MutationObserver(onVisibilityChange);
    observer.observe(this.element, {
      attributes: true,
      attributeFilter: ["style"],
    });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener(
      "unload",
      () => {
        this.#destroyed = true;
        this.#periodicReloadPanelUUID = null;
        this.#stopCountdownUpdates();
        observer.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
      },
      { once: true },
    );
  }

  /**
   *
   * @param {string} tooltipText?
   * @param {string?} iconUrl
   * @returns {ToolbarButton}
   */
  #createButton(tooltipText = null, iconUrl = null) {
    return new ToolbarButton({
      classList: ["sb2-toolbar-button", "toolbarbutton-1"],
    })
      .setIcon(iconUrl)
      .setTooltipText(tooltipText);
  }

  /**
   *
   * @param {string} tooltipText
   * @param {string} iconUrl
   * @returns {ToolbarButton}
   */
  #createMenuButton(tooltipText, iconUrl) {
    return this.#createButton(tooltipText, iconUrl).setType("menu");
  }

  /**
   *
   * @returns {HBox}
   */
  #createNavButtons() {
    const toolbarButtons = new HBox({ id: "sb2-toolbar-nav-buttons" })
      .appendChild(this.backButton)
      .appendChild(this.forwardButton)
      .appendChild(this.reloadButtonWrapper)
      .appendChild(this.homeButton);

    this.appendChild(toolbarButtons);
    return toolbarButtons;
  }

  /**
   *
   * @returns {HBox}
   */
  #createReloadButtonWrapper() {
    return new HBox({ id: "sb2-toolbar-reload" })
      .appendChild(this.reloadButton)
      .appendChild(this.periodicReloadBadge);
  }

  /**
   *
   * @returns {Label}
   */
  #createToolbarTitle() {
    return new Label({ id: "sb2-toolbar-title" });
  }

  /**
   *
   * @param {Label} toolbarTitle
   * @returns {Div}
   */
  #createToolbarTitleWrapper(toolbarTitle) {
    const toolbarTitleWrapper = new Div({
      id: "sb2-toolbar-title-wrapper",
    });
    toolbarTitleWrapper.appendChild(toolbarTitle);
    this.appendChild(toolbarTitleWrapper);
    return toolbarTitleWrapper;
  }

  /**
   *
   * @returns {HBox}
   */
  #createSidebarButtons() {
    const toolbarButtons = new HBox({ id: "sb2-toolbar-sidebar-buttons" })
      .appendChild(this.moreButton)
      .appendChild(this.pinButton)
      .appendChild(this.closeButton);

    this.appendChild(toolbarButtons);
    return toolbarButtons;
  }

  /**
   *
   * @param {ToolbarButton} button
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  #addButtonClickListener(button, callback) {
    button.addEventListener("click", (event) => {
      if (isLeftMouseButton) {
        callback(event);
      }
    });
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {SidebarToolbar}
   */
  setAutoHideBackButton(value) {
    this.autoHideBackButton = value;
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  getAutoHideBackButton() {
    return this.autoHideBackButton;
  }

  /**
   *
   * @param {boolean} value
   * @returns {SidebarToolbar}
   */
  setAutoHideForwardButton(value) {
    this.autoHideForwardButton = value;
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  getAutoHideForwardButton() {
    return this.autoHideForwardButton;
  }

  /**
   *
   * @param {string} title
   * @returns {SidebarToolbar}
   */
  setTitle(title) {
    this.toolbarTitle.setText(title);
    return this;
  }

  /**
   *
   * @param {string?} uuid
   * @returns {SidebarToolbar}
   */
  setPeriodicReloadPanelUUID(uuid) {
    if (!this.#destroyed) {
      this.#periodicReloadPanelUUID = uuid;
      this.refreshPeriodicReload();
    }
    return this;
  }

  /**
   * Update the displayed panel's countdown without changing the toolbar.
   * @param {string?} uuid
   * @returns {SidebarToolbar}
   */
  refreshPeriodicReload(uuid = null) {
    if (uuid !== null && uuid !== this.#periodicReloadPanelUUID) {
      return this;
    }

    const collapsed = !["0px", ""].includes(this.getProperty("margin-top"));
    const remaining =
      this.#destroyed || collapsed || document.hidden
        ? null
        : (SidebarControllers.webPanelsController
            ?.get(this.#periodicReloadPanelUUID)
            ?.getPeriodicReloadRemaining() ?? null);
    this.#updatePeriodicReloadBadge(remaining);
    if (remaining === null) {
      this.#stopCountdownUpdates();
    } else if (this.#countdownUpdateInterval === null) {
      this.#countdownUpdateInterval = setInterval(
        () => this.refreshPeriodicReload(),
        1000,
      );
    }
    return this;
  }

  #stopCountdownUpdates() {
    clearInterval(this.#countdownUpdateInterval);
    this.#countdownUpdateInterval = null;
  }

  /**
   *
   * @param {number?} remaining
   */
  #updatePeriodicReloadBadge(remaining) {
    const previousText = this.periodicReloadBadge.getText();
    this.periodicReloadBadge.setRemaining(remaining);
    const text = this.periodicReloadBadge.getText();
    if (text === previousText) {
      return;
    }

    if (text === null) {
      this.reloadButton.removeAttribute("aria-label");
    } else {
      this.reloadButton.setAttribute(
        "aria-label",
        `Reload; automatic reload in ${text}`,
      );
    }
  }

  /**
   *
   * @param {boolean} pinned
   * @returns {SidebarToolbar}
   */
  async changePinButton(pinned) {
    this.pinButton
      .setIcon(
        pinned
          ? await useAvailableIcon(ICONS.PINNED, ICONS.PINNED_ALT)
          : await useAvailableIcon(ICONS.FLOATING, ICONS.FLOATING_ALT),
      )
      .setTooltipText(pinned ? "Unpin" : "Pin");
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {SidebarToolbar}
   */
  toggleBackButton(value) {
    this.backButton.setDisabled(value);
    value && this.autoHideBackButton
      ? this.backButton.hide()
      : this.backButton.show();
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {SidebarToolbar}
   */
  toggleForwardButton(value) {
    this.forwardButton.setDisabled(value);
    value && this.autoHideForwardButton
      ? this.forwardButton.hide()
      : this.forwardButton.show();
    return this;
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenBackButtonClick(callback) {
    return this.#addButtonClickListener(this.backButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenForwardButtonClick(callback) {
    return this.#addButtonClickListener(this.forwardButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenReloadButtonClick(callback) {
    return this.#addButtonClickListener(this.reloadButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenHomeButtonClick(callback) {
    return this.#addButtonClickListener(this.homeButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenPinButtonClick(callback) {
    return this.#addButtonClickListener(this.pinButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenCloseButtonClick(callback) {
    return this.#addButtonClickListener(this.closeButton, callback);
  }
}
