import { Img } from "./base/img.mjs";
import { Widget } from "./base/widget.mjs";
import { ellipsis } from "../utils/string.mjs";

const URL_TOOLTIP_LIMIT = 64;

export class WebPanelButton extends Widget {
  /**
   *
   * @param {string} uuid
   */
  constructor(uuid, position) {
    super({
      id: uuid,
      classList: ["sb2-main-button", "sb2-main-web-panel-button"],
      context: "sb2-web-panel-button-menupopup",
      position,
    });

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
    this.setOnClick((event) => {
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
    return this.element.getAttribute("open") === "true";
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  setOpen(value) {
    if (this.element) {
      if (value) {
        this.element.setAttribute("open", value);
      } else {
        this.element.removeAttribute("open");
      }
    }
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  setUnloaded(value) {
    if (this.element) {
      if (value) {
        this.element.setAttribute("unloaded", value);
      } else {
        this.element.removeAttribute("unloaded");
      }
    }
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  isUnloaded() {
    return this.element.getAttribute("unloaded") === "true";
  }

  /**
   *
   * @param {string} text
   * @returns {WebPanelButton}
   */
  setLabel(text) {
    text = ellipsis(
      text.replace("https://", "").replace("http://", ""),
      URL_TOOLTIP_LIMIT,
    );
    return Widget.prototype.setLabel.call(this, text);
  }
}
