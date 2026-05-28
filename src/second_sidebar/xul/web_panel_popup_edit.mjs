import { L } from "../i18n/index.mjs";
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
import { SidebarControllers } from "../sidebar_controllers.mjs";
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
    this.setType("arrow")
      .setRole("group")
      .setAttribute("no-open-on-anchor", "true");

    this.urlInput = createInput({ placeholder: L.popupEdit.urlPlaceholder });
    this.dynamicTitleToggle = new Toggle({
      id: "sb2-popup-dynamic-title-toggle",
    });
    this.titleInput = createInput({ placeholder: L.popupEdit.title });
    this.titleResetButton = createSubviewIconicButton(ICONS.UNDO, {
      tooltipText: L.popupEdit.titleReset,
    });
    this.dynamicFaviconToggle = new Toggle({
      id: "sb2-popup-dynamic-favicon-toggle",
    });
    this.faviconURLInput = createInput({
      placeholder: L.popupEdit.faviconUrlPlaceholder,
    });
    this.faviconResetButton = createSubviewIconicButton(ICONS.UNDO, {
      tooltipText: L.popupEdit.faviconReset,
    });
    this.alwaysOnTopToggle = new Toggle({
      id: "sb2-popup-always-on-top-toggle",
    });
    this.selectorToggle = new Toggle({ id: "sb2-popup-css-selector-toggle" });
    this.selectorInput = createInput({
      id: "sb2-popup-css-selector-input",
      placeholder: L.popupEdit.selectorPlaceholder,
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
    this.loadLastUrlToggle = new Toggle();
    this.unloadOnCloseToggle = new Toggle();
    this.shortcutInput = createInput({
      placeholder: L.popupEdit.shortcutPlaceholder,
    });
    this.shortcutResetButton = createSubviewIconicButton(ICONS.UNDO, {
      tooltipText: L.popupEdit.shortcutReset,
    });
    this.hideToolbarToggle = new Toggle();
    this.hideSoundIconToggle = new Toggle();
    this.hideNotificationBadgeToggle = new Toggle();
    this.periodicReloadMenuList = this.#createPeriodicReloadMenuList();
    this.zoomOutButton = createSubviewIconicButton(ICONS.MINUS, {
      tooltipText: L.popupEdit.zoomOut,
    });
    this.resetZoomButton = createSubviewButton("100%", {
      id: "sb2-zoom-button",
      tooltipText: L.popupEdit.resetZoom,
    });
    this.zoomInButton = createSubviewIconicButton(ICONS.PLUS, {
      tooltipText: L.popupEdit.zoomIn,
    });
    this.cancelButton = createCancelButton();
    this.saveButton = createSaveButton();
    this.#setupListeners();
    this.#compose();

    this.zoom = 1;
  }

  #setupListeners() {
    this.titleResetButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.titleInput
          .setValue(this.webPanelController.getTabTitle())
          .dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

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
          .removeAttribute("error")
          .dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    this.shortcutInput.addEventListener("keypress", (event) => {
      event.preventDefault();

      const parts =
        SidebarControllers.webPanelsShortcuts.getShortcutPartsFromEvent(event);
      const shortcut = parts.join("+");
      const isBisy =
        SidebarControllers.webPanelsShortcuts.isWebPanelShortcutBusy(
          this.uuid,
          shortcut,
        );

      if (isBisy) {
        this.shortcutInput
          .setValue(L.popupEdit.shortcutBusy(shortcut))
          .setAttribute("error", true)
          .dispatchEvent(new Event("error", { bubbles: true }));
        return;
      }

      this.shortcutInput.removeAttribute("error");
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
    pinTypeMenuList.appendItem(L.popupEdit.pinned, true);
    pinTypeMenuList.appendItem(L.popupEdit.floating, false);
    return pinTypeMenuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createFloatingAnchorMenuList() {
    const menuList = createMenuList();
    menuList.appendItem(L.popupEdit.anchorDefault, "default");
    menuList.appendItem(L.popupEdit.anchorTopLeft, "topleft");
    menuList.appendItem(L.popupEdit.anchorTopRight, "topright");
    menuList.appendItem(L.popupEdit.anchorBottomLeft, "bottomleft");
    menuList.appendItem(L.popupEdit.anchorBottomRight, "bottomright");
    menuList.appendItem(L.popupEdit.anchorCenter, "center");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createDimensionTypeMenuList() {
    const menuList = createMenuList();
    menuList.appendItem(L.popupEdit.absolute, "absolute");
    menuList.appendItem(L.popupEdit.relative, "relative");
    return menuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPeriodicReloadMenuList() {
    const menuList = createMenuList();
    menuList.appendItem(L.periodicReload.never, 0);
    menuList.appendItem(L.periodicReload.sec5, 5 * SECOND);
    menuList.appendItem(L.periodicReload.sec10, 10 * SECOND);
    menuList.appendItem(L.periodicReload.sec30, 30 * SECOND);
    menuList.appendItem(L.periodicReload.min1, MINUTE);
    menuList.appendItem(L.periodicReload.min2, 2 * MINUTE);
    menuList.appendItem(L.periodicReload.min5, 5 * MINUTE);
    menuList.appendItem(L.periodicReload.min10, 10 * MINUTE);
    menuList.appendItem(L.periodicReload.min30, 30 * MINUTE);
    menuList.appendItem(L.periodicReload.min60, 60 * MINUTE);
    menuList.appendItem(L.periodicReload.min90, 90 * MINUTE);
    return menuList;
  }

  #compose() {
    this.appendChildren(
      new PanelMultiView().appendChildren(
        new PopupHeader(L.popupEdit.header),
        new PopupBody().appendChildren(
          createPopupSet("", [
            createPopupRow(this.urlInput),
            new ToolbarSeparator(),
            createPopupGroup(L.popupNew.container, this.containerMenuList),
            new ToolbarSeparator(),
            createPopupGroup(L.popupNew.temporary, this.temporaryToggle),
            new ToolbarSeparator(),
            createPopupGroup(L.popupMore.mobileView, this.mobileToggle),
            new ToolbarSeparator(),
            createPopupGroup(
              L.popupEdit.zoom,
              createZoomButtons(
                this.zoomOutButton,
                this.resetZoomButton,
                this.zoomInButton,
              ),
            ),
          ]),
          createPopupSet(L.popupEdit.title, [
            createPopupGroup(L.popupEdit.dynamic, this.dynamicTitleToggle),
            new Div({ id: "sb2-popup-title-items" }).appendChildren(
              new ToolbarSeparator(),
              createPopupRow(this.titleInput, this.titleResetButton),
            ),
          ]),
          createPopupSet(L.popupEdit.icon, [
            createPopupGroup(L.popupEdit.dynamic, this.dynamicFaviconToggle),
            new Div({ id: "sb2-popup-favicon-items" }).appendChildren(
              new ToolbarSeparator(),
              createPopupRow(this.faviconURLInput, this.faviconResetButton),
            ),
          ]),
          createPopupSet(L.popupEdit.positionAndSize, [
            createPopupGroup(L.popupEdit.mode, this.pinnedMenuList),
            new Div({
              id: "sb2-popup-floating-items",
            }).appendChildren(
              new ToolbarSeparator(),
              createPopupGroup(L.popupEdit.alwaysOnTop, this.alwaysOnTopToggle),
              new ToolbarSeparator(),
              createPopupGroup(L.popupEdit.anchor, this.floatingAnchorMenuList),
              new ToolbarSeparator(),
              createPopupGroup(L.popupEdit.offsetX, this.offsetXTypeMenuList),
              new ToolbarSeparator(),
              createPopupGroup(L.popupEdit.offsetY, this.offsetYTypeMenuList),
              new ToolbarSeparator(),
              createPopupGroup(L.popupEdit.width, this.widthTypeMenuList),
              new ToolbarSeparator(),
              createPopupGroup(L.popupEdit.height, this.heightTypeMenuList),
            ),
          ]),
          createPopupSet(L.popupEdit.loading, [
            createPopupGroup(
              L.popupEdit.loadOnStartup,
              this.loadOnStartupToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup(L.popupEdit.loadLastUrl, this.loadLastUrlToggle),
            new ToolbarSeparator(),
            createPopupGroup(
              L.popupEdit.unloadOnClose,
              this.unloadOnCloseToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup(
              L.popupEdit.periodicReload,
              this.periodicReloadMenuList,
            ),
          ]),
          createPopupSet(L.popupEdit.shortcut, [
            createPopupRow(this.shortcutInput, this.shortcutResetButton),
          ]),
          createPopupSet(L.popupEdit.cssSelector, [
            createPopupGroup(L.popupEdit.enable, this.selectorToggle),
            new Div({ id: "sb2-popup-css-selector-items" }).appendChildren(
              new ToolbarSeparator(),
              createPopupRow(this.selectorInput),
            ),
          ]),
          createPopupSet(L.popupEdit.hideElements, [
            createPopupGroup(L.popupEdit.hideToolbar, this.hideToolbarToggle),
            new ToolbarSeparator(),
            createPopupGroup(
              L.popupEdit.hideSoundIcon,
              this.hideSoundIconToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup(
              L.popupEdit.hideNotificationBadge,
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
   * @param {function(string, boolean string):void} callbacks.title
   * @param {function(string, boolean, string, number):void} callbacks.faviconURL
   * @param {function(string, boolean):void} callbacks.selectorEnabled
   * @param {function(string, string, number):void} callbacks.selector
   * @param {function(string, boolean):void} callbacks.mobile
   * @param {function(string, boolean):void} callbacks.pinned
   * @param {function(string, boolean):void} callbacks.alwaysOnTop
   * @param {function(string, string):void} callbacks.anchor
   * @param {function(string, string):void} callbacks.offsetXType
   * @param {function(string, string):void} callbacks.offsetYType
   * @param {function(string, string):void} callbacks.widthType
   * @param {function(string, string):void} callbacks.heightType
   * @param {function(string, string):void} callbacks.userContextId
   * @param {function(string, boolean):void} callbacks.temporary
   * @param {function(string, boolean):void} callbacks.loadOnStartup
   * @param {function(string, boolean):void} callbacks.loadLastUrl
   * @param {function(string, boolean):void} callbacks.unloadOnClose
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
    title,
    faviconURL,
    selectorEnabled,
    selector,
    mobile,
    alwaysOnTop,
    pinned,
    anchor,
    offsetXType,
    offsetYType,
    widthType,
    heightType,
    userContextId,
    temporary,
    loadOnStartup,
    loadLastUrl,
    unloadOnClose,
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
    this.onTitleChange = title;
    this.onFaviconURLChange = faviconURL;
    this.onSelectorEnabledChange = selectorEnabled;
    this.onSelectorChange = selector;
    this.onTemporaryChange = temporary;
    this.onMobileChange = mobile;
    this.onPinnedChange = pinned;
    this.onAlwaysOnTopChange = alwaysOnTop;
    this.onFloatingAnchorChange = anchor;
    this.onOffsetXTypeChange = offsetXType;
    this.onOffsetYTypeChange = offsetYType;
    this.onWidthTypeChange = widthType;
    this.onHeightTypeChange = heightType;
    this.onUserContextIdChange = userContextId;
    this.onLoadOnStartupChange = loadOnStartup;
    this.onLoadLastUrlChange = loadLastUrl;
    this.onUnloadOnCloseChange = unloadOnClose;
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
    this.dynamicTitleToggle.addEventListener("toggle", () => {
      title(
        this.settings.uuid,
        this.dynamicTitleToggle.getPressed(),
        this.titleInput.getValue(),
      );
    });
    this.titleInput.addEventListener("input", () => {
      title(
        this.settings.uuid,
        this.dynamicTitleToggle.getPressed(),
        this.titleInput.getValue(),
      );
    });
    this.dynamicFaviconToggle.addEventListener("toggle", () => {
      faviconURL(
        this.settings.uuid,
        this.dynamicFaviconToggle.getPressed(),
        this.faviconURLInput.getValue(),
        1000,
      );
    });
    this.faviconURLInput.addEventListener("input", () => {
      faviconURL(
        this.settings.uuid,
        this.dynamicFaviconToggle.getPressed(),
        this.faviconURLInput.getValue(),
        1000,
      );
    });
    this.selectorToggle.addEventListener("toggle", () => {
      selectorEnabled(this.settings.uuid, this.selectorToggle.getPressed());
    });
    this.selectorInput.addEventListener("input", () => {
      selector(this.settings.uuid, this.selectorInput.getValue(), 1000);
    });
    this.alwaysOnTopToggle.addEventListener("toggle", () => {
      alwaysOnTop(this.settings.uuid, this.alwaysOnTopToggle.getPressed());
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
    this.loadLastUrlToggle.addEventListener("toggle", () => {
      loadLastUrl(this.settings.uuid, this.loadLastUrlToggle.getPressed());
    });
    this.unloadOnCloseToggle.addEventListener("toggle", () => {
      unloadOnClose(this.settings.uuid, this.unloadOnCloseToggle.getPressed());
    });
    this.shortcutInput.addEventListener("input", () => {
      shortcut(this.settings.uuid, this.shortcutInput.getValue());
    });
    this.shortcutInput.addEventListener("error", () => {
      shortcut(this.settings.uuid, this.settings.shortcut);
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
    this.dynamicTitleToggle.setPressed(settings.dynamicTitle);
    this.titleInput.setValue(settings.title);
    this.dynamicFaviconToggle.setPressed(settings.dynamicFavicon);
    this.faviconURLInput.setValue(settings.faviconURL);
    this.selectorToggle.setPressed(settings.selectorEnabled);
    this.selectorInput.setValue(settings.selector);
    this.alwaysOnTopToggle.setPressed(settings.alwaysOnTop);
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
    this.loadLastUrlToggle.setPressed(settings.loadLastUrl);
    this.unloadOnCloseToggle.setPressed(settings.unloadOnClose);
    this.shortcutInput.setValue(settings.shortcut).removeAttribute("error");
    this.hideToolbarToggle.setPressed(settings.hideToolbar);
    this.hideSoundIconToggle.setPressed(settings.hideSoundIcon);
    this.hideNotificationBadgeToggle.setPressed(settings.hideNotificationBadge);
    this.periodicReloadMenuList.setValue(settings.periodicReload);
    this.#updateZoomButtons(settings.zoom);
    this.zoom = settings.zoom;

    this.webPanelController = webPanelController;
    this.settings = settings;

    this.cancelOnPopupHidden = () => {
      if (this.getState() !== "closed") {
        return;
      }
      this.#cancelChanges();
      this.removeEventListener("popuphidden", this.cancelOnPopupHidden);
    };
    this.addEventListener("popuphidden", this.cancelOnPopupHidden);

    this.addEventListener("popupshown", () =>
      SidebarControllers.webPanelsShortcuts.disable(),
    );
    this.addEventListener("popuphidden", () =>
      SidebarControllers.webPanelsShortcuts.enable(),
    );

    return Panel.prototype.openPopup.call(this, webPanelController.button);
  }

  #cancelChanges() {
    if (this.urlInput.getValue() !== this.settings.url) {
      this.onUrlChange(this.settings.uuid, this.settings.url);
    }
    if (
      this.dynamicTitleToggle.getPressed() !== this.settings.dynamicTitle ||
      this.titleInput.getValue() !== this.settings.title
    ) {
      this.onTitleChange(
        this.settings.uuid,
        this.settings.dynamicTitle,
        this.settings.title,
      );
    }
    if (
      this.dynamicFaviconToggle.getPressed() !== this.settings.dynamicFavicon ||
      this.faviconURLInput.getValue() !== this.settings.faviconURL
    ) {
      this.onFaviconURLChange(
        this.settings.uuid,
        this.settings.dynamicFavicon,
        this.settings.faviconURL,
      );
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
    if ((this.pinnedMenuList.getValue() === "true") !== this.settings.pinned) {
      this.onPinnedChange(this.settings.uuid, this.settings.pinned);
    }
    if (this.alwaysOnTopToggle.getPressed() !== this.settings.alwaysOnTop) {
      this.onAlwaysOnTopChange(this.settings.uuid, this.settings.alwaysOnTop);
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
    if (this.loadLastUrlToggle.getPressed() !== this.settings.loadLastUrl) {
      this.onLoadLastUrlChange(this.settings.uuid, this.settings.loadLastUrl);
    }
    if (this.unloadOnCloseToggle.getPressed() !== this.settings.unloadOnClose) {
      this.onUnloadOnCloseChange(
        this.settings.uuid,
        this.settings.unloadOnClose,
      );
    }

    const shortcutValue = this.shortcutInput.hasAttribute("error")
      ? this.settings.shortcut
      : this.shortcutInput.getValue();
    if (shortcutValue !== this.settings.shortcut) {
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
