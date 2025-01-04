import {
  createCancelButton,
  createCreateButton,
  createInput,
  createPopupGroup,
  createPopupHeader,
} from "../utils/xul.mjs";

import { HBox } from "./base/hbox.mjs";
import { MenuList } from "./base/menulist.mjs";
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
    this.containerList = this.#createContainerList();

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
        createPopupGroup("Container", this.containerList),
        new HBox({
          id: "sb2-web-panel-new-buttons",
        }).appendChildren(this.cancelButton, this.saveButton),
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
   * @returns {MenuList}
   */
  #createContainerList() {
    // const containers = await browser.contextualIdentities.query({});
    const containerMenuList = new MenuList();
    const containers = ContextualIdentityService.getPublicUserContextIds();
    containerMenuList.appendItem("Unset", "0");
    for (const container of containers) {
      const label = ContextualIdentityService.getUserContextLabel(container);
      containerMenuList.appendItem(label, container);
    }

    return containerMenuList;
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenSaveButtonClick(callback) {
    this.saveButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        callback(this.input.getValue(), this.containerList.getValue());
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
