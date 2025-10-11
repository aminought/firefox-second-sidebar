import {
  applyContainerColor,
  fillContainerMenuList,
} from "../utils/containers.mjs";
import {
  createCancelButton,
  createInput,
  createMenuList,
  createPopupGroup,
  createPopupRow,
  createPopupSet,
  createSaveButton,
  createSubviewButton,
  createSubviewIconicButton,
  createZoomButtons,
  updateZoomButtons,
} from "../utils/xul.mjs";

import { Div } from "./base/div.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { PopupBody } from "./popup_body.mjs";
import { PopupFooter } from "./popup_footer.mjs";
import { PopupHeader } from "./popup_header.mjs";
import { Toggle } from "./base/toggle.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { WebPanelController } from "../controllers/web_panel.mjs"; // eslint-disable-line no-unused-vars
import { fetchIconURL } from "../utils/icons.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

const ICONS = {
  UNDO: "chrome://global/skin/icons/undo.svg",
  MINUS: "chrome://global/skin/icons/minus.svg",
  PLUS: "chrome://global/skin/icons/plus.svg",
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;

export class WebPanelPopupEdit extends Panel {
  constructor() {
    super({
      id: "sb2-web-panel-edit",
      classList: ["sb2-popup", "sb2-popup-with-header"],
    });
    this.setType("arrow").setRole("group");

    this.urlInput = createInput({ placeholder: "Web page URL" });
    this.selectorToggle = new Toggle({ id: "sb2-popup-css-selector-toggle" });
    this.selectorInput = createInput({
      id: "sb2-popup-css-selector-input",
      placeholder: ".class-name, #id, tag-name, etc",
    });
    this.faviconURLInput = createInput({ placeholder: "Favicon URL" });
    this.faviconResetButton = createSubviewIconicButton(ICONS.UNDO, {
      tooltipText: "Request favicon",
    });
    this.pinnedMenuList = this.#createPinTypeMenuList();
    this.floatingAnchorMenuList = this.#createFloatingAnchorMenuList();
    this.offsetXTypeMenuList = this.#createDimensionTypeMenuList();
    this.offsetYTypeMenuList = this.#createDimensionTypeMenuList();
    this.widthTypeMenuList = this.#createDimensionTypeMenuList();
    this.heightTypeMenuList = this.#createDimensionTypeMenuList();
    this.containerMenuList = createMenuList({ id: "sb2-container-menu-list" });
    this.temporaryToggle = new Toggle();
    this.mobileToggle = new Toggle();
    this.loadOnStartupToggle = new Toggle();
    this.unloadOnCloseToggle = new Toggle();
    this.shortcutToggle = new Toggle({ id: "sb2-popup-shortcut-toggle" });
    this.shortcutInput = createInput({
      placeholder: "Click here and press keys...",
    });
    this.shortcutResetButton = createSubviewIconicButton(ICONS.UNDO, {
      tooltipText: "Reset shortcut",
    });
    this.hideToolbarToggle = new Toggle();
    this.hideSoundIconToggle = new Toggle();
    this.hideNotificationBadgeToggle = new Toggle();
    this.periodicReloadMenuList = this.#createPeriodicReloadMenuList();
    this.zoomOutButton = createSubviewIconicButton(ICONS.MINUS, {
      tooltipText: "Zoom Out",
    });
    this.resetZoomButton = createSubviewButton("100%", {
      id: "sb2-zoom-button",
      tooltipText: "Reset Zoom",
    });
    this.zoomInButton = createSubviewIconicButton(ICONS.PLUS, {
      tooltipText: "Zoom In",
    });
    this.cancelButton = createCancelButton();
    this.saveButton = createSaveButton();
    this.#setupListeners();
    this.#compose();

    this.zoom = 1;
  }

  #setupListeners() {
    this.faviconResetButton.addEventListener("click", async (event) => {
      if (isLeftMouseButton(event)) {
        const faviconURL = await fetchIconURL(this.urlInput.getValue());
        this.faviconURLInput
          .setValue(faviconURL)
          .dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    this.shortcutResetButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.shortcutInput
          .setValue("")
          .dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    this.shortcutInput.addEventListener("keypress", (event) => {
      event.preventDefault();
      const parts = [];
      if (event.altKey) parts.push("Alt");
      if (event.ctrlKey) parts.push("Ctrl");
      if (event.metaKey) parts.push("Meta");
      if (event.shiftKey) parts.push("Shift");
      parts.push(event.key.toUpperCase());
      this.shortcutInput
        .setValue(parts.join("+"))
        .dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPinTypeMenuList() {
    const pinTypeMenuList = createMenuList({
      id: "sb2-popup-pin-type-menu-list",
    });
    pinTypeMenuList.appendItem("Pinned", true);
    pinTypeMenuList.appendItem("Floating", false);
    return pinTypeMenuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createFloatingAnchorMenuList() {
    const menuList = createMenuList();
    menuList.appendItem("Default", "default");
    menuList.appendItem("Top-left", "topleft");
    menuList.appendItem("Top-right", "topright");
    menuList.appendItem("Bottom-left", "bottomleft");
    menuList.appendItem("Bottom-right", "bottomright");
    menuList.appendItem("Center", "center");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createDimensionTypeMenuList() {
    const menuList = createMenuList();
    menuList.appendItem("Absolute", "absolute");
    menuList.appendItem("Relative", "relative");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPeriodicReloadMenuList() {
    const menuList = createMenuList();
    menuList.appendItem("Never", 0);
    menuList.appendItem("5 seconds", 5 * SECOND);
    menuList.appendItem("10 seconds", 10 * SECOND);
    menuList.appendItem("30 seconds", 30 * SECOND);
    menuList.appendItem("1 minute", MINUTE);
    menuList.appendItem("2 minutes", 2 * MINUTE);
    menuList.appendItem("5 minutes", 5 * MINUTE);
    menuList.appendItem("10 minutes", 10 * MINUTE);
    menuList.appendItem("30 minutes", 30 * MINUTE);
    menuList.appendItem("60 minutes", 60 * MINUTE);
    menuList.appendItem("90 minutes", 90 * MINUTE);
    return menuList;
  }

  #compose() {
    this.appendChildren(
      new PanelMultiView().appendChildren(
        new PopupHeader("Edit Web Panel"),
        new PopupBody().appendChildren(
          createPopupSet("", [
            createPopupRow(this.urlInput),
            new ToolbarSeparator(),
            createPopupGroup("Multi-Account Container", this.containerMenuList),
            new ToolbarSeparator(),
            createPopupGroup("Temporary", this.temporaryToggle),
            new ToolbarSeparator(),
            createPopupGroup("Mobile View", this.mobileToggle),
            new ToolbarSeparator(),
            createPopupGroup(
              "Zoom",
              createZoomButtons(
                this.zoomOutButton,
                this.resetZoomButton,
                this.zoomInButton,
              ),
            ),
          ]),
          createPopupSet("Favicon", [
            createPopupRow(this.faviconURLInput, this.faviconResetButton),
          ]),
          createPopupSet("Position and size", [
            createPopupGroup("Mode", this.pinnedMenuList),
            new Div({
              id: "sb2-popup-floating-items",
            }).appendChildren(
              new ToolbarSeparator(),
              createPopupGroup("Position anchor", this.floatingAnchorMenuList),
              new ToolbarSeparator(),
              createPopupGroup("Horizontal offset", this.offsetXTypeMenuList),
              new ToolbarSeparator(),
              createPopupGroup("Vertical offset", this.offsetYTypeMenuList),
              new ToolbarSeparator(),
              createPopupGroup("Width", this.widthTypeMenuList),
              new ToolbarSeparator(),
              createPopupGroup("Height", this.heightTypeMenuList),
            ),
          ]),
          createPopupSet("Loading", [
            createPopupGroup(
              "Load into memory at startup",
              this.loadOnStartupToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup(
              "Unload from memory after closing",
              this.unloadOnCloseToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup("Periodic reload", this.periodicReloadMenuList),
          ]),
          createPopupSet("Keyboard shortcut", [
            createPopupGroup("Enable", this.shortcutToggle),
            new Div({ id: "sb2-popup-shortcut-items" }).appendChildren(
              new ToolbarSeparator(),
              createPopupRow(this.shortcutInput, this.shortcutResetButton),
            ),
          ]),
          createPopupSet("CSS selector", [
            createPopupGroup("Enable", this.selectorToggle),
            new Div({ id: "sb2-popup-css-selector-items" }).appendChildren(
              new ToolbarSeparator(),
              createPopupRow(this.selectorInput),
            ),
          ]),
          createPopupSet("Hide elements", [
            createPopupGroup("Hide toolbar", this.hideToolbarToggle),
            new ToolbarSeparator(),
            createPopupGroup("Hide sound icon", this.hideSoundIconToggle),
            new ToolbarSeparator(),
            createPopupGroup(
              "Hide notification badge",
              this.hideNotificationBadgeToggle,
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
   * @param {function(string, string, number):void} callbacks.url
   * @param {function(string, boolean):void} callbacks.selectorEnabled
   * @param {function(string, string):void} callbacks.selector
   * @param {function(string, string, number):void} callbacks.faviconURL
   * @param {function(string, boolean):void} callbacks.mobile
   * @param {function(string, boolean):void} callbacks.pinned
   * @param {function(string, string):void} callbacks.anchor
   * @param {function(string, string):void} callbacks.offsetXType
   * @param {function(string, string):void} callbacks.offsetYType
   * @param {function(string, string):void} callbacks.widthType
   * @param {function(string, string):void} callbacks.heightType
   * @param {function(string, string):void} callbacks.userContextId
   * @param {function(string, boolean):void} callbacks.temporary
   * @param {function(string, boolean):void} callbacks.loadOnStartup
   * @param {function(string, boolean):void} callbacks.unloadOnClose
   * @param {function(string, boolean):void} callbacks.shortcutEnabled
   * @param {function(string, string):void} callbacks.shortcut
   * @param {function(string, boolean):void} callbacks.hideToolbar
   * @param {function(string, boolean):void} callbacks.hideSoundIcon
   * @param {function(string, boolean):void} callbacks.hideNotificationBadge
   * @param {function(string, number):void} callbacks.periodicReload
   * @param {function(string):number} callbacks.zoomOut
   * @param {function(string):number} callbacks.zoomIn
   * @param {function(string, number):number} callbacks.zoom
   */
  listenChanges({
    url,
    selectorEnabled,
    selector,
    faviconURL,
    mobile,
    pinned,
    anchor,
    offsetXType,
    offsetYType,
    widthType,
    heightType,
    userContextId,
    temporary,
    loadOnStartup,
    unloadOnClose,
    shortcutEnabled,
    shortcut,
    hideToolbar,
    hideSoundIcon,
    hideNotificationBadge,
    periodicReload,
    zoomOut,
    zoomIn,
    zoom,
  }) {
    this.onUrlChange = url;
    this.onSelectorEnabledChange = selectorEnabled;
    this.onSelectorChange = selector;
    this.onFaviconUrlChange = faviconURL;
    this.onTemporaryChange = temporary;
    this.onMobileChange = mobile;
    this.onPinnedChange = pinned;
    this.onFloatingAnchorChange = anchor;
    this.onOffsetXTypeChange = offsetXType;
    this.onOffsetYTypeChange = offsetYType;
    this.onWidthTypeChange = widthType;
    this.onHeightTypeChange = heightType;
    this.onUserContextIdChange = userContextId;
    this.onLoadOnStartupChange = loadOnStartup;
    this.onUnloadOnCloseChange = unloadOnClose;
    this.onShortcutEnabledChange = shortcutEnabled;
    this.onShortcutChange = shortcut;
    this.onHideToolbar = hideToolbar;
    this.onHideSoundIcon = hideSoundIcon;
    this.onHideNotificationBadge = hideNotificationBadge;
    this.onPeriodicReload = periodicReload;
    this.onZoomOut = zoomOut;
    this.onZoomIn = zoomIn;
    this.onZoom = zoom;

    this.urlInput.addEventListener("input", () => {
      url(this.settings.uuid, this.urlInput.getValue(), 1000);
    });
    this.selectorToggle.addEventListener("toggle", () => {
      selectorEnabled(this.settings.uuid, this.selectorToggle.getPressed());
    });
    this.selectorInput.addEventListener("input", () => {
      selector(this.settings.uuid, this.selectorInput.getValue(), 1000);
    });
    this.faviconURLInput.addEventListener("input", () => {
      faviconURL(this.settings.uuid, this.faviconURLInput.getValue(), 1000);
    });
    this.pinnedMenuList.addEventListener("command", () => {
      pinned(this.settings.uuid, this.pinnedMenuList.getValue() === "true");
    });
    this.floatingAnchorMenuList.addEventListener("command", () => {
      anchor(this.settings.uuid, this.floatingAnchorMenuList.getValue());
    });
    this.offsetXTypeMenuList.addEventListener("command", () => {
      offsetXType(this.settings.uuid, this.offsetXTypeMenuList.getValue());
    });
    this.offsetYTypeMenuList.addEventListener("command", () => {
      offsetYType(this.settings.uuid, this.offsetYTypeMenuList.getValue());
    });
    this.widthTypeMenuList.addEventListener("command", () => {
      widthType(this.settings.uuid, this.widthTypeMenuList.getValue());
    });
    this.heightTypeMenuList.addEventListener("command", () => {
      heightType(this.settings.uuid, this.heightTypeMenuList.getValue());
    });
    this.containerMenuList.addEventListener("command", () => {
      userContextId(this.settings.uuid, this.containerMenuList.getValue());
    });
    this.temporaryToggle.addEventListener("toggle", () => {
      temporary(this.settings.uuid, this.temporaryToggle.getPressed());
    });
    this.mobileToggle.addEventListener("toggle", () => {
      mobile(this.settings.uuid, this.mobileToggle.getPressed());
    });
    this.loadOnStartupToggle.addEventListener("toggle", () => {
      loadOnStartup(this.settings.uuid, this.loadOnStartupToggle.getPressed());
    });
    this.unloadOnCloseToggle.addEventListener("toggle", () => {
      unloadOnClose(this.settings.uuid, this.unloadOnCloseToggle.getPressed());
    });
    this.shortcutToggle.addEventListener("toggle", () => {
      shortcutEnabled(this.settings.uuid, this.shortcutToggle.getPressed());
    });
    this.shortcutInput.addEventListener("input", () => {
      shortcut(this.settings.uuid, this.shortcutInput.getValue());
    });
    this.hideToolbarToggle.addEventListener("toggle", () => {
      hideToolbar(this.settings.uuid, this.hideToolbarToggle.getPressed());
    });
    this.hideSoundIconToggle.addEventListener("toggle", () => {
      hideSoundIcon(this.settings.uuid, this.hideSoundIconToggle.getPressed());
    });
    this.hideNotificationBadgeToggle.addEventListener("toggle", () => {
      hideNotificationBadge(
        this.settings.uuid,
        this.hideNotificationBadgeToggle.getPressed(),
      );
    });
    this.periodicReloadMenuList.addEventListener("command", () => {
      periodicReload(
        this.settings.uuid,
        this.periodicReloadMenuList.getValue(),
      );
    });
    this.zoomOutButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.zoom = zoomOut(this.settings.uuid);
        this.#updateZoomButtons(this.zoom);
      }
    });
    this.zoomInButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.zoom = zoomIn(this.settings.uuid);
        this.#updateZoomButtons(this.zoom);
      }
    });
    this.resetZoomButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.zoom = zoom(this.settings.uuid, 1);
        this.#updateZoomButtons(this.zoom);
      }
    });
  }

  /**
   *
   * @param {number} zoom
   */
  #updateZoomButtons(zoom) {
    updateZoomButtons(
      zoom,
      this.zoomOutButton,
      this.resetZoomButton,
      this.zoomInButton,
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
   * @param {function(string):void} callback
   */
  listenSaveButtonClick(callback) {
    this.saveButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.removeEventListener("popuphidden", this.cancelOnPopupHidden);
        callback(this.settings.uuid);
      }
    });
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   * @returns {WebPanelPopupEdit}
   */
  openPopup(webPanelController) {
    const settings = webPanelController.dumpSettings();
    this.uuid = settings.uuid;
    this.urlInput.setValue(settings.url);
    this.selectorToggle.setPressed(settings.selectorEnabled);
    this.selectorInput.setValue(settings.selector);
    this.faviconURLInput.setValue(settings.faviconURL);
    this.pinnedMenuList.setValue(settings.pinned);
    this.floatingAnchorMenuList.setValue(settings.floatingGeometry.anchor);
    this.offsetXTypeMenuList.setValue(settings.floatingGeometry.offsetXType);
    this.offsetYTypeMenuList.setValue(settings.floatingGeometry.offsetYType);
    this.widthTypeMenuList.setValue(settings.floatingGeometry.widthType);
    this.heightTypeMenuList.setValue(settings.floatingGeometry.heightType);

    fillContainerMenuList(this.containerMenuList);
    this.containerMenuList.setValue(settings.userContextId);
    applyContainerColor(
      settings.userContextId,
      this.containerMenuList.getXUL(),
    );

    this.temporaryToggle.setPressed(settings.temporary);
    this.mobileToggle.setPressed(settings.mobile);
    this.loadOnStartupToggle.setPressed(settings.loadOnStartup);
    this.unloadOnCloseToggle.setPressed(settings.unloadOnClose);
    this.shortcutToggle.setPressed(settings.shortcutEnabled);
    this.shortcutInput.setValue(settings.shortcut);
    this.hideToolbarToggle.setPressed(settings.hideToolbar);
    this.hideSoundIconToggle.setPressed(settings.hideSoundIcon);
    this.hideNotificationBadgeToggle.setPressed(settings.hideNotificationBadge);
    this.periodicReloadMenuList.setValue(settings.periodicReload);
    this.#updateZoomButtons(settings.zoom);
    this.zoom = settings.zoom;

    this.settings = settings;

    this.cancelOnPopupHidden = () => {
      if (this.getState() !== "closed") {
        return;
      }
      this.#cancelChanges();
      this.removeEventListener("popuphidden", this.cancelOnPopupHidden);
    };
    this.addEventListener("popuphidden", this.cancelOnPopupHidden);

    this.restoreWebPanelButtonState = (event) => {
      if (event.target.id !== this.id) {
        return;
      }
      webPanelController.button.setOpen(webPanelController.isActive());
      this.removeEventListener("popuphidden", this.restoreWebPanelButtonState);
    };
    this.addEventListener("popuphidden", this.restoreWebPanelButtonState);

    return Panel.prototype.openPopup.call(this, webPanelController.button);
  }

  #cancelChanges() {
    if (this.urlInput.getValue() !== this.settings.url) {
      this.onUrlChange(this.settings.uuid, this.settings.url);
    }
    if (this.selectorToggle.getPressed() !== this.settings.selectorEnabled) {
      this.onSelectorEnabledChange(
        this.settings.uuid,
        this.settings.selectorEnabled,
      );
    }
    if (this.selectorInput.getValue() !== this.settings.selector) {
      this.onSelectorChange(this.settings.uuid, this.settings.selector);
    }
    if (this.faviconURLInput.getValue() !== this.settings.faviconURL) {
      this.onFaviconUrlChange(this.settings.uuid, this.settings.faviconURL);
    }
    if ((this.pinnedMenuList.getValue() === "true") !== this.settings.pinned) {
      this.onPinnedChange(this.settings.uuid, this.settings.pinned);
    }
    if (
      this.floatingAnchorMenuList.getValue() !==
      this.settings.floatingGeometry.anchor
    ) {
      this.onFloatingAnchorChange(
        this.settings.uuid,
        this.settings.floatingGeometry.anchor,
      );
    }
    if (
      this.offsetXTypeMenuList.getValue() !==
      this.settings.floatingGeometry.offsetXType
    ) {
      this.onOffsetXTypeChange(
        this.settings.uuid,
        this.settings.floatingGeometry.offsetXType,
      );
    }
    if (
      this.offsetYTypeMenuList.getValue() !==
      this.settings.floatingGeometry.offsetYType
    ) {
      this.onOffsetYTypeChange(
        this.settings.uuid,
        this.settings.floatingGeometry.offsetYType,
      );
    }
    if (
      this.widthTypeMenuList.getValue() !==
      this.settings.floatingGeometry.widthType
    ) {
      this.onWidthTypeChange(
        this.settings.uuid,
        this.settings.floatingGeometry.widthType,
      );
    }
    if (
      this.heightTypeMenuList.getValue() !==
      this.settings.floatingGeometry.heightType
    ) {
      this.onHeightTypeChange(
        this.settings.uuid,
        this.settings.floatingGeometry.heightType,
      );
    }
    if (
      String(this.containerMenuList.getValue()) !==
      String(this.settings.userContextId)
    ) {
      this.onUserContextIdChange(
        this.settings.uuid,
        this.settings.userContextId,
      );
    }
    if (this.temporaryToggle.getPressed() !== this.settings.temporary) {
      this.onTemporaryChange(this.settings.uuid, this.settings.temporary);
    }
    if (this.mobileToggle.getPressed() !== this.settings.mobile) {
      this.onMobileChange(this.settings.uuid, this.settings.mobile);
    }
    if (this.loadOnStartupToggle.getPressed() !== this.settings.loadOnStartup) {
      this.onLoadOnStartupChange(
        this.settings.uuid,
        this.settings.loadOnStartup,
      );
    }
    if (this.unloadOnCloseToggle.getPressed() !== this.settings.unloadOnClose) {
      this.onUnloadOnCloseChange(
        this.settings.uuid,
        this.settings.unloadOnClose,
      );
    }
    if (this.shortcutToggle.getPressed() !== this.settings.shortcutEnabled) {
      this.onShortcutEnabledChange(
        this.settings.uuid,
        this.settings.shortcutEnabled,
      );
    }
    if (this.shortcutInput.getValue() !== this.settings.shortcut) {
      this.onShortcutChange(this.settings.uuid, this.settings.shortcut);
    }
    if (this.hideToolbarToggle.getPressed() !== this.settings.hideToolbar) {
      this.onHideToolbar(this.settings.uuid, this.settings.hideToolbar);
    }
    if (this.hideSoundIconToggle.getPressed() !== this.settings.hideSoundIcon) {
      this.onHideSoundIcon(this.settings.uuid, this.settings.hideSoundIcon);
    }
    if (
      this.hideNotificationBadgeToggle.getPressed() !==
      this.settings.hideNotificationBadge
    ) {
      this.onHideNotificationBadge(
        this.settings.uuid,
        this.settings.hideNotificationBadge,
      );
    }
    if (
      parseInt(this.periodicReloadMenuList.getValue()) !==
      this.settings.periodicReload
    ) {
      this.onPeriodicReload(this.settings.uuid, this.settings.periodicReload);
    }
    this.onZoom(this.settings.uuid, this.settings.zoom);
  }
}
