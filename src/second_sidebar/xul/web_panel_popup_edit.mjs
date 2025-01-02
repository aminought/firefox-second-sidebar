import {
  createCancelButton,
  createInput,
  createPopupGroup,
  createPopupHeader,
  createSaveButton,
  createSubviewButton,
  createSubviewIconicButton,
  createZoomButtons,
  updateZoomButtons,
} from "../utils/xul.mjs";

/* eslint-disable no-unused-vars */
import { HBox } from "./base/hbox.mjs";
import { Header } from "./base/header.mjs";
import { MenuList } from "./base/menulist.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
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
    this.pinnedMenuList = this.#createPinTypeMenuList();
    this.mobileToggle = new Toggle();
    this.loadOnStartupToggle = new Toggle();
    this.unloadOnCloseToggle = new Toggle();
    this.hideToolbarToggle = new Toggle();
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
  #createPinTypeMenuList() {
    const pinTypeMenuList = new MenuList();
    pinTypeMenuList.appendItem("Pinned", true);
    pinTypeMenuList.appendItem("Floating", false);
    return pinTypeMenuList;
  }

  #compose() {
    this.appendChild(
      new PanelMultiView().appendChildren(
        createPopupHeader("Edit Web Panel"),
        new ToolbarSeparator(),
        new Header(1).setText("Page web address"),
        this.urlInput,
        new Header(1).setText("Favicon web address"),
        new HBox({
          id: "sb2-web-panel-edit-favicon-row",
        }).appendChildren(this.faviconURLInput, this.faviconResetButton),
        new ToolbarSeparator(),
        createPopupGroup("Web panel type", this.pinnedMenuList),
        createPopupGroup("Use mobile User Agent", this.mobileToggle),
        createPopupGroup(
          "Load into memory at startup",
          this.loadOnStartupToggle,
        ),
        createPopupGroup(
          "Unload from memory after closing",
          this.unloadOnCloseToggle,
        ),
        createPopupGroup("Hide toolbar", this.hideToolbarToggle),
        new ToolbarSeparator(),
        createPopupGroup(
          "Zoom",
          createZoomButtons(
            this.zoomOutButton,
            this.resetZoomButton,
            this.zoomInButton,
          ),
        ),
        new HBox({
          id: "sb2-web-panel-edit-buttons",
        }).appendChildren(this.cancelButton, this.saveButton),
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
   * @param {function(string, boolean):void} callbacks.loadOnStartup
   * @param {function(string, boolean):void} callbacks.unloadOnClose
   * @param {function(string, boolean):void} callbacks.hideToolbar
   * @param {function(string, boolean?, boolean?, number?):number} callbacks.zoom
   */
  listenChanges({
    url,
    faviconURL,
    pinned,
    mobile,
    loadOnStartup,
    unloadOnClose,
    hideToolbar,
    zoom,
  }) {
    this.onUrlChange = url;
    this.onFaviconUrlChange = faviconURL;
    this.onMobileChange = mobile;
    this.onPinnedChange = pinned;
    this.onLoadOnStartupChange = loadOnStartup;
    this.onUnloadOnCloseChange = unloadOnClose;
    this.onHideToolbar = hideToolbar;
    this.onZoom = zoom;

    this.urlInput.addEventListener("input", () => {
      url(this.settings.uuid, this.urlInput.getValue(), 1000);
    });
    this.faviconURLInput.addEventListener("input", () => {
      faviconURL(this.settings.uuid, this.faviconURLInput.getValue(), 1000);
    });
    this.pinnedMenuList.addEventListener("command", () => {
      pinned(this.settings.uuid, this.pinnedMenuList.getValue() === "true");
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
    this.zoomInButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.#updateZoomButtons(zoom(this.settings.uuid, true, false));
      }
    });
    this.zoomOutButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.#updateZoomButtons(zoom(this.settings.uuid, false, true));
      }
    });
    this.resetZoomButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.#updateZoomButtons(zoom(this.settings.uuid, false, false, 1));
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
   * @param {function():void} callback
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
   */
  openPopup(webPanelController) {
    const settings = webPanelController.dumpSettings();
    this.uuid = settings.uuid;
    this.urlInput.setValue(settings.url);
    this.faviconURLInput.setValue(settings.faviconURL);
    this.pinnedMenuList.setValue(settings.pinned);
    this.mobileToggle.setPressed(settings.mobile);
    this.loadOnStartupToggle.setPressed(settings.loadOnStartup);
    this.unloadOnCloseToggle.setPressed(settings.unloadOnClose);
    this.hideToolbarToggle.setPressed(settings.hideToolbar);
    this.#updateZoomButtons(settings.zoom);

    this.settings = settings;
    this.insertedBeforeXUL = webPanelController.getInsertedBeforeXUL();
    this.currentInsertedBeforeXUL = this.insertedBeforeXUL;

    this.cancelOnPopupHidden = () => {
      if (this.getState() !== "closed") {
        return;
      }
      this.#cancelChanges();
      this.removeEventListener("popuphidden", this.cancelOnPopupHidden);
    };
    this.addEventListener("popuphidden", this.cancelOnPopupHidden);

    this.restoreWebPanelButtonState = () => {
      webPanelController.webPanelButton.setOpen(webPanelController.isActive());
      this.removeEventListener("popuphidden", this.restoreWebPanelButtonState);
    };
    this.addEventListener("popuphidden", this.restoreWebPanelButtonState);

    Panel.prototype.openPopup.call(this, webPanelController.webPanelButton);
  }

  #cancelChanges() {
    if (this.urlInput.getValue() !== this.settings.url) {
      this.onUrlChange(this.settings.uuid, this.settings.url);
    }
    if (this.faviconURLInput.getValue() !== this.settings.faviconURL) {
      this.onFaviconUrlChange(this.settings.uuid, this.settings.faviconURL);
    }
    if ((this.pinnedMenuList.getValue() === "true") !== this.settings.pinned) {
      this.onPinnedChange(this.settings.uuid, this.settings.pinned);
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
    this.onZoom(this.settings.uuid, false, false, this.settings.zoom);
  }
}
