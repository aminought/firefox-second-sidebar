import { createMozButton } from "../utils/xul.mjs";

import { HBox } from "./base/hbox.mjs";
import { Label } from "./base/label.mjs";
import { PopupFooter } from "./popup_footer.mjs";
import { VBox } from "./base/vbox.mjs";
import { isLeftMouseButton } from "../utils/buttons.mjs";

let confirmationId = 0;

export class PopupDiscardConfirmation extends VBox {
  /**
   *
   * @param {object} params
   * @param {function():void} params.onDiscard
   */
  constructor({ onDiscard }) {
    const id = `sb2-popup-discard-confirmation-${++confirmationId}`;
    super({ id, classList: ["sb2-popup-discard-confirmation"] });

    this.keepEditingButton = createMozButton("Keep Editing");
    this.discardChangesButton = createMozButton("Discard", "destructive");
    this.previouslyFocusedElement = null;

    const titleId = `${id}-title`;
    const descriptionId = `${id}-description`;
    this.setAttribute("role", "alertdialog")
      .setAttribute("aria-modal", "true")
      .setAttribute("aria-labelledby", titleId)
      .setAttribute("aria-describedby", descriptionId)
      .appendChild(
        new VBox({
          classList: ["sb2-popup-discard-confirmation-card"],
        }).appendChildren(
          new HBox({
            classList: ["sb2-popup-discard-confirmation-title"],
          }).appendChildren(
            new Label({
              classList: ["sb2-popup-discard-confirmation-icon"],
            })
              .setAttribute("aria-hidden", "true")
              .setText("!"),
            new Label({
              id: titleId,
              classList: ["sb2-popup-discard-confirmation-heading"],
            }).setText("Discard changes?"),
          ),
          new Label({
            id: descriptionId,
            classList: ["sb2-popup-discard-confirmation-description"],
          }).setText("Your unsaved changes will be lost."),
          new PopupFooter().appendChildren(
            this.keepEditingButton,
            this.discardChangesButton,
          ),
        ),
      );
    super.hide();

    this.keepEditingButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        this.hide();
      }
    });
    this.discardChangesButton.addEventListener("click", (event) => {
      if (isLeftMouseButton(event)) {
        onDiscard();
      }
    });
    this.addEventListener("keydown", (event) => this.#trapFocus(event));
  }

  /**
   * @returns {boolean}
   */
  isVisible() {
    return !this.hidden();
  }

  /**
   * @returns {PopupDiscardConfirmation}
   */
  show() {
    if (this.isVisible()) {
      return this;
    }
    this.previouslyFocusedElement = document.activeElement;
    super.show();
    this.keepEditingButton.focus();
    return this;
  }

  /**
   *
   * @param {object} params
   * @param {boolean} params.restoreFocus
   * @returns {PopupDiscardConfirmation}
   */
  hide({ restoreFocus = true } = {}) {
    if (!this.isVisible()) {
      return this;
    }

    super.hide();
    const previouslyFocusedElement = this.previouslyFocusedElement;
    this.previouslyFocusedElement = null;
    if (restoreFocus && previouslyFocusedElement?.isConnected) {
      previouslyFocusedElement.focus();
    }
    return this;
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  #trapFocus(event) {
    if (event.key !== "Tab") {
      return;
    }

    const keepEditingButton = this.keepEditingButton.getXUL();
    const discardChangesButton = this.discardChangesButton.getXUL();
    if (event.shiftKey && document.activeElement === keepEditingButton) {
      event.preventDefault();
      this.discardChangesButton.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === discardChangesButton
    ) {
      event.preventDefault();
      this.keepEditingButton.focus();
    }
  }
}
