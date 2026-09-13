import {
  createCancelButton,
  createInput,
  createMenuList,
  createPopupGroup,
  createPopupRow,
  createPopupSet,
  createSaveButton,
  createSubviewIconicButton,
} from "../utils/xul.mjs";

import { BrowserElements } from "../browser_elements.mjs";
import { Div } from "./base/div.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { PopupBody } from "./popup_body.mjs";
import { PopupDiscardConfirmation } from "./popup_discard_confirmation.mjs";
import { PopupFooter } from "./popup_footer.mjs";
import { PopupHeader } from "./popup_header.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarSettings } from "../settings/sidebar_settings.mjs"; // eslint-disable-line no-unused-vars
import { Toggle } from "./base/toggle.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { VBox } from "./base/vbox.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

const ICONS = {
  UNDO: "chrome://global/skin/icons/undo.svg",
};

export class SidebarMainPopupSettings extends Panel {
  constructor() {
    super({
      id: "sb2-main-popup-settings",
      classList: ["sb2-popup", "sb2-popup-with-header"],
    });
    this.setType("arrow")
      .setRole("group")
      .setAttribute("noautohide", "true")
      .setAttribute("consumeoutsideclicks", "false")
      .setAttribute("level", "parent");

    this.positionMenuList = this.#createPositionMenuList();
    this.paddingMenuList = this.#createPaddingMenuList();
    this.allowWindowDraggingToggle = new Toggle({
      id: "sb2-main-popup-settings-allow-window-dragging-toggle",
    });
    this.newWebPanelPositionMenuList =
      this.#createNewWebPanelPositionMenuList();
    this.autoHideBackToggle = new Toggle();
    this.autoHideForwardToggle = new Toggle();
    this.defaultFloatingOffsetMenuList = this.#createPaddingMenuList();
    this.containerBorderMenuList = this.#createContainerBorderMenuList();
    this.tooltipMenuList = this.#createTooltipMenuList();
    this.tooltipFullUrlToggle = new Toggle();
    this.autoHideSidebarToggle = new Toggle({
      id: "sb2-main-popup-settings-auto-hide-sidebar-toggle",
    });
    this.autoHideSidebarBehaviorMenuList =
      this.#createAutoHideSidebarBehaviorMenuList();
    this.sidebarWidgetHideWebPanelToggle = new Toggle();
    this.sidebarWidgetShortcutInput = createInput({
      placeholder: "Click here and press keys...",
    });
    this.sidebarWidgetShortcutResetButton = createSubviewIconicButton(
      ICONS.UNDO,
      {
        tooltipText: "Reset shortcut",
      },
    );
    this.lastWebPanelShortcutInput = createInput({
      placeholder: "Click here and press keys...",
    });
    this.lastWebPanelShortcutResetButton = createSubviewIconicButton(
      ICONS.UNDO,
      {
        tooltipText: "Reset shortcut",
      },
    );
    this.hideSidebarAnimatedToggle = new Toggle();
    this.hideToolbarAnimatedToggle = new Toggle();
    this.enableSidebarBoxHintToggle = new Toggle();
    this.saveButton = createSaveButton();
    this.cancelButton = createCancelButton();
    this.discardConfirmation = new PopupDiscardConfirmation({
      onDiscard: () => this.#discardChangesAndClose(),
    });
    this.backdrop = new VBox({
      id: "sb2-main-popup-settings-backdrop",
    }).hide();
    this.#setupListeners();
    this.#compose();
    BrowserElements.root.appendChild(this.backdrop);

    this.editSessionActive = false;
  }

