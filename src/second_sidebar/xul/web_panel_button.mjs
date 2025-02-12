import { Img } from "./base/img.mjs";
import { Widget } from "./base/widget.mjs";
import { applyContainerColor } from "../utils/containers.mjs";
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
    return this.doWhenButtonReady(() => {
      if (this.playingIcon === null) {
        this.playingIcon = new Img({ classList: ["tab-icon-overlay"] })
          .setAttribute("role", "presentation")
          .setAttribute("soundplaying", "")
          .setAttribute("pinned", "");
        this.button.appendChild(this.playingIcon);
      }
      this.playingIcon.removeAttribute("hidden");
    });
  }

  /**
   *
   * @returns {WebPanelButton}
   */
  hidePlayingIcon() {
    return this.doWhenButtonReady(() => {
      if (this.playingIcon !== null) {
        this.playingIcon.setAttribute("hidden", "true");
      }
    });
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
      text.replace(/http:\/\/|https:\/\/|\/$/g, ""),
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
      text.replace(/http:\/\/|https:\/\/|\/$/g, ""),
      URL_TOOLTIP_LIMIT,
    );
    return Widget.prototype.setTooltipText.call(this, text);
  }

  /**
   *
   * @param {string} userContextId
   * @returns {WebPanelButton}
   */
  setUserContextId(userContextId) {
    return this.doWhenButtonReady(() =>
      this.doWhenButtonImageReady(() =>
        applyContainerColor(userContextId, this.button.getImageXUL()),
      ),
    );
  }
}
