/* eslint-disable no-unused-vars */
import { createCancelButton, createDeleteButton } from "../utils/xul.mjs";

import { Label } from "./base/label.mjs";
import { Panel } from "./base/panel.mjs";
import { PanelMultiView } from "./base/panel_multi_view.mjs";
import { PopupBody } from "./popup_body.mjs";
import { PopupFooter } from "./popup_footer.mjs";
import { PopupHeader } from "./popup_header.mjs";
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
        new PopupHeader("Delete Web Panel"),
        new PopupBody().appendChildren(
          new Label().setText("Are you sure? This action cannot be undone."),
        ),
        new PopupFooter().appendChildren(this.cancelButton, this.deleteButton),
      ),
    );
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {WebPanelPopupNew}
   */
  listenDeleteButtonClick(callback) {
    this.deleteButton.addEventListener("click", (event) => {
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
    this.cancelButton.addEventListener("click", (event) => {
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

    this.restoreWebPanelButtonState = (event) => {
      if (event.target.id !== this.id) {
        return;
      }
      webPanelController.button.setOpen(webPanelController.isActive());
      this.removeEventListener("popuphidden", this.restoreWebPanelButtonState);
    };
    this.addEventListener("popuphidden", this.restoreWebPanelButtonState);

    Panel.prototype.openPopup.call(this, webPanelController.button);
  }
}
