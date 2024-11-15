import { Button } from "./base/button.mjs";
import { HBox } from "./base/hbox.mjs";
import { Header } from "./base/header.mjs";
import { Input } from "./base/input.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { ToolbarButton } from "./base/toolbar_button.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { fetchIconURL } from "../utils/icons.mjs";

export class WebPanelPopupEdit extends Panel {
  constructor() {
    super({
      id: "sidebar-2-web-panel-popup-edit",
      classList: ["sidebar-2-popup"],
    });
    this.setType("arrow").setRole("group");

    this.panelHeader = new HBox({ classList: ["panel-header"] });
    this.header = new Header(1).setText("Edit Web Panel");

    this.urlInputHeader = new Header(1).setText("Page web address");
    this.urlInput = this.#createURLInput();

    this.faviconURLInputHeader = new Header(1).setText("Favicon web address");
    this.faviconURLInput = this.#createFaviconURLInput();
    this.faviconResetButton = this.#createFaviconResetButton();
    this.faviconRow = this.#createFaviconRow();

    this.moveDownButton = this.#createMoveDownButton();
    this.moveUpButton = this.#createMoveUpButton();
    this.moveButtons = new HBox({
      id: "sidebar-2-web-panel-popup-edit-move-buttons",
    });

    this.saveButton = this.#createSaveButton();
    this.deleteButton = this.#createDeleteButton();
    this.storageButtons = new HBox({
      id: "sidebar-2-web-panel-popup-edit-storage-buttons",
    });

    this.mobileToggle = this.#createToggle();
    this.mobileGroup = this.#createToggleGroup(
      this.mobileToggle,
      "Use mobile User Agent"
    );

