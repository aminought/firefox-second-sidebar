/* eslint-disable no-unused-vars */
import { FALLBACK_ICON, useAvailableIcon } from "../utils/icons.mjs";

import { NotificationBadge } from "./notification_badge.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs";
import { WebPanelSoundIcon } from "./web_panel_sound_icon.mjs";
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

    this.soundIcon = new WebPanelSoundIcon();
    this.notificationBadge = new NotificationBadge();
    this.doWhenButtonReady(() => {
      const badgeStackXUL = this.button.getBadgeStackXUL();
      badgeStackXUL.appendChild(this.soundIcon.element);
      badgeStackXUL.appendChild(this.notificationBadge.element);
    });

    this.setUserContextId(webPanelSettings.userContextId)
      .setLabel(webPanelSettings.url)
      .setTooltipText(webPanelSettings.url);

    this.hideSoundIcon(webPanelSettings.hideSoundIcon);
    this.hideNotificationBadge(webPanelSettings.hideNotificationBadge);

    useAvailableIcon(webPanelSettings.faviconURL, FALLBACK_ICON).then(
      (faviconURL) => this.setIcon(faviconURL),
    );
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
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  hideSoundIcon(value) {
    return this.doWhenButtonReady(() => {
      if (value) {
        this.soundIcon.hide();
      } else {
        this.soundIcon.show();
      }
    });
  }

  /**
   *
   * @param {boolean} isSoundPlaying
   * @param {boolean} isMuted
   * @returns {WebPanelButton}
   */
  setSoundIcon(isSoundPlaying, isMuted) {
    return this.doWhenButtonReady(() => {
      this.soundIcon.setSoundPlaying(isSoundPlaying).setMuted(isMuted);
    });
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelButton}
   */
  hideNotificationBadge(value) {
    return this.doWhenButtonReady(() => {
      if (value) {
        this.notificationBadge.hide();
      } else {
        this.notificationBadge.show();
      }
    });
  }

  /**
   *
   * @param {number?} value
   * @returns {WebPanelButton}
   */
  setNotificationBadge(value) {
    return this.doWhenButtonReady(() => {
      this.notificationBadge.setValue(value);
    });
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
        applyContainerColor(userContextId, this.button.getBadgeStackXUL()),
      ),
    );
  }
}
