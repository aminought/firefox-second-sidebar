import { Menu } from "./base/menu.mjs";
import { MenuItem } from "./base/menuitem.mjs";
import { MenuPopup } from "./base/menupopup.mjs";
import { MenuSeparator } from "./base/menuseparator.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { WebPanelController } from "../controllers/web_panel.mjs"; // eslint-disable-line no-unused-vars

export class WebPanelMenuPopup extends MenuPopup {
  constructor() {
    super({
      id: "sb2-web-panel-button-menupopup",
      classList: ["sb2-menupopup"],
    });

    this.unloadItem = new MenuItem().setLabel("Unload web panel");
    this.muteItem = new MenuItem();
    this.resetMenu = new Menu().setLabel("Reset web panel");
    this.resetMenuPopup = new MenuPopup();
    this.resetPositionItem = new MenuItem().setLabel("Reset position");
    this.resetWidthItem = new MenuItem().setLabel("Reset width");
    this.resetHeightItem = new MenuItem().setLabel("Reset height");
    this.resetAllItem = new MenuItem().setLabel("Reset all");
    this.editItem = new MenuItem().setLabel("Edit web panel");
    this.deleteItem = new MenuItem().setLabel("Delete web panel");
    this.customizeItem = new MenuItem().setLabel("Customize Toolbar...");
    this.#compose();

    this.addEventListener("popupshowing", () => {
      this.webPanelController = SidebarControllers.webPanelsController.get(
        this.element.triggerNode.id,
      );

      if (!this.webPanelController) {
        this.unloadItem.setDisabled(true);
        this.muteItem.setDisabled(true);
        this.resetMenu.setDisabled(true);
        this.editItem.setDisabled(true);
        this.deleteItem.setDisabled(true);
        return;
      }

      // unloading
      this.unloadItem.setDisabled(this.webPanelController.isUnloaded());
      // muting
      if (this.webPanelController.isUnloaded()) {
        this.muteItem.hide();
      } else {
        this.muteItem.show();
        this.muteItem.setLabel(
          `${this.webPanelController.isMuted() ? "Unmute" : "Mute"} web panel`,
        );
      }
      // resetting
      const activeWebPanelController =
        SidebarControllers.webPanelsController.getActive();
      const sidebarClosed = SidebarControllers.sidebarController.closed();
      const webPanelMismatch =
        !activeWebPanelController ||
        this.webPanelController.getUUID() !==
          activeWebPanelController.getUUID();
      const webPanelPinned = this.webPanelController.pinned();
      this.resetMenu.setDisabled(
        sidebarClosed || webPanelMismatch || webPanelPinned,
      );
    });
  }

  #compose() {
    this.appendChildren(
      this.unloadItem,
      this.muteItem,
      new MenuSeparator(),
      this.resetMenu.appendChild(
        this.resetMenuPopup.appendChildren(
          this.resetPositionItem,
          this.resetWidthItem,
          this.resetHeightItem,
          new MenuSeparator(),
          this.resetAllItem,
        ),
      ),
      this.editItem,
      this.deleteItem,
      new MenuSeparator(),
      this.customizeItem,
    );
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenUnloadItemClick(callback) {
    this.unloadItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenMuteItemClick(callback) {
    this.muteItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenResetPositionItemClick(callback) {
    this.resetPositionItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenResetWidthItemClick(callback) {
    this.resetWidthItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenResetHeightItemClick(callback) {
    this.resetHeightItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenResetAllItemClick(callback) {
    this.resetAllItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenEditItemClick(callback) {
    this.editItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenDeleteItemClick(callback) {
    this.deleteItem.addEventListener("command", () => {
      callback(this.webPanelController);
    });
  }

  /**
   *
   * @param {function(WebPanelController):void} callback
   */
  listenCustomizeItemClick(callback) {
    this.customizeItem.addEventListener("command", (event) => {
      callback(event);
    });
  }
}
