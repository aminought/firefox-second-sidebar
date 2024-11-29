import {
  createCancelButton,
  createDeleteButton,
  createPopupHeader,
} from "../utils/xul.mjs";

/* eslint-disable no-unused-vars */
import { HBox } from "./base/hbox.mjs";
import { Label } from "./base/label.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { ToolbarSeparator } from "./base/toolbar_separator.mjs";
import { WebPanelController } from "../controllers/web_panel.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

/* eslint-enable no-unused-vars */

export class WebPanelPopupDelete extends Panel {
  constructor() {
    super({
      id: "sb2-web-panel-delete",
      classList: ["sb2-popup", "sb2-popup-with-header"],
    });
    this.setType("arrow").setRole("group");

    this.deleteButton = createDeleteButton();
    this.cancelButton = createCancelButton();
    this.#compose();
  }

  #compose() {
    this.appendChild(
      new PanelMultiView().appendChildren(
        createPopupHeader("Delete Web Panel"),
        new ToolbarSeparator(),
        new Label().setText("Are you sure? This action cannot be undone."),
        new HBox({
          id: "sb2-web-panel-delete-buttons",
        }).appendChildren(this.cancelButton, this.deleteButton),
      ),
    );
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenDeleteButtonClick(callback) {
    this.deleteButton.addEventListener("mousedown", (event) => {
      if (isLeftMouseButton(event)) {
        callback(this.uuid);
      }
    });
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenCancelButtonClick(callback) {
    this.cancelButton.addEventListener("mousedown", (event) => {
      if (isLeftMouseButton(event)) {
        callback();
      }
    });
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openPopup(webPanelController) {
    this.uuid = webPanelController.getUUID();

    this.restoreWebPanelButtonState = () => {
      webPanelController.webPanelButton.setOpen(webPanelController.isActive());
      this.removeEventListener("popuphidden", this.restoreWebPanelButtonState);
    };
    this.addEventListener("popuphidden", this.restoreWebPanelButtonState);

    Panel.prototype.openPopup.call(this, webPanelController.webPanelButton);
  }
}
