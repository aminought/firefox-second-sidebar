import {
  createCancelButton,
  createPopupGroup,
  createPopupHeader,
  createSaveButton,
} from "../utils/xul.mjs";

/* eslint-disable no-unused-vars */
import { HBox } from "./base/hbox.mjs";
import { MenuList } from "./base/menulist.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { SidebarSettings } from "../settings/sidebar_settings.mjs";
import { Toggle } from "./base/toggle.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

/* eslint-enable no-unused-vars */

export class SidebarMainPopupSettings extends Panel {
  constructor() {
    super({
      id: "sb2-main-popup-settings",
      classList: ["sb2-popup", "sb2-popup-with-header"],
    });
    this.setType("arrow").setRole("group");

    this.positionMenuList = this.#createPositionMenuList();
    this.webPanelButtonsPositionMenuList =
      this.#createWebPanelButtonsPositionMenuList();
    this.plusButtonPositionMenuList = this.#createPlusButtonPositionMenuList();
    this.paddingMenuList = this.#createPaddingMenuList();
    this.hideInPopupWindowsToggle = new Toggle();
    this.autoHideBackToggle = new Toggle();
    this.autoHideForwardToggle = new Toggle();
    this.faviconSizeMenuList = this.#createFaviconSizeMenuList();
    this.unpinnedPaddingMenuList = this.#createPaddingMenuList();
    this.saveButton = createSaveButton();
    this.cancelButton = createCancelButton();
    this.#compose();
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPositionMenuList() {
    const menuList = new MenuList();
    menuList.appendItem("Left", "left");
    menuList.appendItem("Right", "right");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createWebPanelButtonsPositionMenuList() {
    const menuList = new MenuList();
    menuList.appendItem("Top", "start");
    menuList.appendItem("Bottom", "end");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPlusButtonPositionMenuList() {
    const menuList = new MenuList();
    menuList.appendItem("Above", "start");
    menuList.appendItem("Below", "end");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPaddingMenuList() {
    const menuList = new MenuList();
    menuList.appendItem("Extra Extra Small", "xxsmall");
    menuList.appendItem("Extra Small", "xsmall");
    menuList.appendItem("Small", "small");
    menuList.appendItem("Medium", "medium");
    menuList.appendItem("Large", "large");
    menuList.appendItem("Extra Large", "xlarge");
    menuList.appendItem("Extra Extra Large", "xxlarge");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createFaviconSizeMenuList() {
    const menuList = new MenuList();
    for (let i = 24; i <= 64; i += 2) {
      menuList.appendItem(i + " px", i);
    }
    return menuList;
  }

  #compose() {
    this.appendChild(
      new PanelMultiView().appendChildren(
        createPopupHeader("Sidebar Settings"),
        new ToolbarSeparator(),
        createPopupGroup("Sidebar position", this.positionMenuList),
        createPopupGroup(
          "Sidebar buttons position",
          this.webPanelButtonsPositionMenuList,
        ),
        createPopupGroup(
          "Plus button position",
          this.plusButtonPositionMenuList,
        ),
        new ToolbarSeparator(),
        createPopupGroup("Sidebar width", this.paddingMenuList),
        createPopupGroup("Sidebar buttons size", this.faviconSizeMenuList),
        createPopupGroup(
          "Floating web panel offset",
          this.unpinnedPaddingMenuList,
        ),
        new ToolbarSeparator(),
        createPopupGroup(
          "Hide sidebar in popup windows",
          this.hideInPopupWindowsToggle,
        ),
        createPopupGroup("Auto hide back button", this.autoHideBackToggle),
        createPopupGroup(
          "Auto hide forward button",
          this.autoHideForwardToggle,
        ),
        new HBox({
          id: "sb2-main-popup-settings-buttons",
        }).appendChildren(this.cancelButton, this.saveButton),
      ),
    );
  }

  /**
   *
   * @param {object} callbacks
   * @param {function(string):void} callbacks.position
   * @param {function(string):void} callbacks.webPanelButtonsPosition
   * @param {function(string):void} callbacks.plusButtonPosition
   * @param {function(string):void} callbacks.padding
   * @param {function(number):void} callbacks.faviconSize
   * @param {function(string):void} callbacks.unpinnedPadding
   * @param {function(boolean):void} callbacks.hideInPopupWindows
   * @param {function(boolean):void} callbacks.autoHideBackButton
   * @param {function(boolean):void} callbacks.autoHideForwardButton
   */
  listenChanges({
    position,
    webPanelButtonsPosition,
    plusButtonPosition,
    padding,
    faviconSize,
    unpinnedPadding,
    hideInPopupWindows,
    autoHideBackButton,
    autoHideForwardButton,
  }) {
    this.onPositionChange = position;
    this.onWebPanelButtonsPositionChange = webPanelButtonsPosition;
    this.onPlusButtonPositionChange = plusButtonPosition;
    this.onPaddingChange = padding;
    this.onFaviconSizeChange = faviconSize;
    this.onUnpinnedPaddingChange = unpinnedPadding;
    this.onHideInPopupWindowsChange = hideInPopupWindows;
    this.onAutoHideBackButtonChange = autoHideBackButton;
    this.onAutoHideForwardButtonChange = autoHideForwardButton;

    this.positionMenuList.addEventListener("command", () =>
      position(this.positionMenuList.getValue()),
    );
    this.webPanelButtonsPositionMenuList.addEventListener("command", () =>
      webPanelButtonsPosition(this.webPanelButtonsPositionMenuList.getValue()),
    );
    this.plusButtonPositionMenuList.addEventListener("command", () =>
      plusButtonPosition(this.plusButtonPositionMenuList.getValue()),
    );
    this.paddingMenuList.addEventListener("command", () =>
      padding(this.paddingMenuList.getValue()),
    );
    this.faviconSizeMenuList.addEventListener("command", () =>
      faviconSize(this.faviconSizeMenuList.getValue()),
    );
    this.unpinnedPaddingMenuList.addEventListener("command", () =>
      unpinnedPadding(this.unpinnedPaddingMenuList.getValue()),
    );
    this.hideInPopupWindowsToggle.addEventListener("toggle", () =>
      hideInPopupWindows(this.hideInPopupWindowsToggle.getPressed()),
    );
    this.autoHideBackToggle.addEventListener("toggle", () =>
      autoHideBackButton(this.autoHideBackToggle.getPressed()),
    );
    this.autoHideForwardToggle.addEventListener("toggle", () =>
      autoHideForwardButton(this.autoHideForwardToggle.getPressed()),
    );
  }

  /**
   *
   * @param {function():void} callback
   */
  listenCancelButtonClick(callback) {
    this.cancelButton.addEventListener("mousedown", (event) => {
      if (isLeftMouseButton(event)) {
        callback();
      }
    });
  }

  /**
   *
   * @param {function():void} callback
   */
  listenSaveButtonClick(callback) {
    this.saveButton.addEventListener("mousedown", (event) => {
      if (isLeftMouseButton(event)) {
        this.removeEventListener("popuphidden", this.onPopupHidden);
        callback();
      }
    });
  }

  /**
   *
   * @param {number} screenX
   * @param {number} screenY
   * @param {SidebarSettings} settings
   */
  openPopupAtScreen(screenX, screenY, settings) {
    this.positionMenuList.setValue(settings.position);
    this.webPanelButtonsPositionMenuList.setValue(
      settings.webPanelButtonsPosition,
    );
    this.plusButtonPositionMenuList.setValue(settings.plusButtonPosition);
    this.paddingMenuList.setValue(settings.padding);
    this.faviconSizeMenuList.setValue(settings.faviconSize);
    this.unpinnedPaddingMenuList.setValue(settings.unpinnedPadding);
    this.hideInPopupWindowsToggle.setPressed(settings.hideInPopupWindows);
    this.autoHideBackToggle.setPressed(settings.autoHideBackButton);
    this.autoHideForwardToggle.setPressed(settings.autoHideForwardButton);

    this.settings = settings;

    this.onPopupHidden = () => {
      if (this.getState() !== "closed") {
        return;
      }
      this.#cancelChanges();
      this.removeEventListener("popuphidden", this.onPopupHidden);
    };
    this.addEventListener("popuphidden", this.onPopupHidden);

    Panel.prototype.openPopupAtScreen.call(this, screenX, screenY);
  }

  #cancelChanges() {
    if (this.positionMenuList.getValue() !== this.settings.position) {
      this.onPositionChange(this.settings.position);
    }
    if (
      this.webPanelButtonsPositionMenuList.getValue() !==
      this.settings.webPanelButtonsPosition
    ) {
      this.onWebPanelButtonsPositionChange(
        this.settings.webPanelButtonsPosition,
      );
    }
    if (
      this.plusButtonPositionMenuList.getValue() !==
      this.settings.plusButtonPosition
    ) {
      this.onPlusButtonPositionChange(this.settings.plusButtonPosition);
    }
    if (this.paddingMenuList.getValue() !== this.settings.padding) {
      this.onPaddingChange(this.settings.padding);
    }
    if (this.faviconSizeMenuList.getValue() !== this.settings.faviconSize) {
      this.onFaviconSizeChange(this.settings.faviconSize);
    }
    if (
      this.unpinnedPaddingMenuList.getValue() !== this.settings.unpinnedPadding
    ) {
      this.onUnpinnedPaddingChange(this.settings.unpinnedPadding);
    }
    if (
      this.hideInPopupWindowsToggle.getPressed() !==
      this.settings.hideInPopupWindows
    ) {
      this.onHideInPopupWindowsChange(this.settings.hideInPopupWindows);
    }
    if (
      this.autoHideBackToggle.getPressed() !== this.settings.autoHideBackButton
    ) {
      this.onAutoHideBackButtonChange(this.settings.autoHideBackButton);
    }
    if (
      this.autoHideForwardToggle.getPressed() !==
      this.settings.autoHideForwardButton
    ) {
      this.onAutoHideForwardButtonChange(this.settings.autoHideForwardButton);
    }
  }
}