    this.loadOnStartupToggle = this.#createToggle();
    this.loadOnStartupGroup = this.#createToggleGroup(
      this.loadOnStartupToggle,
      "Load into memory at startup"
    );

    this.unloadOnCloseToggle = this.#createToggle();
    this.unloadOnCloseGroup = this.#createToggleGroup(
      this.unloadOnCloseToggle,
      "Unload from memory after closing"
    );

    this.buttonsRow = this.#createButtonsRow();
    this.multiView = this.#createMultiView();

    this.addEventListener("popupshown", () => {
      this.urlInput.focus();
    });
  }

  #createFaviconResetButton() {
    const button = new ToolbarButton({
      classList: [
        "subviewbutton",
        "subviewbutton-iconic",
        "sidebar-2-popup-button",
      ],
    }).setIcon("chrome://global/skin/icons/undo.svg");

    button.addEventListener("mousedown", async (event) => {
      if (event.button !== 0) {
        return;
      }

      const faviconURL = await fetchIconURL(this.urlInput.getValue());
      this.faviconURLInput.setValue(faviconURL).setBackgroundImage(faviconURL);
    });

    return button;
  }

  #createFaviconRow() {
    const row = new HBox({
      id: "sidebar-2-web-panel-popup-edit-favicon-row",
    });
    row.appendChild(this.faviconURLInput).appendChild(this.faviconResetButton);
    return row;
  }

  /**
   *
   * @returns {HBox}
   */
  #createButtonsRow() {
    const row = new HBox({
      id: "sidebar-2-web-panel-popup-edit-multiview-buttons-row",
    });

    row
      .appendChild(
        this.moveButtons
          .appendChild(this.moveUpButton)
          .appendChild(this.moveDownButton)
      )
      .appendChild(
        this.storageButtons
          .appendChild(this.deleteButton)
          .appendChild(this.saveButton)
      );
    return row;
  }

  /**
   *
   * @returns {PanelMultiView}
   */
  #createMultiView() {
    this.panelHeader.appendChild(this.header);
    const multiView = new PanelMultiView({
      id: "sidebar-2-web-panel-popup-edit-multiview",
    })
      .appendChild(this.panelHeader)
      .appendChild(new ToolbarSeparator())
      .appendChild(this.urlInputHeader)
      .appendChild(this.urlInput)
      .appendChild(this.faviconURLInputHeader)
      .appendChild(this.faviconRow)
      .appendChild(this.mobileGroup)
      .appendChild(this.loadOnStartupGroup)
      .appendChild(this.unloadOnCloseGroup)
      .appendChild(this.buttonsRow);

    this.appendChild(multiView);
    return multiView;
  }

  #createURLInput() {
    const input = new Input().setType("text");
    return input;
  }

  #createFaviconURLInput() {
    const input = new Input({
      id: "sidebar-2-web-panel-favicon-input",
    }).setType("text");

    input.addEventListener("input", () => {
      const faviconURL = input.getValue();
      input.setBackgroundImage(faviconURL);
    });

    return input;
  }

  /**
   *
   * @returns {ToolbarButton}
   */
  #createMoveDownButton() {
    return new ToolbarButton({
      classList: [
        "subviewbutton",
        "subviewbutton-iconic",
        "sidebar-2-popup-button",
      ],
    }).setIcon("chrome://global/skin/icons/arrow-down.svg");
  }

  /**
   *
   * @param {function(string):void} callback
   */
  listenMoveDownButtonClick(callback) {
    this.moveDownButton.addEventListener("mousedown", (event) => {
      if (event.button !== 0) {
        return;
      }
      callback(this.uuid);
    });
  }

  /**
   *
   * @returns {ToolbarButton}
   */
  #createMoveUpButton() {
    return new ToolbarButton({
      classList: [
        "subviewbutton",
        "subviewbutton-iconic",
        "sidebar-2-popup-button",
      ],
    }).setIcon("chrome://global/skin/icons/arrow-up.svg");
  }

  /**
   *
   * @param {function(string):void} callback
   */
  listenMoveUpButtonClick(callback) {
    this.moveUpButton.addEventListener("mousedown", (event) => {
      if (event.button !== 0) {
        return;
      }
      callback(this.uuid);
    });
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
   * @param {Button} toggle
   * @param {string} text
   * @returns {HBox}
   */
  #createToggleGroup(toggle, text) {
    const box = new HBox({
      classList: ["sidebar-2-popup-group"],
    });
    const label = new Header(1).setText(text);
    box.appendChildren(label, toggle);
    return box;
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
   * @param {function(string, string, string, boolean, boolean, boolean):void} callback
   */
  listenSaveButtonClick(callback) {
    this.saveButton.addEventListener("mousedown", (event) => {
      if (event.button !== 0) {
        return;
      }

      const url = this.urlInput.getValue();
      const faviconURL = this.faviconURLInput.getValue();
      const mobile = this.mobileToggle.getPressed();
      const loadOnStartup = this.loadOnStartupToggle.getPressed();
      const unloadOnClose = this.unloadOnCloseToggle.getPressed();

      callback(
        this.uuid,
        url,
        faviconURL,
        mobile,
        loadOnStartup,
        unloadOnClose
      );
    });
  }

  /**
   *
   * @returns {Button}
   */
  #createDeleteButton() {
    return new Button({ classList: ["footer-button"] }).setText("Delete");
  }

  /**
   *
   * @param {function(string):void} callback
   */
  listenDeleteButtonClick(callback) {
    this.deleteButton.addEventListener("mousedown", (event) => {
      if (event.button !== 0) {
        return;
      }
      callback(this.uuid);
    });
  }

  /**
   *
   * @param {string} uuid
   * @param {string} url
   * @param {string} faviconURL
   * @param {boolean} mobile
   * @param {boolean} loadOnStartup
   * @param {boolean} unloadOnClose
   * @param {boolean} isFirst
   * @param {boolean} isLast
   */
  setDefaults(
    uuid,
    url,
    faviconURL,
    mobile,
    loadOnStartup,
    unloadOnClose,
    isFirst,
    isLast
  ) {
    this.uuid = uuid;
    this.urlInput.setValue(url);
    this.faviconURLInput.setValue(faviconURL).setBackgroundImage(faviconURL);
    this.mobileToggle.setPressed(mobile);
    this.loadOnStartupToggle.setPressed(loadOnStartup);
    this.unloadOnCloseToggle.setPressed(unloadOnClose);
    this.moveUpButton.setDisabled(isFirst);
    this.moveDownButton.setDisabled(isLast);
  }
}
