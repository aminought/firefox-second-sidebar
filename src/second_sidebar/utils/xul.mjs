import { Button } from "../xul/base/button.mjs";
import { HBox } from "../xul/base/hbox.mjs";
import { Header } from "../xul/base/header.mjs";
import { Input } from "../xul/base/input.mjs";
import { MenuList } from "../xul/base/menulist.mjs";
import { ToolbarButton } from "../xul/base/toolbar_button.mjs";
import { VBox } from "../xul/base/vbox.mjs";
import { XULElement } from "../xul/base/xul_element.mjs"; // eslint-disable-line no-unused-vars
import { ZoomManagerWrapper } from "../wrappers/zoom_manager.mjs";

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
export function createInput({ id = null, type = "text" } = {}) {
  return new Input({ id }).setType(type);
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
  zoomInButton.setDisabled(zoom >= ZoomManagerWrapper.MAX);
  zoomOutButton.setDisabled(zoom <= ZoomManagerWrapper.MIN);
}

/**
 *
 * @param {string} text
 * @returns {Button}
 */
export function createPrimaryButton(text) {
  return new Button({
    classList: ["footer-button", "primary"],
  }).setText(text);
}

/**
 *
 * @returns {Button}
 */
export function createCreateButton() {
  return createPrimaryButton("Create");
}

/**
 *
 * @returns {Button}
 */
export function createSaveButton() {
  return createPrimaryButton("Save");
}

/**
 *
 * @returns {Button}
 */
export function createDeleteButton() {
  return createPrimaryButton("Delete");
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
 * @param {string} text
 * @param {XULElement} element
 * @returns {HBox}
 */
export function createPopupGroup(text, element) {
  return new HBox({
    classList: ["sb2-popup-group"],
  }).appendChildren(new Header(1).setText(text), element);
}

/**
 *
 * @param {string?} text
 * @param {XULElement[]} elements
 * @returns {VBox}
 */
export function createPopupSet(text, elements) {
  const vbox = new VBox({ classList: ["sb2-popup-set"] });
  if (text !== null) vbox.appendChild(createPopupSetHeader(text));
  vbox.appendChild(createPopupSetBody(elements));
  return vbox;
}

/**
 *
 * @param {string} text
 * @returns {Header}
 */
export function createPopupSetHeader(text) {
  return new Header(1, { classList: ["sb2-popup-set-header"] }).setText(text);
}

/**
 *
 * @param {XULElement[]} elements
 * @returns {VBox}
 */
export function createPopupSetBody(elements) {
  return new VBox({
    classList: ["sb2-popup-set-body"],
  }).appendChildren(...elements);
}

/**
 *
 * @param {number} level
 * @param {string} text
 * @param {XULElement} element
 * @returns {HBox}
 */
export function createPopupHeaderGroup(level, text, element) {
  return new HBox({
    classList: ["sb2-popup-group"],
  }).appendChildren(new Header(level).setText(text), element);
}

/**
 *
 * @param {XULElement[]} elements
 * @returns {HBox}
 */
export function createPopupRow(...elements) {
  return new HBox({
    classList: ["sb2-popup-row"],
  }).appendChildren(...elements);
}

/**
 *
 * @param {object} params
 * @param {string?} params.id
 * @param {string[]} params.classList
 * @returns {MenuList}
 */
export function createMenuList({ id = null, classList = [] } = {}) {
  return new MenuList({ id, classList: ["sb2-popup-menu-list", ...classList] });
}
