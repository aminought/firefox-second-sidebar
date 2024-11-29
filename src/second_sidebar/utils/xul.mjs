import { Button } from "../xul/base/button.mjs";
import { HBox } from "../xul/base/hbox.mjs";
import { Header } from "../xul/base/header.mjs";
import { Input } from "../xul/base/input.mjs";
import { Label } from "../xul/base/label.mjs";
import { ToolbarButton } from "../xul/base/toolbar_button.mjs";

/**
 *
 * @param {string} text
 * @param {object} params
 * @param {string?} params.id
 * @param {string?} params.tooltipText
 * @returns {ToolbarButton}
 */
export function createSubviewButton(
  text,
  { id = null, tooltipText = null, type = null } = {},
) {
  const button = new ToolbarButton({
    id,
    classList: ["subviewbutton"],
  })
    .setLabel(text)
    .setType(type);
  if (tooltipText) {
    button.setTooltipText(tooltipText);
  }
  return button;
}

/**
 *
 * @param {string} iconURL
 * @param {string?} params.id
 * @param {string?} params.tooltipText
 * @returns {ToolbarButton}
 */
export function createSubviewIconicButton(
  iconURL,
  { id = null, tooltipText = null } = {},
) {
  const button = new ToolbarButton({
    id,
    classList: ["subviewbutton", "subviewbutton-iconic", "sb2-button-iconic"],
  }).setIcon(iconURL);
  if (tooltipText) {
    button.setTooltipText(tooltipText);
  }
  return button;
}

/**
 *
 * @param {object} params
 * @param {string} params.type
 * @returns {Input}
 */
export function createInput({ type = "text" } = {}) {
  return new Input().setType(type);
}

/**
 *
 * @param {ToolbarButton} zoomOutButton
 * @param {ToolbarButton} resetZoomButton
 * @param {ToolbarButton} zoomInButton
 * @returns {HBox}
 */
export function createZoomButtons(
  zoomOutButton,
  resetZoomButton,
  zoomInButton,
) {
  return new HBox({ id: "sb2-zoom-buttons" }).appendChildren(
    zoomOutButton,
    resetZoomButton,
    zoomInButton,
  );
}

/**
 *
 * @param {number} zoom
 * @param {ToolbarButton} zoomOutButton
 * @param {ToolbarButton} resetZoomButton
 * @param {ToolbarButton} zoomInButton
 */
export function updateZoomButtons(
  zoom,
  zoomOutButton,
  resetZoomButton,
  zoomInButton,
) {
  resetZoomButton
    .setLabel((zoom * 100).toFixed(0) + "%")
    .setDisabled(zoom === 1);
  zoomInButton.setDisabled(zoom >= ZoomManager.MAX);
  zoomOutButton.setDisabled(zoom <= ZoomManager.MIN);
}

/**
 *
 * @returns {Button}
 */
export function createSaveButton() {
  return new Button({
    classList: ["footer-button", "primary"],
  }).setText("Save");
}

/**
 *
 * @returns {Button}
 */
export function createCancelButton() {
  return new Button({ classList: ["footer-button"] }).setText("Cancel");
}

/**
 *
 * @returns {Button}
 */
export function createDeleteButton() {
  return new Button({
    classList: ["footer-button", "primary"],
  }).setText("Delete");
}

/**
 *
 * @param {string} text
 * @returns {HBox}
 */
export function createPopupHeader(text) {
  return new HBox({ classList: ["panel-header"] }).appendChild(
    new Header(1).setText(text),
  );
}

/**
 *
 * @param {string} text
 * @param {XULElement} element
 * @returns {HBox}
 */
export function createPopupGroup(text, element) {
  return new HBox({
    classList: ["sb2-popup-group"],
  }).appendChildren(new Label().setText(text), element);
}