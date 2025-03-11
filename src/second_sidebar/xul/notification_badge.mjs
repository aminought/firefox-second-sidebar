import { Div } from "./base/div.mjs";
import { Span } from "./base/span.mjs";

export class NotificationBadge extends Div {
  constructor() {
    super({ classList: ["sb2-notification-badge"] });
    this.span = new Span();
    this.appendChild(this.span);
  }

  /**
   *
   * @param {number?} value
   * @returns {NotificationBadge}
   */
  setValue(value) {
    if (value && value > 0) {
      this.setAttribute("value", value);
      if (value < 100) {
        this.span.setText(value).setFontSize("80%");
      } else {
        this.span.setText("99+").setFontSize("60%");
      }
    } else {
      this.removeAttribute("value");
    }
    return this;
  }
}
