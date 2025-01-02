import { Img } from "./base/img.mjs";
import { Widget } from "./base/widget.mjs";
import { ellipsis } from "../utils/string.mjs";

const URL_LABEL_LIMIT = 24;
const URL_TOOLTIP_LIMIT = 64;

export class WebPanelButton extends Widget {
  /**
   *
   * @param {string} uuid
   * @param {string?} position
   */
  constructor(uuid, position = null) {
    super({
      id: uuid,
      classList: ["sb2-main-button", "sb2-main-web-panel-button"],
      context: "sb2-web-panel-button-menupopup",
      position,
    });

    this.playingIcon = null;
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
    if (this.button) {
      if (this.playingIcon === null) {
        this.playingIcon = new Img({ classList: ["tab-icon-overlay"] })
          .setAttribute("role", "presentation")
          .setAttribute("soundplaying", "")
          .setAttribute("pinned", "");
        this.button.appendChild(this.playingIcon);
      }
      this.playingIcon.removeAttribute("hidden");
    }
    return this;
  }

  /**
   *
   * @returns {WebPanelButton}
   */
  hidePlayingIcon() {
    if (this.button && this.playingIcon !== null) {
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
   * @param {string} text
   * @returns {WebPanelButton}
   */
  setLabel(text) {
    text = ellipsis(
      text.replace("https://", "").replace("http://", ""),
      URL_LABEL_LIMIT,
    );
    return Widget.prototype.setLabel.call(this, text);
  }

  /**
   *
   * @param {string} text
   * @returns {WebPanelButton}
   */
  setTooltipText(text) {
    text = ellipsis(
      text.replace("https://", "").replace("http://", ""),
      URL_TOOLTIP_LIMIT,
    );
    return Widget.prototype.setTooltipText.call(this, text);
  }
}
