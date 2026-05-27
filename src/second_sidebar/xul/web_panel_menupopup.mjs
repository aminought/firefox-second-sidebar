import { L } from "../i18n/index.mjs";
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

    this.unloadItem = new MenuItem().setLabel(L.webPanelMenu.unload);
    this.muteItem = new MenuItem();
    this.resetMenu = new Menu().setLabel(L.webPanelMenu.reset);
    this.resetMenuPopup = new MenuPopup();
    this.resetPositionItem = new MenuItem().setLabel(L.webPanelMenu.resetPosition);
    this.resetWidthItem = new MenuItem().setLabel(L.webPanelMenu.resetWidth);
    this.resetHeightItem = new MenuItem().setLabel(L.webPanelMenu.resetHeight);
    this.resetAllItem = new MenuItem().setLabel(L.webPanelMenu.resetAll);
    this.editItem = new MenuItem().setLabel(L.webPanelMenu.edit);
    this.deleteItem = new MenuItem().setLabel(L.webPanelMenu.delete);
    this.customizeItem = new MenuItem().setLabel(L.webPanelMenu.customize);
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
          this.webPanelController.isMuted() ? L.webPanelMenu.unmute : L.webPanelMenu.mute,
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
