import { FullZoomWrapper } from "../../wrappers/full_zoom.mjs";
import { NetUtilWrapper } from "../../wrappers/net_utils.mjs";
import { ScriptSecurityManagerWrapper } from "../../wrappers/script_security_manager.mjs";
import { XULElement } from "./xul_element.mjs";
import { ZoomManagerWrapper } from "../../wrappers/zoom_manager.mjs";

export class Browser extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {HTMLElement?} params.element
   */
  constructor({ id = null, classList = [], element } = {}) {
    super({ tag: "browser", id, classList, element });
    this.ZOOM_DELTA = 0.1;
  }

  getTabBrowser() {
    return this.element.getTabBrowser();
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
   * @returns {string}
   */
  getCurrentUrl() {
    return this.element.currentURI.spec;
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
    return ZoomManagerWrapper.getZoomForBrowser(this.element);
  }

  /**
   *
   * @returns {Browser}
   */
  zoomIn() {
    FullZoomWrapper.changeZoomBy(this.element, this.ZOOM_DELTA);
    return this;
  }

  /**
   *
   * @returns {Browser}
   */
  zoomOut() {
    FullZoomWrapper.changeZoomBy(this.element, -this.ZOOM_DELTA);
    return this;
  }

  /**
   *
   * @returns {Browser}
   */
  setZoom(value) {
    FullZoomWrapper.setZoom(value, this.element);
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
    this.element.addProgressListener(listener);
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
