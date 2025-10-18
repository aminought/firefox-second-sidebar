import { FALLBACK_ICON, fetchIconURL } from "../utils/icons.mjs";

import { NotificationBadge } from "./notification_badge.mjs";
import { WebPanelSettings } from "../settings/web_panel_settings.mjs"; // eslint-disable-line no-unused-vars
import { WebPanelSoundIcon } from "./web_panel_sound_icon.mjs";
import { Widget } from "./base/widget.mjs";
import { applyContainerColor } from "../utils/containers.mjs";
import { clearUrl } from "../utils/url.mjs";
import { ellipsis } from "../utils/string.mjs";

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

    this.setUserContextId(webPanelSettings.userContextId).setLabel(
      webPanelSettings.url,
    );

    this.hideSoundIcon(webPanelSettings.hideSoundIcon);
    this.hideNotificationBadge(webPanelSettings.hideNotificationBadge);

    if (webPanelSettings.dynamicFavicon) {
      fetchIconURL(webPanelSettings.url).then((faviconURL) => {
        this.setIcon(faviconURL);
      });
    } else {
      this.setIcon(webPanelSettings.faviconURL ?? FALLBACK_ICON);
    }
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
    text = ellipsis(clearUrl(text), URL_LABEL_LIMIT);
    return Widget.prototype.setLabel.call(this, text);
  }

  /**
   *
   * @param {string} text
   * @returns {WebPanelButton}
   */
  setTooltipText(text) {
    text = ellipsis(clearUrl(text), URL_TOOLTIP_LIMIT);
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

  /**
   *
   * @returns {boolean}
   */
  getLoading() {
    return this.button.hasAttribute("loading");
  }

  /**
   *
   * @param {boolean} loading
   * @returns {WebPanelButton}
   */
  setLoading(loading) {
    return this.doWhenButtonReady(() => {
      if (loading) {
        this.button.setAttribute("loading", true);
      } else {
        this.button.removeAttribute("loading");
      }
    });
  }
}
