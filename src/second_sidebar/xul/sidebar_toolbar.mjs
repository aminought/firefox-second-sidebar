import { Div } from "./base/div.mjs";
import { HBox } from "./base/hbox.mjs";
import { Label } from "./base/label.mjs";
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
  UNPINNED:
    "chrome://activity-stream/content/data/content/assets/glyph-pin-16.svg",
  UNPINNED_ALT: "chrome://newtab/content/data/content/assets/glyph-pin-16.svg",
  CLOSE: "chrome://global/skin/icons/close.svg",
};

export class SidebarToolbar extends Toolbar {
  constructor() {
    super({ id: "sb2-toolbar" });
    this.setMode("icons").setAttribute("fullscreentoolbar", "true");

    // Navigation buttons
    this.backButton = this.#createButton("Back", ICONS.BACK);
    this.forwardButton = this.#createButton("Forward", ICONS.FORWARD);
    this.reloadButton = this.#createButton("Reload", ICONS.RELOAD);
    this.homeButton = this.#createButton("Home", ICONS.HOME);
    this.navButtons = this.#createNavButtons();

    // Title
    this.toolbarTitle = this.#createToolbarTitle();

    // Sidebar buttons
    this.moreButton = this.#createMenuButton("More", ICONS.MORE);
    this.pinButton = this.#createButton();
    this.closeButton = this.#createButton("Unload", ICONS.CLOSE);
    this.sidebarButtons = this.#createSidebarButtons();
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
      .appendChild(this.reloadButton)
      .appendChild(this.homeButton);

    this.appendChild(toolbarButtons);
    return toolbarButtons;
  }

  /**
   *
   * @returns {Label}
   */
  #createToolbarTitle() {
    const toolbarTitle = new Label({ id: "sb2-toolbar-title" });
    const toolbarTitleWrapper = new Div({
      id: "sb2-toolbar-title-wrapper",
    });
    toolbarTitleWrapper.appendChild(toolbarTitle);
    this.appendChild(toolbarTitleWrapper);
    return toolbarTitle;
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
   * @param {string} title
   * @returns {SidebarToolbar}
   */
  setTitle(title) {
    this.toolbarTitle.setText(title);
    return this;
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
          : await useAvailableIcon(ICONS.UNPINNED, ICONS.UNPINNED_ALT),
      )
      .setTooltipText(pinned ? "Unpin" : "Pin");
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
