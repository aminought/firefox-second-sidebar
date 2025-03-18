import { NetUtilWrapper } from "../../wrappers/net_utils.mjs";
import { ScriptSecurityManagerWrapper } from "../../wrappers/script_security_manager.mjs";
import { XULElement } from "./xul_element.mjs";
import { ZoomManagerWrapper } from "../../wrappers/zoom_manager.mjs";

export class Browser extends XULElement {
  static ZOOM_DELTA = 0.1;
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {HTMLElement?} params.element
   */
  constructor({ id = null, classList = [], element } = {}) {
    super({ tag: "browser", id, classList, element });
  }

  /**
   * @returns {Document?}
   */
  get contentDocument() {
    return this.element.contentDocument;
  }

  /**
   *
   * @returns {string}
   */
  getCurrentUrl() {
    return this.element.currentURI.spec;
  }

  /**
   *
   * @param {object} progressListener
   * @returns {Browser}
   */
  addProgressListener(progressListener) {
    this.element.addProgressListener(
      progressListener,
      Ci.nsIWebProgress.NOTIFY_ALL,
    );
    return this;
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
    this.element.loadURI(NetUtilWrapper.newURI(url), {
      triggeringPrincipal: ScriptSecurityManagerWrapper.getSystemPrincipal(),
    });

    return this;
  }

  /**
   *
   * @returns {number}
   */
  getZoom() {
    return ZoomManagerWrapper.getZoomForBrowser(this);
  }

  /**
   *
   * @param {number} value
   * @returns {Browser}
   */
  setZoom(value) {
    ZoomManagerWrapper.setZoomForBrowser(this, value);
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
