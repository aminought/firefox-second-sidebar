/* eslint-disable no-unused-vars */
import {
  applyContainerColor,
  fillContainerMenuList,
} from "../utils/containers.mjs";
import {
  createCancelButton,
  createInput,
  createPopupGroup,
  createPopupRow,
  createSaveButton,
  createSubviewButton,
  createSubviewIconicButton,
  createZoomButtons,
  updateZoomButtons,
} from "../utils/xul.mjs";

import { Header } from "./base/header.mjs";
import { MenuList } from "./base/menulist.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { PopupBody } from "./popup_body.mjs";
import { PopupFooter } from "./popup_footer.mjs";
import { PopupHeader } from "./popup_header.mjs";
import { Toggle } from "./base/toggle.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { WebPanelController } from "../controllers/web_panel.mjs";
import { fetchIconURL } from "../utils/icons.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

/* eslint-enable no-unused-vars */

const ICONS = {
  DOWN: "chrome://global/skin/icons/arrow-down.svg",
  UP: "chrome://global/skin/icons/arrow-up.svg",
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

    this.urlInput = createInput();
    this.faviconURLInput = createInput();
    this.faviconResetButton = createSubviewIconicButton(
      ICONS.UNDO,
      "Request Favicon",
    );
    this.pinnedToggle = new Toggle();
    this.typeMenuList = this.#createTypeMenuList();
    this.containerMenuList = new MenuList({ id: "sb2-container-menu-list" });
    this.mobileToggle = new Toggle();
    this.loadOnStartupToggle = new Toggle();
    this.unloadOnCloseToggle = new Toggle();
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
  }

  /**
   *
   * @returns {MenuList}
   */
  #createTypeMenuList() {
    const typeMenuList = new MenuList();
    typeMenuList.appendItem("Split", "split");
    typeMenuList.appendItem("Floating", "floating");
    return typeMenuList;
  }

  /**
   *
   * @returns {MenuList}
   */
  #createPeriodicReloadMenuList() {
    const menuList = new MenuList();
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
        new PopupBody()
          .setProperty("padding", "0 var(--space-medium)")
          .appendChildren(
            new Header(1).setText("Page web address"),
            this.urlInput,
            createPopupGroup("Multi-Account Container", this.containerMenuList),
            new Header(1).setText("Favicon web address"),
            createPopupRow(this.faviconURLInput, this.faviconResetButton),
            new ToolbarSeparator(),
            createPopupGroup("Pin", this.pinnedToggle),
            createPopupGroup("Web panel type", this.typeMenuList),
            createPopupGroup("Mobile View", this.mobileToggle),
            createPopupGroup(
              "Load into memory at startup",
              this.loadOnStartupToggle,
            ),
            createPopupGroup(
              "Unload from memory after closing",
              this.unloadOnCloseToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup("Hide toolbar", this.hideToolbarToggle),
            createPopupGroup("Hide sound icon", this.hideSoundIconToggle),
            createPopupGroup(
              "Hide notification badge",
              this.hideNotificationBadgeToggle,
            ),
            new ToolbarSeparator(),
            createPopupGroup("Periodic reload", this.periodicReloadMenuList),
            new ToolbarSeparator(),
            createPopupGroup(
              "Zoom",
              createZoomButtons(
                this.zoomOutButton,
                this.resetZoomButton,
                this.zoomInButton,
              ),
            ),
          )
          .setProperty("overflow-y", "scroll"),
        new PopupFooter().appendChildren(this.cancelButton, this.saveButton),
      ),
    );
  }

  /**
   *
   * @param {object} callbacks
   * @param {function(string, string, number):void} callbacks.url
   * @param {function(string, string, number):void} callbacks.faviconURL
   * @param {function(string, boolean):void} callbacks.mobile
   * @param {function(string, boolean):void} callbacks.pinned
   * @param {function(string, string):void} callbacks.type
   * @param {function(string, string):void} callbacks.userContextId
   * @param {function(string, boolean):void} callbacks.loadOnStartup
   * @param {function(string, boolean):void} callbacks.unloadOnClose
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
    faviconURL,
    pinned,
    type,
    userContextId,
    mobile,
    loadOnStartup,
    unloadOnClose,
    hideToolbar,
    hideSoundIcon,
    hideNotificationBadge,
    periodicReload,
    zoomOut,
    zoomIn,
    zoom,
  }) {
    this.onUrlChange = url;
    this.onFaviconUrlChange = faviconURL;
    this.onMobileChange = mobile;
    this.onPinnedChange = pinned;
    this.onTypeChange = type;
    this.onUserContextIdChange = userContextId;
    this.onLoadOnStartupChange = loadOnStartup;
    this.onUnloadOnCloseChange = unloadOnClose;
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
    this.faviconURLInput.addEventListener("input", () => {
      faviconURL(this.settings.uuid, this.faviconURLInput.getValue(), 1000);
    });
    this.pinnedToggle.addEventListener("toggle", () => {
      pinned(this.settings.uuid, this.pinnedToggle.getPressed());
    });
    this.typeMenuList.addEventListener("command", () => {
      type(this.settings.uuid, this.typeMenuList.getValue());
    });
    this.containerMenuList.addEventListener("command", () => {
      userContextId(this.settings.uuid, this.containerMenuList.getValue());
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
    this.faviconURLInput.setValue(settings.faviconURL);
    this.pinnedToggle.setPressed(settings.pinned);
    this.typeMenuList.setValue(settings.type);

    fillContainerMenuList(this.containerMenuList);
    this.containerMenuList.setValue(settings.userContextId);
    applyContainerColor(
      settings.userContextId,
      this.containerMenuList.getXUL(),
    );

    this.mobileToggle.setPressed(settings.mobile);
    this.loadOnStartupToggle.setPressed(settings.loadOnStartup);
    this.unloadOnCloseToggle.setPressed(settings.unloadOnClose);
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
    if (this.faviconURLInput.getValue() !== this.settings.faviconURL) {
      this.onFaviconUrlChange(this.settings.uuid, this.settings.faviconURL);
    }
    if (this.pinnedToggle.getPressed() !== this.settings.pinned) {
      this.onPinnedChange(this.settings.uuid, this.settings.pinned);
    }
    if (this.typeMenuList.getValue() !== this.settings.type) {
      this.onTypeChange(this.settings.uuid, this.settings.type);
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
      this.periodicReloadMenuList.getValue() !== this.settings.periodicReload
    ) {
      this.onPeriodicReload(this.settings.uuid, this.settings.periodicReload);
    }
    this.onZoom(this.settings.uuid, this.settings.zoom);
  }
}
