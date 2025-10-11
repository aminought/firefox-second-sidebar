import { BrowserElements } from "../browser_elements.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";

export class WebPanelsShortcuts {
  constructor() {
    this.enabled = true;
    this.#setupListeners();
  }

  #setupListeners() {
    BrowserElements.root.addEventListener("keypress", (event) => {
      if (!this.enabled) return;

      const webPanelControllers =
        SidebarControllers.webPanelsController.getAll();

      for (const webPanelController of webPanelControllers) {
        const shortcut = webPanelController.getShortcut();

        if (shortcut.length === 0) continue;

        const shortcutParts = this.getShortcutPartsFromShortcut(shortcut);
        const eventParts = this.getShortcutPartsFromEvent(event);

        if (
          JSON.stringify(shortcutParts.sort()) ==
          JSON.stringify(eventParts.sort())
        ) {
          event.preventDefault();
          webPanelController.switchWebPanel();
          break;
        }
      }
    });
  }

  enable() {
    this.enabled = true;
    console.log("WebPanelsShortcuts enabled");
  }

  disable() {
    this.enabled = false;
    console.log("WebPanelsShortcuts disabled");
  }

  /**
   *
   * @param {string} uuid
   * @param {string} shortcut
   * @returns {boolean}
   */
  isShortcutBusy(uuid, shortcut) {
    const webPanelControllers = SidebarControllers.webPanelsController.getAll();
    return webPanelControllers.some(
      (webPanelController) =>
        webPanelController.getUUID() !== uuid &&
        webPanelController.getShortcut() === shortcut,
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
    parts.push(event.key.toUpperCase());
    return parts;
  }

  /**
   *
   * @param {string} shortcut
   * @returns {string[]}
   */
  getShortcutPartsFromShortcut(shortcut) {
    return shortcut.split("+");
  }
}
