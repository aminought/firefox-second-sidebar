import { Div } from "./base/div.mjs";
import { HBox } from "./base/hbox.mjs";
import { Label } from "./base/label.mjs";
import { MenuItem } from "./base/menu_item.mjs";
import { Toolbar } from "./base/toolbar.mjs";
import { ToolbarButton } from "./base/toolbar_button.mjs";
import { ToolbarButtonWithPopup } from "./base/toolbar_button_with_popup.mjs";

const ICONS = {
  BACK: "chrome://browser/skin/back.svg",
  FORWARD: "chrome://browser/skin/forward.svg",
  RELOAD: "chrome://global/skin/icons/reload.svg",
  HOME: "chrome://browser/skin/home.svg",
  MORE: "chrome://devtools/skin/images/more.svg",
  PINNED:
    "chrome://activity-stream/content/data/content/assets/glyph-unpin-16.svg",
  UNPINNED:
    "chrome://activity-stream/content/data/content/assets/glyph-pin-16.svg",
  CLOSE: "chrome://global/skin/icons/close.svg",
};

export class SidebarToolbar extends Toolbar {
  constructor() {
    super({ id: "sidebar-2-toolbar" });
    this.setMode("icons");

    // Navigation buttons
    this.backButton = this.#createButton(ICONS.BACK);
    this.forwardButton = this.#createButton(ICONS.FORWARD);
    this.reloadButton = this.#createButton(ICONS.RELOAD);
    this.homeButton = this.#createButton(ICONS.HOME);
    this.navButtons = this.#createNavButtons();

    // Title
    this.toolbarTitle = this.#createToolbarTitle();

    // Sidebar buttons
    this.openInNewTabMenuitem = this.#createOpenInNewTabMenuitem();
    this.copyPageUrlMenuitem = this.#createCopyPageUrlMenuitem();
    this.moreButton = this.#createMorebutton();
    this.moreButton.appendChildToPopup(this.openInNewTabMenuitem);
    this.moreButton.appendChildToPopup(this.copyPageUrlMenuitem);
    this.pinButton = this.#createButton();
    this.closeButton = this.#createButton(ICONS.CLOSE);
    this.sidebarButtons = this.#createSidebarButtons();
  }

  /**
   *
   * @param {string?} iconUrl
   * @returns {ToolbarButton}
   */
  #createButton (iconUrl = null) {
    return new ToolbarButton({
      classList: ["sidebar-2-toolbar-button"],
    }).setIcon(iconUrl);
  }

  /**
   *
   * @returns {HBox}
   */
  #createNavButtons () {
    const toolbarButtons = new HBox({ id: "sidebar-2-toolbar-nav-buttons" })
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
  #createToolbarTitle () {
    const toolbarTitle = new Label({ id: "sidebar-2-toolbar-title" });
    const toolbarTitleWrapper = new Div({
      id: "sidebar-2-toolbar-title-wrapper",
    });
    toolbarTitleWrapper.appendChild(toolbarTitle);
    this.appendChild(toolbarTitleWrapper);
    return toolbarTitle;
  }

  #createOpenInNewTabMenuitem () {
    return new MenuItem().setAttributes({
      label: "Open in New Tab",
      accesskey: 'O'
    });
  }

  #createCopyPageUrlMenuitem () {
    return new MenuItem().setAttributes({
      label: "Copy Page URL",
      accesskey: 'C'
    });
  }

  #createMorebutton () {
    const moreButton = new ToolbarButtonWithPopup({
      id: "sidebar-2-more-button",
      classList: ["sidebar-2-more-button"],
    }).setAttributes({
      image: ICONS.MORE,
      label: "More",
      tooltiptext: "More"
    });
    return moreButton;
  }

  /**
   *
   * @returns {HBox}
   */
  #createSidebarButtons () {
    const toolbarButtons = new HBox({ id: "sidebar-2-toolbar-sidebar-buttons" })
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
  #addButtonClickListener (button, callback) {
    button.addEventListener("mousedown", (event) => {
      if (event.button !== 0) {
        return;
      }
      callback(event);
    });
    return this;
  }

  /**
   *
   * @param {MenuItem} button
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  #addMenuitemClickListener (menuitem, callback) {
    menuitem.addEventListener("mousedown", (event) => {
      if (event.button !== 0) {
        return;
      }
      callback(event);
    });
    return this;
  }

  /**
   *
   * @param {string} title
   * @returns {SidebarToolbar}
   */
  setTitle (title) {
    this.toolbarTitle.setText(title);
    return this;
  }

  /**
   *
   * @param {boolean} pinned
   * @returns {SidebarToolbar}
   */
  setPinButtonIcon (pinned) {
    this.pinButton.setIcon(pinned ? ICONS.PINNED : ICONS.UNPINNED);
    return this;
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenBackButtonClick (callback) {
    return this.#addButtonClickListener(this.backButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenForwardButtonClick (callback) {
    return this.#addButtonClickListener(this.forwardButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenReloadButtonClick (callback) {
    return this.#addButtonClickListener(this.reloadButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenHomeButtonClick (callback) {
    return this.#addButtonClickListener(this.homeButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenOpenInNewTabMeuitemClick (callback) {
    return this.#addMenuitemClickListener(this.openInNewTabMenuitem, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenCopyPageUrlMenuitemClick (callback) {
    return this.#addMenuitemClickListener(this.copyPageUrlMenuitem, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenPinButtonClick (callback) {
    return this.#addButtonClickListener(this.pinButton, callback);
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {SidebarToolbar}
   */
  listenCloseButtonClick (callback) {
    return this.#addButtonClickListener(this.closeButton, callback);
  }
}