  #setupListeners() {
    this.backdrop.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    this.backdrop.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isLeftMouseButton(event)) {
        this.#requestClose();
      }
    });
    this.backdrop.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    this.addEventListener("popupshown", (event) => {
      if (event.target === this.getXUL()) {
        this.backdrop.show();
        SidebarControllers.webPanelsShortcuts.disable();
      }
    });
    this.addEventListener("popuphidden", (event) => {
      if (event.target === this.getXUL()) {
        this.backdrop.hide();
        SidebarControllers.webPanelsShortcuts.enable();
      }
    });

    this.#setupShortcutListeners(
      this.sidebarWidgetShortcutInput,
      this.sidebarWidgetShortcutResetButton,
      (shortcut, event) =>
        SidebarControllers.webPanelsShortcuts.isSidebarWidgetShortcutBusy(
          shortcut,
          event,
        ),
    );
    this.#setupShortcutListeners(
      this.lastWebPanelShortcutInput,
      this.lastWebPanelShortcutResetButton,
      (shortcut, event) =>
        SidebarControllers.webPanelsShortcuts.isLastWebPanelShortcutBusy(
          shortcut,
          event,
        ),
    );
  }

  #setupShortcutListeners(input, resetButton, isShortcutBusy) {
    resetButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        input
          .setValue("")
          .removeAttribute("error")
          .dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    input.addEventListener("keypress", (event) => {
      event.preventDefault();

      const parts =
        SidebarControllers.webPanelsShortcuts.getShortcutPartsFromEvent(event);
      const shortcut = parts.join("+");

      if (isShortcutBusy(shortcut, event)) {
        input
          .setValue(`Shortcut ${shortcut} is busy`)
          .setAttribute("error", true)
          .dispatchEvent(new Event("error", { bubbles: true }));
        return;
      }

      input.removeAttribute("error");
      input
        .setValue(parts.join("+"))
        .dispatchEvent(new Event("input", { bubbles: true }));
    });
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
    menuList.appendItem("Off", "off");
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

  #createAutoHideSidebarBehaviorMenuList() {
    const menuList = createMenuList();
    menuList.appendItem("Inline", "inline");
    menuList.appendItem("Overlay", "overlay");
    return menuList;
  }

  #compose() {
    this.appendChild(
      new PanelMultiView().appendChildren(
        new PopupHeader("Sidebar Settings"),
        new PopupBody().appendChildren(
          createPopupSet("", [
            createPopupGroup("Position", this.positionMenuList),
            new ToolbarSeparator(),
            createPopupGroup("Width", this.paddingMenuList),
            new ToolbarSeparator(),
            createPopupGroup(
              "Allow window dragging",
              this.allowWindowDraggingToggle,
            ),
          ]),
          createPopupSet("Visibility", [
            createPopupGroup("Auto-hide sidebar", this.autoHideSidebarToggle),
            new ToolbarSeparator(),
            new Div({
              id: "sb2-main-popup-settings-auto-hide-sidebar-items",
            }).appendChildren(
              createPopupGroup(
                "Auto-hide behavior",
                this.autoHideSidebarBehaviorMenuList,
              ),
            ),
            new Div({
              id: "sb2-main-popup-settings-sidebar-widget-items",
            }).appendChildren(
              createPopupGroup(
                "Hide web panel when sidebar is hidden",
                this.sidebarWidgetHideWebPanelToggle,
              ),
              new ToolbarSeparator(),
              createPopupRow(
                this.sidebarWidgetShortcutInput,
                this.sidebarWidgetShortcutResetButton,
              ),
            ),
          ]),
          createPopupSet("Web panel", [
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
              "Show geometry hint",
              this.enableSidebarBoxHintToggle,
            ),
          ]),
          createPopupSet("Open/close last active web panel", [
            createPopupRow(
              this.lastWebPanelShortcutInput,
              this.lastWebPanelShortcutResetButton,
            ),
          ]),
          createPopupSet("Web panel button", [
            createPopupGroup(
              "Container indicator",
              this.containerBorderMenuList,
            ),
            new ToolbarSeparator(),
            createPopupGroup("Tooltip", this.tooltipMenuList),
            new Div({
              id: "sb2-main-popup-settings-tooltip-items",
            }).appendChildren(
              new ToolbarSeparator(),
              createPopupGroup(
                "Show full URL in tooltip",
                this.tooltipFullUrlToggle,
              ),
            ),
          ]),
          createPopupSet("Web panel toolbar", [
            createPopupGroup(
              "Auto-hide forward button",
              this.autoHideForwardToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup("Auto-hide back button", this.autoHideBackToggle),
          ]),
          createPopupSet("Animations", [
            createPopupGroup("Animate sidebar", this.hideSidebarAnimatedToggle),
            new ToolbarSeparator(),
            createPopupGroup(
              "Animate web panel toolbar",
              this.hideToolbarAnimatedToggle,
            ),
          ]),
        ),
        new PopupFooter().appendChildren(this.cancelButton, this.saveButton),
        this.discardConfirmation,
      ),
    );
  }

  /**
   *
   * @param {object} callbacks
   * @param {function(string):void} callbacks.position
   * @param {function(string):void} callbacks.padding
   * @param {function(boolean):void} callbacks.allowWindowDragging
   * @param {function(string):void} callbacks.newWebPanelPosition
   * @param {function(string):void} callbacks.defaultFloatingOffset
   * @param {function(boolean):void} callbacks.autoHideBackButton
   * @param {function(boolean):void} callbacks.autoHideForwardButton
   * @param {function(boolean):void} callbacks.enableSidebarBoxHint
   * @param {function(string):void} callbacks.containerBorder
   * @param {function(string):void} callbacks.tooltip
   * @param {function(boolean):void} callbacks.tooltipFullUrl
   * @param {function(boolean, string, boolean, string):void} callbacks.visibility
   * @param {function(string):void} callbacks.lastWebPanelShortcut
   * @param {function(boolean):void} callbacks.hideSidebarAnimated
   * @param {function(boolean):void} callbacks.hideToolbarAnimated
   */
  listenChanges({
    position,
    padding,
    allowWindowDragging,
    newWebPanelPosition,
    defaultFloatingOffset,
    autoHideBackButton,
    autoHideForwardButton,
    enableSidebarBoxHint,
    containerBorder,
    tooltip,
    tooltipFullUrl,
    visibility,
    lastWebPanelShortcut,
    hideSidebarAnimated,
    hideToolbarAnimated,
  }) {
    this.onPositionChange = position;
    this.onPaddingChange = padding;
    this.onAllowWindowDraggingChange = allowWindowDragging;
    this.onNewWebPanelPositionChange = newWebPanelPosition;
    this.onDefaultFloatingOffsetChange = defaultFloatingOffset;
    this.onAutoHideBackButtonChange = autoHideBackButton;
    this.onAutoHideForwardButtonChange = autoHideForwardButton;
    this.onEnableSidebarBoxHintChange = enableSidebarBoxHint;
    this.onContainerBorderChange = containerBorder;
    this.onTooltipChange = tooltip;
    this.onTooltipFullUrlChange = tooltipFullUrl;
    this.onVisibilityChange = visibility;
    this.onLastWebPanelShortcutChange = lastWebPanelShortcut;
    this.onAutoHideSidebarAnimatedChange = hideSidebarAnimated;
    this.onAutoHideToolbarAnimatedChange = hideToolbarAnimated;

    this.positionMenuList.addEventListener("command", () =>
      position(this.positionMenuList.getValue()),
    );
    this.paddingMenuList.addEventListener("command", () =>
      padding(this.paddingMenuList.getValue()),
    );
    this.allowWindowDraggingToggle.addEventListener("toggle", () =>
      allowWindowDragging(this.allowWindowDraggingToggle.getPressed()),
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
      visibility(
        this.autoHideSidebarToggle.getPressed(),
        this.autoHideSidebarBehaviorMenuList.getValue(),
        this.sidebarWidgetHideWebPanelToggle.getPressed(),
        this.sidebarWidgetShortcutInput.getValue(),
      ),
    );
    this.autoHideSidebarBehaviorMenuList.addEventListener("command", () =>
      visibility(
        this.autoHideSidebarToggle.getPressed(),
        this.autoHideSidebarBehaviorMenuList.getValue(),
        this.sidebarWidgetHideWebPanelToggle.getPressed(),
        this.sidebarWidgetShortcutInput.getValue(),
      ),
    );
    this.sidebarWidgetHideWebPanelToggle.addEventListener("toggle", () =>
      visibility(
        this.autoHideSidebarToggle.getPressed(),
        this.autoHideSidebarBehaviorMenuList.getValue(),
        this.sidebarWidgetHideWebPanelToggle.getPressed(),
        this.sidebarWidgetShortcutInput.getValue(),
      ),
    );
    this.sidebarWidgetShortcutInput.addEventListener("input", () =>
      visibility(
        this.autoHideSidebarToggle.getPressed(),
        this.autoHideSidebarBehaviorMenuList.getValue(),
        this.sidebarWidgetHideWebPanelToggle.getPressed(),
        this.sidebarWidgetShortcutInput.getValue(),
      ),
    );
    this.sidebarWidgetShortcutInput.addEventListener("error", () =>
      visibility(
        this.autoHideSidebarToggle.getPressed(),
        this.autoHideSidebarBehaviorMenuList.getValue(),
        this.sidebarWidgetHideWebPanelToggle.getPressed(),
        this.settings.sidebarWidgetShortcut,
      ),
    );
    this.lastWebPanelShortcutInput.addEventListener("input", () =>
      lastWebPanelShortcut(this.lastWebPanelShortcutInput.getValue()),
    );
    this.lastWebPanelShortcutInput.addEventListener("error", () =>
      lastWebPanelShortcut(this.settings.lastWebPanelShortcut),
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
        this.#endEditSession();
        callback();
      }
    });
  }

  /**
   * @returns {SidebarMainPopupSettings}
   */
  hidePopup() {
    this.#requestClose();
    return this;
  }

  /**
   *
   * @param {number} screenX
   * @param {number} screenY
   * @param {SidebarSettings} settings
   */
  openPopupAtScreen(screenX, screenY, settings) {
    if (this.editSessionActive) {
      this.#cancelChanges();
    }
    this.#endEditSession();
    this.positionMenuList.setValue(settings.position);
    this.paddingMenuList.setValue(settings.padding);
    this.allowWindowDraggingToggle.setPressed(settings.allowWindowDragging);
    this.newWebPanelPositionMenuList.setValue(settings.newWebPanelPosition);
    this.defaultFloatingOffsetMenuList.setValue(settings.defaultFloatingOffset);
    this.autoHideBackToggle.setPressed(settings.autoHideBackButton);
    this.autoHideForwardToggle.setPressed(settings.autoHideForwardButton);
    this.enableSidebarBoxHintToggle.setPressed(settings.enableSidebarBoxHint);
    this.containerBorderMenuList.setValue(settings.containerBorder);
    this.tooltipMenuList.setValue(settings.tooltip);
    this.tooltipFullUrlToggle.setPressed(settings.tooltipFullUrl);
    this.autoHideSidebarToggle.setPressed(settings.autoHideSidebar);
    this.autoHideSidebarBehaviorMenuList.setValue(
      settings.autoHideSidebarBehavior,
    );
    this.sidebarWidgetHideWebPanelToggle.setPressed(
      settings.sidebarWidgetHideWebPanel,
    );
    this.sidebarWidgetShortcutInput
      .setValue(settings.sidebarWidgetShortcut)
      .removeAttribute("error");
    this.lastWebPanelShortcutInput
      .setValue(settings.lastWebPanelShortcut)
      .removeAttribute("error");
    this.hideSidebarAnimatedToggle.setPressed(settings.hideSidebarAnimated);
    this.hideToolbarAnimatedToggle.setPressed(settings.hideToolbarAnimated);

    this.settings = settings;
    this.editSessionActive = true;

    this.closeOnPopupHidden = (event) => {
      if (event.target !== this.getXUL() || this.getState() !== "closed") {
        return;
      }
      this.#cancelChanges();
      this.#endEditSession();
    };
    this.escapeOnKeyDown = (event) => {
      if (event.key !== "Escape" || !this.editSessionActive) {
        return;
      }
      if (this.#hasOpenPopupAboveEditor()) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (this.discardConfirmation.isVisible()) {
        this.discardConfirmation.hide();
        return;
      }
      this.#requestClose();
    };
    this.addEventListener("popuphidden", this.closeOnPopupHidden);
    window.addEventListener("keydown", this.escapeOnKeyDown, true);

    Panel.prototype.openPopupAtScreen.call(this, screenX, screenY);
  }

  #requestClose() {
    if (this.editSessionActive && this.#hasChanges()) {
      this.discardConfirmation.show();
      return;
    }
    Panel.prototype.hidePopup.call(this);
  }

  #discardChangesAndClose() {
    this.#cancelChanges();
    this.#endEditSession();
    Panel.prototype.hidePopup.call(this);
  }

  #endEditSession() {
    this.editSessionActive = false;
    this.#removeCloseListeners();
    this.backdrop.hide();
    this.discardConfirmation.hide({ restoreFocus: false });
  }

  #removeCloseListeners() {
    if (this.closeOnPopupHidden) {
      this.removeEventListener("popuphidden", this.closeOnPopupHidden);
      this.closeOnPopupHidden = null;
    }
    if (this.escapeOnKeyDown) {
      window.removeEventListener("keydown", this.escapeOnKeyDown, true);
      this.escapeOnKeyDown = null;
    }
  }

  #hasOpenPopupAboveEditor() {
    return Array.from(document.querySelectorAll("menupopup, panel")).some(
      (popup) =>
        popup !== this.getXUL() &&
        ["open", "showing", "hiding"].includes(popup.state),
    );
  }

  #hasChanges() {
    return this.#getChangeReverters().length > 0;
  }

  #cancelChanges() {
    for (const revert of this.#getChangeReverters()) {
      revert();
    }
  }

  #getChangeReverters() {
    const reverters = [];

    if (this.positionMenuList.getValue() !== this.settings.position) {
      reverters.push(() => this.onPositionChange(this.settings.position));
    }
    if (this.paddingMenuList.getValue() !== this.settings.padding) {
      reverters.push(() => this.onPaddingChange(this.settings.padding));
    }
    if (
      this.allowWindowDraggingToggle.getPressed() !==
      this.settings.allowWindowDragging
    ) {
      reverters.push(() =>
        this.onAllowWindowDraggingChange(this.settings.allowWindowDragging),
      );
    }
    if (
      this.newWebPanelPositionMenuList.getValue() !==
      this.settings.newWebPanelPosition
    ) {
      reverters.push(() =>
        this.onNewWebPanelPositionChange(this.settings.newWebPanelPosition),
      );
    }
    if (
      this.defaultFloatingOffsetMenuList.getValue() !==
      this.settings.defaultFloatingOffset
    ) {
      reverters.push(() =>
        this.onDefaultFloatingOffsetChange(this.settings.defaultFloatingOffset),
      );
    }
    if (
      this.autoHideBackToggle.getPressed() !== this.settings.autoHideBackButton
    ) {
      reverters.push(() =>
        this.onAutoHideBackButtonChange(this.settings.autoHideBackButton),
      );
    }
    if (
      this.autoHideForwardToggle.getPressed() !==
      this.settings.autoHideForwardButton
    ) {
      reverters.push(() =>
        this.onAutoHideForwardButtonChange(this.settings.autoHideForwardButton),
      );
    }
    if (
      this.enableSidebarBoxHintToggle.getPressed() !==
      this.settings.enableSidebarBoxHint
    ) {
      reverters.push(() =>
        this.onEnableSidebarBoxHintChange(this.settings.enableSidebarBoxHint),
      );
    }
    if (
      this.containerBorderMenuList.getValue() !== this.settings.containerBorder
    ) {
      reverters.push(() =>
        this.onContainerBorderChange(this.settings.containerBorder),
      );
    }
    if (this.tooltipMenuList.getValue() !== this.settings.tooltip) {
      reverters.push(() => this.onTooltipChange(this.settings.tooltip));
    }
    if (
      this.tooltipFullUrlToggle.getPressed() !== this.settings.tooltipFullUrl
    ) {
      reverters.push(() =>
        this.onTooltipFullUrlChange(this.settings.tooltipFullUrl),
      );
    }

    const sidebarWidgetShortcut = this.sidebarWidgetShortcutInput.hasAttribute(
      "error",
    )
      ? this.settings.sidebarWidgetShortcut
      : this.sidebarWidgetShortcutInput.getValue();
    if (
      this.autoHideSidebarToggle.getPressed() !==
        this.settings.autoHideSidebar ||
      this.autoHideSidebarBehaviorMenuList.getValue() !==
        this.settings.autoHideSidebarBehavior ||
      this.sidebarWidgetHideWebPanelToggle.getPressed() !==
        this.settings.sidebarWidgetHideWebPanel ||
      sidebarWidgetShortcut !== this.settings.sidebarWidgetShortcut
    ) {
      reverters.push(() =>
        this.onVisibilityChange(
          this.settings.autoHideSidebar,
          this.settings.autoHideSidebarBehavior,
          this.settings.sidebarWidgetHideWebPanel,
          this.settings.sidebarWidgetShortcut,
        ),
      );
    }
    if (
      this.hideSidebarAnimatedToggle.getPressed() !==
      this.settings.hideSidebarAnimated
    ) {
      reverters.push(() =>
        this.onAutoHideSidebarAnimatedChange(this.settings.hideSidebarAnimated),
      );
    }

    const lastWebPanelShortcut = this.lastWebPanelShortcutInput.hasAttribute(
      "error",
    )
      ? this.settings.lastWebPanelShortcut
      : this.lastWebPanelShortcutInput.getValue();
    if (lastWebPanelShortcut !== this.settings.lastWebPanelShortcut) {
      reverters.push(() =>
        this.onLastWebPanelShortcutChange(this.settings.lastWebPanelShortcut),
      );
    }
    if (
      this.hideToolbarAnimatedToggle.getPressed() !==
      this.settings.hideToolbarAnimated
    ) {
      reverters.push(() =>
        this.onAutoHideToolbarAnimatedChange(this.settings.hideToolbarAnimated),
      );
    }

    return reverters;
  }
}
