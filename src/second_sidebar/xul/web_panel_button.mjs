import { Img } from "./base/img.mjs";
import { ToolbarButton } from "./base/toolbar_button.mjs";
import { ellipsis } from "../utils/string.mjs";

const URL_TOOLTIP_LIMIT = 64;

export class WebPanelButton extends ToolbarButton {
  /**
   *
   * @param {string} uuid
   */
  constructor(uuid) {
    super({ classList: ["sb2-main-button", "toolbarbutton-1"] });
    this.setAttribute("uuid", uuid).setContext(
      "sb2-web-panel-button-menupopup",
    );

    this.playingIcon = null;
  }

  get uuid() {
    return this.getAttribute("uuid");
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   * @returns {WebPanelButton}
   */
  listenClick(callback) {
    this.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      callback(event);
    });
    return this;
  }

  /**
   *
   * @returns {WebPanelButton}
   */
  showPlayingIcon() {
    if (this.playingIcon === null) {
      this.playingIcon = new Img({ classList: ["tab-icon-overlay"] })
        .setAttribute("role", "presentation")
        .setAttribute("soundplaying", "")
        .setAttribute("pinned", "");
      this.appendChild(this.playingIcon);
    }
    this.playingIcon.removeAttribute("hidden");
    return this;
  }

  /**
   *
   * @returns {WebPanelButton}
   */
  hidePlayingIcon() {
    if (this.playingIcon !== null) {
      this.playingIcon.setAttribute("hidden", "true");
    }
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  setPlaying(value) {
    if (value) {
      return this.showPlayingIcon();
    }
    return this.hidePlayingIcon();
  }

  /**
   *
   * @returns {boolean}
   */
  isOpen() {
    return this.element.open;
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  setOpen(value) {
    this.element.open = value;
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  setUnloaded(value) {
    this.setAttribute("unloaded", value);
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  isUnloaded() {
    return this.getAttribute("unloaded") === "true";
  }

  /**
   *
   * @param {string} text
   * @returns {WebPanelButton}
   */
  setTooltipText(text) {
    text = ellipsis(text, URL_TOOLTIP_LIMIT);
    return ToolbarButton.prototype.setTooltipText.call(this, text);
  }
}
