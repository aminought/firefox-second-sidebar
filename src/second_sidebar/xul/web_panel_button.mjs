/* eslint-disable no-unused-vars */
import { Img } from "./base/img.mjs";
import { WebPanelPlayingIcon } from "./web_panel_playing_icon.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { Widget } from "./base/widget.mjs";
import { applyContainerColor } from "../utils/containers.mjs";
import { ellipsis } from "../utils/string.mjs";
/* eslint-enable no-unused-vars */

const URL_LABEL_LIMIT = 24;
const URL_TOOLTIP_LIMIT = 64;

export class WebPanelButton extends Widget {
  /**
   *
   * @param {WebPanelSettings} webPanelSettings
   * @param {string?} position
   */
  constructor(webPanelSettings, position = null) {
    super({
      id: webPanelSettings.uuid,
      classList: ["sb2-main-button", "sb2-main-web-panel-button"],
      context: "sb2-web-panel-button-menupopup",
      position,
    });

    /**@type {WebPanelPlayingIcon} */
    this.playingIcon = new WebPanelPlayingIcon();
    this.doWhenButtonReady(() => {
      this.button.appendChild(this.playingIcon);
    });

    this.setUserContextId(webPanelSettings.userContextId)
      .setIcon(webPanelSettings.faviconURL)
      .setLabel(webPanelSettings.url)
      .setTooltipText(webPanelSettings.url);
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
   * @param {boolean} isSoundPlaying
   * @param {boolean} isMuted
   * @returns {WebPanelButton}
   */
  setPlayingIcon(isSoundPlaying, isMuted) {
    return this.doWhenButtonReady(() => {
      this.playingIcon.setSoundPlaying(isSoundPlaying).setMuted(isMuted);
    });
  }

  /**
   *
   * @param {boolean} isSoundPlaying
   * @param {boolean} isMuted
   * @returns {WebPanelButton}
   */
  setPlaying(isSoundPlaying, isMuted) {
    return this.setPlayingIcon(isSoundPlaying, isMuted);
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
