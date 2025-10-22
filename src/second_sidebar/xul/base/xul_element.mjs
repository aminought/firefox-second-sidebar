export class XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.tag
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {boolean} params.isXUL
   * @param {HTMLElement?} params.element
   */
  constructor({
    tag = null,
    id = null,
    classList = [],
    isXUL = true,
    element = null,
  } = {}) {
    /**@type {HTMLElement} */
    this.element = null;
    if (element !== null) {
      this.element = element;
    } else {
      this.element = isXUL
        ? document.createXULElement(tag)
        : document.createElement(tag);
    }
    if (id !== null) {
      this.element.id = id;
    }
    if (classList.length > 0) {
      this.element.classList.add(...classList);
    }
  }

  /**
   * @returns {string?}
   */
  get id() {
    return this.element.id;
  }

  /**
   *
   * @param {string} className
   * @returns {XULElement}
   */
  addClass(className) {
    this.element.classList.add(className);
    return this;
  }

  /**
   *
   * @param {string} className
   * @returns {boolean}
   */
  hasClass(className) {
    return this.element.classList.contains(className);
  }

  /**
   *
   * @returns {HTMLelement}
   */
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
    return this.setAttribute("hidden", true);
  }

  /**
   *
   * @returns {boolean}
   */
  hidden() {
    return this.getAttributeBool("hidden");
  }

  /**
   *
   * @param {string} selector
   * @returns {XULElement?}
   */
  querySelector(selector) {
    const element = this.element.querySelector(selector);
    if (element) {
      return new XULElement({ element });
    }
    return null;
  }

  /**
   *
   * @param {string} selector
   * @returns {XULElement[]}
   */
  querySelectorAll(selector) {
    const elements = this.element.querySelectorAll(selector);
    let xulElements = [];
    for (const element of elements) {
      xulElements.push(new XULElement({ element }));
    }
    return xulElements;
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
   * @param {XULElement} child
   * @returns {XULElement}
   */
  prependChild(child) {
    this.element.insertBefore(child.getXUL(), this.element.firstChild);
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
   * @param {XULElement} node
   * @param {XULElement} child
   * @returns {XULElement}
   */
  insertBefore(node, child) {
    this.element.insertBefore(node.getXUL(), child.getXUL());
    return this;
  }

  /**
   *
   * @param {XULElement} node
   * @param {XULElement} child
   * @returns {XULElement}
   */
  insertAfter(node, child) {
    this.element.insertBefore(node.getXUL(), child.getXUL().nextSibling);
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
   * @param {object} attributes
   * @returns {XULElement}
   */
  setAttributes(attributes = {}) {
    for (const [key, value] of Object.entries(attributes)) {
      this.setAttribute(key, value);
    }
    return this;
  }

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasAttribute(name) {
    return this.element.hasAttribute(name);
  }

  /**
   *
   * @param {string} name
   * @returns {string?}
   */
  getAttribute(name) {
    return this.element.getAttribute(name);
  }

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  getAttributeBool(name) {
    const value = this.element.getAttribute(name);
    return value === "true" || value === "";
  }

  /**
   *
   * @param {string} name
   * @returns {XULElement}
   */
  removeAttribute(name) {
    this.element.removeAttribute(name);
    return this;
  }

  /**
   *
   * @param {Array<string>} names
   * @returns {XULElement}
   */
  removeAttributes(names) {
    names.forEach((name) => this.removeAttribute(name));
    return this;
  }

  /**
   *
   * @param {string} name
   * @param {boolean} force
   * @returns {XULElement}
   */
  toggleAttribute(name, force) {
    this.element.toggleAttribute(name, force);
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
   * @param {string} property
   * @returns {string}
   */
  getProperty(property) {
    return this.element.style.getPropertyValue(property);
  }

  /**
   *
   * @param {string} property
   * @param {string} value
   * @returns {XULElement}
   */
  setProperty(property, value) {
    this.element.style.setProperty(property, value);
    return this;
  }

  /**
   *
   * @param {string} property
   * @returns {XULElement}
   */
  removeProperty(property) {
    this.element.style.removeProperty(property);
    return this;
  }

  /**
   *
   * @param {string} text
   * @returns {XULElement}
   */
  setInnerText(text) {
    this.element.innerText = text;
    return this;
  }

  /**
   *
   * @param {string} html
   * @returns {XULElement}
   */
  setInnerHtml(html) {
    this.element.innerHTML = html;
    return this;
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
   * @param {string} event
   * @param {function(MouseEvent):void} callback
   * @returns {XULElement}
   */
  removeEventListener(event, callback) {
    this.element.removeEventListener(event, callback);
    return this;
  }

  /**
   *
   * @param {Event} event
   * @returns {XULElement}
   */
  dispatchEvent(event) {
    this.element.dispatchEvent(event);
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
   *
   * @param {number} pointerId
   * @returns {XULElement}
   */
  setPointerCapture(pointerId) {
    this.element.setPointerCapture(pointerId);
    return this;
  }

  /**
   *
   * @param {number} pointerId
   * @returns {XULElement}
   */
  releasePointerCapture(pointerId) {
    this.element.releasePointerCapture(pointerId);
    return this;
  }

  /**
   *
   * @returns {Document}
   */
  get ownerDocument() {
    return this.element.ownerDocument;
  }

  /**
   *
   * @returns {string}
   */
  get tagName() {
    return this.element.tagName;
  }

  /**
   *
   * @returns {XULElement?}
   */
  get parentElement() {
    return this.element.parentElement
      ? new XULElement({ element: this.element.parentElement })
      : null;
  }

  /**
   *
   * @returns {number}
   */
  get screenX() {
    return this.element.screenX;
  }

  /**
   *
   * @returns {number}
   */
  get screenY() {
    return this.element.screenY;
  }

  /**
   * @returns {XULElement}
   */
  remove() {
    this.element.remove();
    return this;
  }
}
