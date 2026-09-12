import {
  createPopupSet,
  createSubviewButton,
  createSubviewIconicButton,
  createZoomButtons,
  updateZoomButtons,
} from "../utils/xul.mjs";

import { MenuSeparator } from "./base/menuseparator.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { ToolbarButton } from "./base/toolbar_button.mjs"; // eslint-disable-line no-unused-vars
import { PopupBody } from "./popup_body.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs"; // eslint-disable-line no-unused-vars
import { isLeftMouseButton } from "../utils/buttons.mjs";

const ICONS = {
  MINUS: "chrome://global/skin/icons/minus.svg",
  PLUS: "chrome://global/skin/icons/plus.svg",
};

export class WebPanelPopupMore extends Panel {
  constructor() {
    super({
      id: "sb2-web-panel-more",
      classList: ["sb2-popup"],
    });
    this.setType("arrow");

    this.openInNewTabButton = createSubviewButton("Open in New Tab");
    this.copyPageUrlButton = createSubviewButton("Copy Page URL");
    this.temporaryButton = createSubviewButton("Temporary", {
      type: "checkbox",
    });
    this.mobileButton = createSubviewButton("Mobile View", {
      type: "checkbox",
    });
    this.alwaysOnTopButton = createSubviewButton("Always On Top", {
      type: "checkbox",
    });
    this.zoomOutButton = createSubviewIconicButton(ICONS.MINUS, "Zoom Out");
    this.zoomInButton = createSubviewIconicButton(ICONS.PLUS, "Zoom In");
    this.resetZoomButton = createSubviewButton("100%", {
      id: "sb2-zoom-button",
      tooltipText: "Reset Zoom",
    });
    this.#compose();
  }

  #compose() {
    this.appendChild(
      new PanelMultiView().appendChildren(
        new PopupBody({ compact: true }).appendChildren(
          createPopupSet("", [
            this.openInNewTabButton,
            this.copyPageUrlButton,
            this.mobileButton,
            new MenuSeparator(),
            this.alwaysOnTopButton,
            new MenuSeparator(),
            this.temporaryButton,
            new MenuSeparator(),
            createZoomButtons(
              this.zoomOutButton,
              this.resetZoomButton,
              this.zoomInButton,
            ),
          ]),
        ),
      ),
    );
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  listenPopupShowing(callback) {
    this.addEventListener("popupshowing", (event) => {
      callback(event);
    });
  }

  /**
   *
   * @param {function(string):void} callback
   */
  listenOpenInNewTabButtonClick(callback) {
    this.openInNewTabButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        callback(event, this.settings.uuid);
      }
    });
  }

  /**
   *
   * @param {function(string):void} callback
   */
  listenCopyPageUrlButtonClick(callback) {
    this.copyPageUrlButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        callback(this.settings.uuid);
      }
    });
  }

  /**
   *
   * @param {function(string, boolean):void} callback
   */
  listenMobileButtonCommand(callback) {
    this.#listenCheckboxButtonCommand(this.mobileButton, callback);
  }

  /**
   *
   * @param {function(string, boolean):void} callback
   */
  listenTemporaryButtonCommand(callback) {
    this.#listenCheckboxButtonCommand(this.temporaryButton, callback);
  }

  /**
   *
   * @param {function(string, boolean):void} callback
   */
  listenAlwaysOnTopButtonCommand(callback) {
    this.#listenCheckboxButtonCommand(this.alwaysOnTopButton, callback);
  }

  /**
   *
   * @param {ToolbarButton} button
   * @param {function(string, boolean):void} callback
   */
  #listenCheckboxButtonCommand(button, callback) {
    button.setAttribute("autocheck", false);
    button.addEventListener("command", () => {
      const checked = !button.isChecked();
      button.setChecked(checked);
      callback(this.settings.uuid, checked);
    });
  }

  /**
   *
   * @param {function(string):number} callback
   */
  listenZoomInButtonClick(callback) {
    this.zoomInButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        const zoom = callback(this.settings.uuid);
        this.#updateZoomButtons(zoom);
      }
    });
  }

  /**
   *
   * @param {function(string):number} callback
   */
  listenZoomOutButtonClick(callback) {
    this.zoomOutButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        const zoom = callback(this.settings.uuid);
        this.#updateZoomButtons(zoom);
      }
    });
  }

  /**
   *
   * @param {function(string):number} callback
   */
  listenResetZoomButtonClick(callback) {
    this.resetZoomButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        const zoom = callback(this.settings.uuid);
        this.#updateZoomButtons(zoom);
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
   * @param {WebPanelSettings} settings
   */
  setDefaults(settings) {
    this.mobileButton.setChecked(settings.mobile);
    this.temporaryButton.setChecked(settings.temporary);
    this.alwaysOnTopButton.setChecked(settings.alwaysOnTop);
    this.#updateZoomButtons(settings.zoom);

    this.settings = settings;
  }
}
