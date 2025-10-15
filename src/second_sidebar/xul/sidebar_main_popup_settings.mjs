import {
  createCancelButton,
  createMenuList,
  createPopupGroup,
  createPopupSet,
  createSaveButton,
} from "../utils/xul.mjs";

import { Div } from "./base/div.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { PopupBody } from "./popup_body.mjs";
import { PopupFooter } from "./popup_footer.mjs";
import { PopupHeader } from "./popup_header.mjs";
import { SidebarSettings } from "../settings/sidebar_settings.mjs"; // eslint-disable-line no-unused-vars
import { Toggle } from "./base/toggle.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

export class SidebarMainPopupSettings extends Panel {
  constructor() {
    super({
      id: "sb2-main-popup-settings",
      classList: ["sb2-popup", "sb2-popup-with-header"],
    });
    this.setType("arrow").setRole("group");

    this.positionMenuList = this.#createPositionMenuList();
    this.paddingMenuList = this.#createPaddingMenuList();
    this.newWebPanelPositionMenuList =
      this.#createNewWebPanelPositionMenuList();
    this.autoHideBackToggle = new Toggle();
    this.autoHideForwardToggle = new Toggle();
    this.defaultFloatingOffsetMenuList = this.#createPaddingMenuList();
    this.containerBorderMenuList = this.#createContainerBorderMenuList();
    this.tooltipMenuList = this.#createTooltipMenuList();
    this.tooltipFullUrlToggle = new Toggle();
    this.autoHideSidebarToggle = new Toggle();
    this.hideSidebarAnimatedToggle = new Toggle();
    this.hideToolbarAnimatedToggle = new Toggle();
    this.enableSidebarBoxHintToggle = new Toggle();
    this.saveButton = createSaveButton();
    this.cancelButton = createCancelButton();
    this.#compose();
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPositionMenuList() {
    const menuList = createMenuList();
    menuList.appendItem("Left", "left");
    menuList.appendItem("Right", "right");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPaddingMenuList() {
    const menuList = createMenuList();
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
  #createNewWebPanelPositionMenuList() {
    const menuList = createMenuList();
    menuList.appendItem("Before Plus Button", "before");
    menuList.appendItem("After Plus Button", "after");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createContainerBorderMenuList() {
    const menuList = createMenuList();
    menuList.appendItem("Left", "left");
    menuList.appendItem("Right", "right");
    menuList.appendItem("Top", "top");
    menuList.appendItem("Bottom", "bottom");
    menuList.appendItem("Around", "around");
    return menuList;
  }

  #createTooltipMenuList() {
    const menuList = createMenuList({
      id: "sb2-main-popup-settings-tooltip-menu-list",
    });
    menuList.appendItem("Off", "off");
    menuList.appendItem("Title", "title");
    menuList.appendItem("URL", "url");
    menuList.appendItem("Title and URL", "titleandurl");
    return menuList;
  }

  #compose() {
    this.appendChild(
      new PanelMultiView().appendChildren(
        new PopupHeader("Sidebar Settings"),
        new PopupBody().appendChildren(
          createPopupSet("", [
            createPopupGroup("Sidebar position", this.positionMenuList),
            new ToolbarSeparator(),
            createPopupGroup("Sidebar width", this.paddingMenuList),
            new ToolbarSeparator(),
            createPopupGroup("Auto-hide sidebar", this.autoHideSidebarToggle),
          ]),
          createPopupSet("Web panels", [
            createPopupGroup(
              "Default floating panel offset",
              this.defaultFloatingOffsetMenuList,
            ),
            new ToolbarSeparator(),
            createPopupGroup(
              "New panel position",
              this.newWebPanelPositionMenuList,
            ),
            new ToolbarSeparator(),
            createPopupGroup(
              "Container indicator position",
              this.containerBorderMenuList,
            ),
            new ToolbarSeparator(),
            createPopupGroup("Auto-hide back button", this.autoHideBackToggle),
            new ToolbarSeparator(),
            createPopupGroup(
              "Auto-hide forward button",
              this.autoHideForwardToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup(
              "Show web panel geometry hint",
              this.enableSidebarBoxHintToggle,
            ),
          ]),
          createPopupSet("Web panel tooltips", [
            createPopupGroup("Tooltip", this.tooltipMenuList),
            new Div({
              id: "sb2-main-popup-settings-tooltip-items",
            }).appendChildren(
              new ToolbarSeparator(),
              createPopupGroup("Show full URL", this.tooltipFullUrlToggle),
            ),
          ]),
          createPopupSet("Animations", [
            createPopupGroup(
              "Animate sidebar launcher",
              this.hideSidebarAnimatedToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup(
              "Animate sidebar toolbar",
              this.hideToolbarAnimatedToggle,
            ),
          ]),
        ),
        new PopupFooter().appendChildren(this.cancelButton, this.saveButton),
      ),
    );
  }

  /**
   *
   * @param {object} callbacks
   * @param {function(string):void} callbacks.position
   * @param {function(string):void} callbacks.padding
   * @param {function(string):void} callbacks.newWebPanelPosition
   * @param {function(string):void} callbacks.defaultFloatingOffset
   * @param {function(boolean):void} callbacks.autoHideBackButton
   * @param {function(boolean):void} callbacks.autoHideForwardButton
   * @param {function(boolean):void} callbacks.enableSidebarBoxHint
   * @param {function(string):void} callbacks.containerBorder
   * @param {function(string):void} callbacks.tooltip
   * @param {function(boolean):void} callbacks.tooltipFullUrl
   * @param {function(boolean):void} callbacks.autoHideSidebar
   * @param {function(boolean):void} callbacks.hideSidebarAnimated
   * @param {function(boolean):void} callbacks.hideToolbarAnimated
   */
  listenChanges({
    position,
    padding,
    newWebPanelPosition,
    defaultFloatingOffset,
    autoHideBackButton,
    autoHideForwardButton,
    enableSidebarBoxHint,
    containerBorder,
    tooltip,
    tooltipFullUrl,
    autoHideSidebar,
    hideSidebarAnimated,
    hideToolbarAnimated,
  }) {
    this.onPositionChange = position;
    this.onPaddingChange = padding;
    this.onNewWebPanelPositionChange = newWebPanelPosition;
    this.onDefaultFloatingOffsetChange = defaultFloatingOffset;
    this.onAutoHideBackButtonChange = autoHideBackButton;
    this.onAutoHideForwardButtonChange = autoHideForwardButton;
    this.onEnableSidebarBoxHintChange = enableSidebarBoxHint;
    this.onContainerBorderChange = containerBorder;
    this.onTooltipChange = tooltip;
    this.onTooltipFullUrlChange = tooltipFullUrl;
    this.onAutoHideSidebarChange = autoHideSidebar;
    this.onAutoHideSidebarAnimatedChange = hideSidebarAnimated;
    this.onAutoHideToolbarAnimatedChange = hideToolbarAnimated;

    this.positionMenuList.addEventListener("command", () =>
      position(this.positionMenuList.getValue()),
    );
    this.paddingMenuList.addEventListener("command", () =>
      padding(this.paddingMenuList.getValue()),
    );
    this.newWebPanelPositionMenuList.addEventListener("command", () =>
      newWebPanelPosition(this.newWebPanelPositionMenuList.getValue()),
    );
    this.defaultFloatingOffsetMenuList.addEventListener("command", () =>
      defaultFloatingOffset(this.defaultFloatingOffsetMenuList.getValue()),
    );
    this.autoHideBackToggle.addEventListener("toggle", () =>
      autoHideBackButton(this.autoHideBackToggle.getPressed()),
    );
    this.autoHideForwardToggle.addEventListener("toggle", () =>
      autoHideForwardButton(this.autoHideForwardToggle.getPressed()),
    );
    this.enableSidebarBoxHintToggle.addEventListener("toggle", () =>
      enableSidebarBoxHint(this.enableSidebarBoxHintToggle.getPressed()),
    );
    this.containerBorderMenuList.addEventListener("command", () =>
      containerBorder(this.containerBorderMenuList.getValue()),
    );
    this.tooltipMenuList.addEventListener("command", () =>
      tooltip(this.tooltipMenuList.getValue()),
    );
    this.tooltipFullUrlToggle.addEventListener("toggle", () =>
      tooltipFullUrl(this.tooltipFullUrlToggle.getPressed()),
    );
    this.autoHideSidebarToggle.addEventListener("toggle", () =>
      autoHideSidebar(this.autoHideSidebarToggle.getPressed()),
    );
    this.hideSidebarAnimatedToggle.addEventListener("toggle", () =>
      hideSidebarAnimated(this.hideSidebarAnimatedToggle.getPressed()),
    );
    this.hideToolbarAnimatedToggle.addEventListener("toggle", () =>
      hideToolbarAnimated(this.hideToolbarAnimatedToggle.getPressed()),
    );
  }

  /**
   *
   * @param {function():void} callback
   */
  listenCancelButtonClick(callback) {
    this.cancelButton.addEventListener("click", (event) => {
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
    this.saveButton.addEventListener("click", (event) => {
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
    this.paddingMenuList.setValue(settings.padding);
    this.newWebPanelPositionMenuList.setValue(settings.newWebPanelPosition);
    this.defaultFloatingOffsetMenuList.setValue(settings.defaultFloatingOffset);
    this.autoHideBackToggle.setPressed(settings.autoHideBackButton);
    this.autoHideForwardToggle.setPressed(settings.autoHideForwardButton);
    this.enableSidebarBoxHintToggle.setPressed(settings.enableSidebarBoxHint);
    this.containerBorderMenuList.setValue(settings.containerBorder);
    this.tooltipMenuList.setValue(settings.tooltip);
    this.tooltipFullUrlToggle.setPressed(settings.tooltipFullUrl);
    this.autoHideSidebarToggle.setPressed(settings.autoHideSidebar);
    this.hideSidebarAnimatedToggle.setPressed(settings.hideSidebarAnimated);
    this.hideToolbarAnimatedToggle.setPressed(settings.hideToolbarAnimated);

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
    if (this.paddingMenuList.getValue() !== this.settings.padding) {
      this.onPaddingChange(this.settings.padding);
    }
    if (
      this.newWebPanelPositionMenuList.getValue() !==
      this.settings.newWebPanelPosition
    ) {
      this.onNewWebPanelPositionChange(this.settings.newWebPanelPosition);
    }
    if (
      this.defaultFloatingOffsetMenuList.getValue() !==
      this.settings.defaultFloatingOffset
    ) {
      this.onDefaultFloatingOffsetChange(this.settings.defaultFloatingOffset);
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
    if (
      this.enableSidebarBoxHintToggle.getPressed() !==
      this.settings.enableSidebarBoxHint
    ) {
      this.onEnableSidebarBoxHintChange(this.settings.enableSidebarBoxHint);
    }
    if (
      this.containerBorderMenuList.getValue() !== this.settings.containerBorder
    ) {
      this.onContainerBorderChange(this.settings.containerBorder);
    }
    if (this.tooltipMenuList.getValue() !== this.settings.tooltip) {
      this.onTooltipChange(this.settings.tooltip);
    }
    if (
      this.tooltipFullUrlToggle.getPressed() !== this.settings.tooltipFullUrl
    ) {
      this.onTooltipFullUrlChange(this.settings.tooltipFullUrl);
    }
    if (
      this.autoHideSidebarToggle.getPressed() !== this.settings.autoHideSidebar
    ) {
      this.onAutoHideSidebarChange(this.settings.autoHideSidebar);
    }
    if (
      this.hideSidebarAnimatedToggle.getPressed() !==
      this.settings.hideSidebarAnimated
    ) {
      this.onAutoHideSidebarAnimatedChange(this.settings.hideSidebarAnimated);
    }
    if (
      this.hideToolbarAnimatedToggle.getPressed() !==
      this.settings.hideToolbarAnimated
    ) {
      this.onAutoHideToolbarAnimatedChange(this.settings.hideToolbarAnimated);
    }
  }
}
