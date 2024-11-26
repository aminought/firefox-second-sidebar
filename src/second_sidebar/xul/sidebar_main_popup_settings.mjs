/* eslint-disable no-unused-vars */
import { Button } from "./base/button.mjs";
import { HBox } from "./base/hbox.mjs";
import { Header } from "./base/header.mjs";
import { MenuList } from "./base/menulist.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { XULElement } from "./base/xul_element.mjs";
/* eslint-enable no-unused-vars */

export class SidebarMainPopupSettings extends Panel {
  constructor() {
    super({
      id: "sidebar-2-main-popup-settings",
      classList: ["sidebar-2-popup"],
    });
    this.setType("arrow").setRole("group");

    this.panelHeader = new HBox({ classList: ["panel-header"] });
    this.header = new Header(1).setText("Sidebar Settings");

    this.saveButton = this.#createSaveButton();
    this.cancelButton = this.#createCancelButton();
    this.buttons = new HBox({
      id: "sidebar-2-main-popup-settings-buttons",
    });

    this.positionMenuList = this.#createPositionMenuList();
    this.positionGroup = this.#createGroup(
      this.positionMenuList,
      "Sidebar position",
    );

    this.widthMenuList = this.#createWidthMenuList();
    this.widthGroup = this.#createGroup(this.widthMenuList, "Sidebar width");

    this.hideInPopupWindowsToggle = this.#createToggle();
    this.hideInPopupWindowsGroup = this.#createGroup(
      this.hideInPopupWindowsToggle,
      "Hide sidebar in popup windows",
    );

    this.autoHideBackToggle = this.#createToggle();
    this.autoHideBackGroup = this.#createGroup(
      this.autoHideBackToggle,
      "Auto hide back button",
    );
    this.autoHideForwardToggle = this.#createToggle();
    this.autoHideForwardGroup = this.#createGroup(
      this.autoHideForwardToggle,
      "Auto hide forward button",
    );
    this.multiView = this.#createMultiView();

    this.addEventListener("popupshown", () => {});
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPositionMenuList() {
    const positionMenuList = new MenuList();
    positionMenuList.appendItem("Left", "left");
    positionMenuList.appendItem("Right", "right");
    return positionMenuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createWidthMenuList() {
    const widthMenuList = new MenuList();
    widthMenuList.appendItem("Tiny", "xxsmall");
    widthMenuList.appendItem("Very small", "xsmall");
    widthMenuList.appendItem("Small", "small");
    widthMenuList.appendItem("Medium", "medium");
    widthMenuList.appendItem("Large", "large");
    return widthMenuList;
  }

  /**
   *
   * @returns {Button}
   */
  #createToggle() {
    const button = new Button({
      id: "moz-toggle-button",
      classList: ["toggle-button"],
    });
    button.setAttribute("part", "button");
    button.setAttribute("type", "button");

    button.addEventListener("click", (event) => {
      if (event.button === 0) {
        button.setPressed(!button.getPressed());
      }
    });

    return button;
  }

  /**
   *
   * @param {XULElement} element
   * @param {string} text
   * @returns {HBox}
   */
  #createGroup(element, text) {
    const box = new HBox({
      classList: ["sidebar-2-popup-group"],
    });
    const label = new Header(1).setText(text);
    box.appendChildren(label, element);
    return box;
  }

  /**
   *
   * @returns {PanelMultiView}
   */
  #createMultiView() {
    this.panelHeader.appendChild(this.header);
    this.buttons.appendChild(this.cancelButton).appendChild(this.saveButton);
    const multiView = new PanelMultiView({
      id: "sidebar-2-main-popup-settings-multiview",
    }).appendChildren(
      this.panelHeader,
      new ToolbarSeparator(),
      this.positionGroup,
      this.widthGroup,
      this.hideInPopupWindowsGroup,
      this.autoHideBackGroup,
      this.autoHideForwardGroup,
      this.buttons,
    );

    this.appendChild(multiView);
    return multiView;
  }

  /**
   *
   * @returns {Button}
   */
  #createSaveButton() {
    return new Button({
      classList: ["footer-button", "primary"],
    }).setText("Save");
  }

  /**
   *
   * @param {function(string, boolean, boolean, boolean):void} callback
   */
  listenSaveButtonClick(callback) {
    this.saveButton.addEventListener("mousedown", (event) => {
      if (event.button !== 0) {
        return;
      }
      const position = this.positionMenuList.getValue();
      const width = this.widthMenuList.getValue();
      const hideInPopupWindows = this.hideInPopupWindowsToggle.getPressed();
      const autoHideBackButton = this.autoHideBackToggle.getPressed();
      const autoHideForwardButton = this.autoHideForwardToggle.getPressed();
      callback(
        position,
        width,
        hideInPopupWindows,
        autoHideBackButton,
        autoHideForwardButton,
      );
    });
  }

  /**
   *
   * @returns {Button}
   */
  #createCancelButton() {
    return new Button({ classList: ["footer-button"] }).setText("Cancel");
  }

  /**
   *
   * @param {function():void} callback
   */
  listenCancelButtonClick(callback) {
    this.cancelButton.addEventListener("mousedown", async (event) => {
      if (event.button !== 0) {
        return;
      }
      callback();
    });
  }

  /**
   *
   * @param {string} position
   * @param {string} width
   * @param {boolean} hideInPopupWindows
   * @param {boolean} autoHideBackButton
   * @param {boolean} autoHideForwardButton
   */
  setDefaults(
    position,
    width,
    hideInPopupWindows,
    autoHideBackButton,
    autoHideForwardButton,
  ) {
    this.positionMenuList.setValue(position);
    this.widthMenuList.setValue(width);
    this.hideInPopupWindowsToggle.setPressed(hideInPopupWindows);
    this.autoHideBackToggle.setPressed(autoHideBackButton);
    this.autoHideForwardToggle.setPressed(autoHideForwardButton);
  }
}
