import { Img } from "./base/img.mjs";

export class WebPanelPlayingIcon extends Img {
  constructor() {
    super({ classList: ["tab-icon-overlay"] });
    this.setAttribute("role", "presentation").setAttribute("pinned", "");
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelPlayingIcon}
   */
  setSoundPlaying(value) {
    return this.toggleAttribute("soundplaying", value);
  }

  /**
   *
   * @param {boolean} value
   * @returns {WebPanelPlayingIcon}
   */
  setMuted(value) {
    return this.toggleAttribute("muted", value);
  }
}
