/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { WebPanelController } from "./web_panel.mjs";
import { WebPanelPopupEdit } from "../xul/web_panel_popup_edit.mjs";
import { WebPanelsController } from "./web_panels.mjs";
import { WindowManagerWrapper } from "../wrappers/window_manager.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
/* eslint-enable no-unused-vars */

const Events = {
  EDIT_WEB_PANEL: "edit_web_panel",
};

export class WebPanelEditController {
  /**
   *
   * @param {WebPanelPopupEdit} webPanelPopupEdit
   */
  constructor(webPanelPopupEdit) {
    this.webPanelPopupEdit = webPanelPopupEdit;
    this.#setupListeners();
  }

  /**
   *
   * @param {WebPanelsController} webPanelsController
   * @param {SidebarController} sidebarController
   */
  setupDependencies(webPanelsController, sidebarController) {
    this.webPanelsController = webPanelsController;
    this.sidebarController = sidebarController;
  }

  #setupListeners() {
    this.webPanelPopupEdit.listenChanges({
      url: (uuid, url, timeout = 0) => {
        const webPanelController = this.webPanelsController.get(uuid);
        const oldUrl = webPanelController.getURL();
        webPanelController.setURL(url);

        clearTimeout(this.urlTimeout);
        this.urlTimeout = setTimeout(() => {
          if (!webPanelController.isUnloaded() && oldUrl !== url) {
            webPanelController.go(url);
          }
        }, timeout);
      },
      faviconURL: (uuid, faviconURL, timeout = 0) => {
        const webPanelController = this.webPanelsController.get(uuid);
        const oldFaviconURL = webPanelController.getFaviconURL();
        webPanelController.setWebPanelFaviconURL(faviconURL);

        clearTimeout(this.faviconURLTimeout);
        this.faviconURLTimeout = setTimeout(() => {
          if (oldFaviconURL !== faviconURL) {
            webPanelController.setWebPanelButtonFaviconURL(faviconURL);
          }
        }, timeout);
      },
      pinned: (uuid, pinned) => {
        const webPanelController = this.webPanelsController.get(uuid);
        pinned ? webPanelController.pin() : webPanelController.unpin();
        if (webPanelController.isActive()) {
          pinned
            ? this.sidebarController.pin()
            : this.sidebarController.unpin();
        }
      },
      userContextId: (uuid, userContextId) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setUserContextId(userContextId);
      },
      mobile: (uuid, mobile) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setMobile(mobile);
      },
      loadOnStartup: (uuid, loadOnStartup) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setLoadOnStartup(loadOnStartup);
      },
      unloadOnClose: (uuid, unloadOnClose) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setUnloadOnClose(unloadOnClose);
      },
      hideToolbar: (uuid, hideToolbar) => {
        const webPanelController = this.webPanelsController.get(uuid);
        webPanelController.setHideToolbar(hideToolbar);
        this.sidebarController.setHideToolbar(hideToolbar);
      },
      zoom: (uuid, zoomIn = false, zoomOut = false, value = null) => {
        const webPanelController = this.webPanelsController.get(uuid);
        if (zoomIn) {
          webPanelController.zoomIn();
        } else if (zoomOut) {
          webPanelController.zoomOut();
        } else {
          webPanelController.setZoom(value);
        }
        return webPanelController.getZoom();
      },
    });

    this.webPanelPopupEdit.listenCancelButtonClick(() => this.hidePopup());

    window.addEventListener(Events.EDIT_WEB_PANEL, async (event) => {
      console.log(`Got event ${event.type}:`, event.detail);
      const webPanelController = this.webPanelsController.get(
        event.detail.uuid,
      );

      if (event.detail.isWindowActive) {
        this.webPanelsController.saveSettings();
        this.hidePopup();
      } else {
        webPanelController.setURL(event.detail.url);
        if (!webPanelController.isUnloaded()) {
          webPanelController.go(event.detail.url);
        }

        webPanelController.setWebPanelFaviconURL(event.detail.faviconURL);
        webPanelController.setWebPanelButtonFaviconURL(event.detail.faviconURL);

        event.detail.pinned === "true"
          ? webPanelController.pin()
          : webPanelController.unpin();
        if (webPanelController.isActive()) {
          event.detail.pinned === "true"
            ? this.sidebarController.pin()
            : this.sidebarController.unpin();
        }

        webPanelController.setUserContextId(event.detail.userContextId);
        webPanelController.setMobile(event.detail.mobile);
        webPanelController.setLoadOnStartup(event.detail.loadOnStartup);
        webPanelController.setUnloadOnClose(event.detail.unloadOnClose);
        webPanelController.setHideToolbar(event.detail.hideToolbar);
        this.sidebarController.setHideToolbar(event.detail.hideToolbar);
        webPanelController.setZoom(event.detail.zoomValue);
      }

      if (
        webPanelController.getUnloadOnClose() &&
        !webPanelController.isActive()
      ) {
        webPanelController.unload();
      }
    });

    this.webPanelPopupEdit.listenSaveButtonClick(
      (
        uuid,
        url,
        faviconURL,
        pinned,
        userContextId,
        mobile,
        loadOnStartup,
        unloadOnClose,
        hideToolbar,
        zoomValue,
      ) => {
        const lastWindow = WindowManagerWrapper.getMostRecentBrowserWindow();
        for (const window of WindowWatcherWrapper.getWindowEnumerator()) {
          const customEvent = new CustomEvent(Events.EDIT_WEB_PANEL, {
            detail: {
              uuid,
              url,
              faviconURL,
              pinned,
              userContextId,
              mobile,
              loadOnStartup,
              unloadOnClose,
              hideToolbar,
              zoomValue,
              isWindowActive: window === lastWindow,
            },
          });
          window.dispatchEvent(customEvent);
        }
      },
    );
  }

  /**
   *
   * @param {WebPanelController} webPanelController
   */
  openPopup(webPanelController) {
    this.webPanelPopupEdit.openPopup(webPanelController);
  }

  hidePopup() {
    this.webPanelPopupEdit.hidePopup();
  }
}
