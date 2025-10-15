import {
  applyContainerColor,
  fillContainerMenuList,
} from "../utils/containers.mjs";
import {
  createCancelButton,
  createCreateButton,
  createInput,
  createMenuList,
  createPopupGroup,
  createPopupRow,
  createPopupSet,
} from "../utils/xul.mjs";

import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { PopupBody } from "./popup_body.mjs";
import { PopupFooter } from "./popup_footer.mjs";
import { PopupHeader } from "./popup_header.mjs";
import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { Toggle } from "./base/toggle.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

export class WebPanelPopupNew extends Panel {
  constructor() {
    super({
      id: "sb2-web-panel-new",
      classList: ["sb2-popup", "sb2-popup-with-header"],
    });
    this.setType("arrow").setRole("group");

    this.input = createInput({ placeholder: "Web page URL" });
    this.containerMenuList = createMenuList({ id: "sb2-container-menu-list" });
    this.temporaryToggle = new Toggle();

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
        new PopupHeader("New Web Panel"),
        new PopupBody().appendChildren(
          createPopupSet("", [
            createPopupRow(this.input),
            new ToolbarSeparator(),
            createPopupGroup("Multi-Account Container", this.containerMenuList),
            new ToolbarSeparator(),
            createPopupGroup("Temporary", this.temporaryToggle),
          ]),
        ),
        new PopupFooter().appendChildren(this.cancelButton, this.saveButton),
      ),
    );
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenSaveButtonClick(callback) {
    this.input.addEventListener("keyup", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "Enter" || event.keyCode === 13) {
        callback(
          this.input.getValue(),
          this.containerMenuList.getValue(),
          this.temporaryToggle.getPressed(),
        );
      }
    });
    this.saveButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isLeftMouseButton(event)) {
        callback(
          this.input.getValue(),
          this.containerMenuList.getValue(),
          this.temporaryToggle.getPressed(),
        );
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
   * @param {XULElement | Widget} target
   * @param {string} suggest
   * @returns {WebPanelPopupNew}
   */
  openPopup(target, suggest) {
    this.input.setValue(suggest);

    fillContainerMenuList(this.containerMenuList);
    this.containerMenuList.setValue(
      ScriptSecurityManagerWrapper.DEFAULT_USER_CONTEXT_ID,
    );
    applyContainerColor(
      ScriptSecurityManagerWrapper.DEFAULT_USER_CONTEXT_ID,
      this.containerMenuList.getXUL(),
    );

    this.temporaryToggle.setPressed(false);

    return Panel.prototype.openPopup.call(this, target);
  }
}
