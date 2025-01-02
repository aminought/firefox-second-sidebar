import {
  createCancelButton,
  createCreateButton,
  createInput,
  createPopupHeader,
} from "../utils/xul.mjs";

import { HBox } from "./base/hbox.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

export class WebPanelPopupNew extends Panel {
  constructor() {
    super({
      id: "sb2-web-panel-new",
      classList: ["sb2-popup", "sb2-popup-with-header"],
    });
    this.setType("arrow").setRole("group");

    this.input = createInput();
    this.saveButton = createCreateButton();
    this.cancelButton = createCancelButton();
    this.#compose();

    this.addEventListener("popupshown", () => {
      this.input.focus();
    });
  }

  #compose() {
    this.appendChild(
      new PanelMultiView().appendChildren(
        createPopupHeader("New Web Panel"),
        new ToolbarSeparator(),
        this.input,
        new HBox({
          id: "sb2-web-panel-new-buttons",
        }).appendChildren(this.cancelButton, this.saveButton),
      ),
    );
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenInputChange(callback) {
    this.input.addEventListener("keyup", (event) => {
      if (event.key === "Enter" || event.keyCode === 13) {
        callback(this.input.getValue());
      }
    });
    return this;
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenSaveButtonClick(callback) {
    this.saveButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        callback(this.input.getValue());
      }
    });
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenCancelButtonClick(callback) {
    this.cancelButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        callback(this.input.getValue());
      }
    });
  }

  /**
   *
   * @param {string} value
   * @returns {WebPanelPopupNew}
   */
  setInputValue(value) {
    this.input.setValue(value);
    return this;
  }
}
