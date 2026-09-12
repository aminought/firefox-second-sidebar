import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { getLayoutIndependentKey } from "../utils/keyboard.mjs";

export class Shortcuts {
  constructor() {
    this.enabled = true;
    this.#setupListeners();
  }

  #setupListeners() {
    BrowserElements.root.addEventListener("keypress", (event) => {
      if (!this.enabled) return;
      if (this.trySidebarWidgetShortcut(event)) return;
      if (this.tryLastWebPanelShortcut(event)) return;
      this.tryWebPanelShortcuts(event);
    });
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  tryLastWebPanelShortcut(event) {
    const shortcut = SidebarControllers.sidebarController.lastWebPanelShortcut;
    if (shortcut.length === 0) return false;

    if (this.isShortcutPressed(shortcut, event)) {
      event.preventDefault();
      SidebarControllers.webPanelsController.switchLastWebPanel();
      return true;
    }
    return false;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  trySidebarWidgetShortcut(event) {
    const shortcut = SidebarControllers.sidebarController.sidebarWidgetShortcut;
    if (shortcut.length === 0) return false;

    if (this.isShortcutPressed(shortcut, event)) {
      event.preventDefault();
      SidebarControllers.sidebarMainCollapser.onSidebarCollapseButtonClick();
      return true;
    }
    return false;
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  tryWebPanelShortcuts(event) {
    const webPanelControllers = SidebarControllers.webPanelsController.getAll();
    for (const webPanelController of webPanelControllers) {
      const shortcut = webPanelController.getShortcut();
      if (shortcut.length === 0) continue;

      if (this.isShortcutPressed(shortcut, event)) {
        event.preventDefault();
        webPanelController.switchWebPanel();
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @param {string} shortcut
   * @param {KeyboardEvent?} event
   * @returns {boolean}
   */
  isSidebarWidgetShortcutBusy(shortcut, event = null) {
    const webPanelControllers = SidebarControllers.webPanelsController.getAll();
    return (
      webPanelControllers.some((webPanelController) =>
        this.#isShortcutBusy(webPanelController.getShortcut(), shortcut, event),
      ) ||
      this.#isShortcutBusy(
        SidebarControllers.sidebarController.lastWebPanelShortcut,
        shortcut,
        event,
      )
    );
  }

  /**
   *
   * @param {string} shortcut
   * @param {KeyboardEvent?} event
   * @returns {boolean}
   */
  isLastWebPanelShortcutBusy(shortcut, event = null) {
    const webPanelControllers = SidebarControllers.webPanelsController.getAll();
    return (
      webPanelControllers.some((webPanelController) =>
        this.#isShortcutBusy(webPanelController.getShortcut(), shortcut, event),
      ) ||
      this.#isShortcutBusy(
        SidebarControllers.sidebarController.sidebarWidgetShortcut,
        shortcut,
        event,
      )
    );
  }

  /**
   *
   * @param {string} uuid
   * @param {string} shortcut
   * @param {KeyboardEvent?} event
   * @returns {boolean}
   */
  isWebPanelShortcutBusy(uuid, shortcut, event = null) {
    const webPanelControllers = SidebarControllers.webPanelsController.getAll();
    return (
      webPanelControllers.some(
        (webPanelController) =>
          webPanelController.getUUID() !== uuid &&
          this.#isShortcutBusy(
            webPanelController.getShortcut(),
            shortcut,
            event,
          ),
      ) ||
      this.#isShortcutBusy(
        SidebarControllers.sidebarController.sidebarWidgetShortcut,
        shortcut,
        event,
      ) ||
      this.#isShortcutBusy(
        SidebarControllers.sidebarController.lastWebPanelShortcut,
        shortcut,
        event,
      )
    );
  }

  /**
   *
   * @param {string} assignedShortcut
   * @param {string} shortcut
   * @param {KeyboardEvent?} event
   * @returns {boolean}
   */
  #isShortcutBusy(assignedShortcut, shortcut, event) {
    return (
      assignedShortcut === shortcut ||
      (event !== null && this.isShortcutPressed(assignedShortcut, event))
    );
  }

  /**
   *
   * @param {string} shortcut
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  isShortcutPressed(shortcut, event) {
    if (shortcut.length === 0) return false;
    const shortcutParts = this.getShortcutPartsFromShortcut(shortcut);
    const eventParts = this.getShortcutPartsFromEvent(event);
    const layoutDependentEventParts =
      this.#getLayoutDependentShortcutPartsFromEvent(event);
    return (
      this.isEqual(shortcutParts, eventParts) ||
      this.isEqual(shortcutParts, layoutDependentEventParts)
    );
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @returns {string[]}
   */
  getShortcutPartsFromEvent(event) {
    const parts = [];
    if (event.altKey) parts.push("Alt");
    if (event.ctrlKey) parts.push("Ctrl");
    if (event.metaKey) parts.push("Meta");
    if (event.shiftKey) parts.push("Shift");
    parts.push(getLayoutIndependentKey(event));
    return parts;
  }

  /**
   * Keeps shortcuts saved with a layout-dependent key working in that layout.
   *
   * @param {KeyboardEvent} event
   * @returns {string[]}
   */
  #getLayoutDependentShortcutPartsFromEvent(event) {
    const parts = this.getShortcutPartsFromEvent(event);
    parts[parts.length - 1] = event.key.toUpperCase();
    return parts;
  }

  /**
   *
   * @param {string} shortcut
   * @returns {string[]}
   */
  getShortcutPartsFromShortcut(shortcut) {
    const parts = shortcut.split("+");
    // "+" is both the separator and a valid key label.
    const lastIndex = parts.length - 1;
    if (parts[lastIndex] === "" && parts[lastIndex - 1] === "") {
      parts.splice(-2, 2, "+");
    }
    return parts;
  }

  /**
   *
   * @param {string[]} lhs
   * @param {string[]} rhs
   * @returns {boolean}
   */
  isEqual(lhs, rhs) {
    return JSON.stringify([...lhs].sort()) === JSON.stringify([...rhs].sort());
  }
}
