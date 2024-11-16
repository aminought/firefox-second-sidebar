import { Img } from "./base/img.mjs";
import { ToolbarButton } from "./base/toolbar_button.mjs";

export class WebPanelButton extends ToolbarButton {
  /**
   *
   * @param {string} uuid
   */
  constructor(uuid) {
    super({ classList: ["sidebar-2-main-button"] });
    this.uuid = uuid;

    this.playingIcon = null;
    this.setContext("");
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
}
