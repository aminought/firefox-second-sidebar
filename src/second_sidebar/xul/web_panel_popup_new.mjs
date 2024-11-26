import { Button } from "./base/button.mjs";
import { HBox } from "./base/hbox.mjs";
import { Header } from "./base/header.mjs";
import { Input } from "./base/input.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";

export class WebPanelPopupNew extends Panel {
  constructor() {
    super({
      id: "sidebar-2-web-panel-popup-new",
      classList: ["sidebar-2-popup"],
    });
    this.setType("arrow").setRole("group");

    this.panelHeader = new HBox({ classList: ["panel-header"] });
    this.header = new Header(1).setText("New Web Panel");
    this.separator = new ToolbarSeparator();

    this.input = this.#createInput();

    this.saveButton = this.#createSaveButton();
    this.cancelButton = this.#createCancelButton();
    this.buttons = new HBox({
      id: "sidebar-2-web-panel-popup-new-buttons",
    });

    this.multiView = this.#createMultiView();

    this.addEventListener("popupshown", () => {
      this.input.focus();
    });
  }

  /**
   *
   * @returns {PanelMultiView}
   */
  #createMultiView() {
    this.panelHeader.appendChild(this.header);
    this.buttons.appendChild(this.cancelButton).appendChild(this.saveButton);
    const multiView = new PanelMultiView()
      .appendChild(this.panelHeader)
      .appendChild(this.separator)
      .appendChild(this.input)
      .appendChild(this.buttons);

    this.appendChild(multiView);
    return multiView;
  }

  /**
   *
   * @returns {Input}
   */
  #createInput() {
    return new Input().setType("text");
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
   * @returns {Button}
   */
  #createSaveButton() {
    return new Button({
      classList: ["footer-button", "primary"],
    }).setText("Save");
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenSaveButtonClick(callback) {
    this.saveButton.addEventListener("mousedown", async (event) => {
      if (event.button === 0) {
        callback(this.input.getValue());
      }
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
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenCancelButtonClick(callback) {
    this.cancelButton.addEventListener("mousedown", async (event) => {
      if (event.button === 0) {
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
