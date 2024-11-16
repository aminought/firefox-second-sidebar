import { XULElement } from "./xul_element.mjs";

export class Browser extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {HTMLElement?} params.element
   */
  constructor({ id = null, classList = [], element } = {}) {
    super("browser", { id, classList, element });
  }

  /**
   *
   * @param {string} value
   * @returns {Browser}
   */
  setDisableGlobalHistory(value) {
    return this.setAttribute("disableglobalhistory", value);
  }

  /**
   *
   * @param {string} value
   * @returns {Browser}
   */
  setType(value) {
    return this.setAttribute("type", value);
  }

  /**
   *
   * @param {string} value
   * @returns {Browser}
   */
  setRemote(value) {
    return this.setAttribute("remote", value);
  }

  /**
   *
   * @returns {boolean}
   */
  canGoBack() {
    try {
      return this.element.canGoBack;
    } catch (error) {
      console.log("Failed to get canGoBack:", error);
      return false;
    }
  }

  /**
   *
   * @returns {Browser}
   */
  goBack() {
    this.element.goBack();
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  canGoForward() {
    try {
      return this.element.canGoForward;
    } catch (error) {
      console.log("Failed to get canForward:", error);
      return false;
    }
  }

  /**
   *
   * @returns {Browser}
   */
  goForward() {
    this.element.goForward();
    return this;
  }

  /**
   *
   * @returns {Browser}
   */
  reload() {
    this.element.reload();
    return this;
  }

  /**
   *
   * @param {string} url
   * @returns {Browser}
   */
  go(url) {
    this.element.loadURI(NetUtil.newURI(url), {
      triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
    });

    return this;
  }

  /**
   *
   * @returns {string}
   */
  getTitle() {
    return this.element.contentTitle;
  }

  /**
   *
   * @param {object} listener
   * @returns {Browser}
   */
  addProgressListener(listener) {
    this.element.addProgressListener(listener, null);
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {Browser}
   */
  setDocShellIsActive(value) {
    this.element.docShellIsActive = value;
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {Browser}
   */
  preserveLayers(value) {
    this.element.preserveLayers(value);
    return this;
  }

  /**
   *
   * @param {string} userAgent
   * @returns {Browser}
   */
  setCustomUserAgent(userAgent) {
    const browsingContext = this.element.browsingContext;
    if (browsingContext && userAgent !== browsingContext.customUserAgent) {
      browsingContext.customUserAgent = userAgent;
    }
    return this;
  }
}
