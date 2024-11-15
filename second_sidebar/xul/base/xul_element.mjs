export class XULElement {
  /**
   *
   * @param {string?} tag
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {function(string):HTMLElement} params.create
   * @param {HTMLElement?} params.element
   */
  constructor(
    tag,
    {
      id = null,
      classList = [],
      create = (tag) => document.createXULElement(tag),
      element,
    } = {}
  ) {
    this.element = element ?? create(tag);
    if (id !== null) {
      this.element.id = id;
    }
    if (classList.length > 0) {
      this.element.classList.add(...classList);
    }
  }

  getXUL() {
    return this.element;
  }

  /**
   *
   * @returns {XULElement}
   */
  show() {
    return this.removeAttribute("hidden");
  }

  /**
   *
   * @returns {XULElement}
   */
  hide() {
    return this.setAttribute("hidden", "true");
  }

  /**
   *
   * @returns {boolean}
   */
  hidden() {
    return this.getAttribute("hidden") === "true";
  }

  /**
   *
   * @param {XULElement} child
   * @returns {XULElement}
   */
  appendChild(child) {
    this.element.appendChild(child.getXUL());
    return this;
  }

  /**
   *
   * @param {Array<XULElement>} children
   * @returns {XULElement}
   */
  appendChildren(...children) {
    children.forEach((child) => this.appendChild(child));
    return this;
  }

  /**
   *
   * @param {string} name
   * @param {string|number} value
   * @returns {XULElement}
   */
  setAttribute(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }

  /**
   *
   * @param {string} name
   * @returns {string|number}
   */
  getAttribute(name) {
    return this.element.getAttribute(name);
  }

  /**
   *
   * @param {string} name
   * @returns {XULElement}
   */
  removeAttribute(name, value) {
    this.element.removeAttribute(name);
    return this;
  }

  /**
   *
   * @returns {string}
   */
  getWidth() {
    return this.getAttribute("width");
  }

  /**
   *
   * @param {string} width
   * @returns {XULElement}
   */
  setWidth(width) {
    this.setAttribute("width", width);
    this.element.style.width = width + "px";
    return this;
  }

  /**
   *
   * @returns {DOMRect}
   */
  getBoundingClientRect() {
    return this.element.getBoundingClientRect();
  }

  /**
   *
   * @returns {XULElement}
   */
  focus() {
    this.element.focus();
    return this;
  }

  /**
   *
   * @param {string} context
   * @returns {XULElement}
   */
  setContext(context) {
    return this.setAttribute("context", context);
  }

  /**
   *
   * @param {string} event
   * @param {function(MouseEvent):void} callback
   * @returns {XULElement}
   */
  addEventListener(event, callback) {
    this.element.addEventListener(event, callback);
    return this;
  }

  /**
   *
   * @param {XULElement} element
   * @returns {boolean}
   */
  contains(element) {
    return this.element.contains(element.getXUL());
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  containsHTML(element) {
    return this.element.contains(element);
  }

  /**
   * @returns {XULElement}
   */
  remove() {
    this.element.remove();
    return this;
  }
}
