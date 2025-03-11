import { WindowManagerWrapper } from "../wrappers/window_manager.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";

export const WebPanelEvents = {
  EDIT_WEB_PANEL_URL: "edit_web_panel_url",
  EDIT_WEB_PANEL_FAVICON_URL: "edit_web_panel_favicon_url",
  EDIT_WEB_PANEL_PINNED: "edit_web_panel_pinned",
  EDIT_WEB_PANEL_USER_CONTEXT_ID: "edit_web_panel_user_context_id",
  EDIT_WEB_PANEL_MOBILE: "edit_web_panel_mobile",
  EDIT_WEB_PANEL_LOAD_ON_STARTUP: "edit_web_panel_load_on_startup",
  EDIT_WEB_PANEL_UNLOAD_ON_CLOSE: "edit_web_panel_unload_on_close",
  EDIT_WEB_PANEL_HIDE_TOOLBAR: "edit_web_panel_hide_toolbar",
  EDIT_WEB_PANEL_HIDE_SOUND_ICON: "edit_web_panel_hide_sound_icon",
  EDIT_WEB_PANEL_HIDE_NOTIFICATION_BADGE:
    "edit_web_panel_hide_notification_badge",
  EDIT_WEB_PANEL_PERIODIC_RELOAD: "edit_web_panel_periodic_reload",
  EDIT_WEB_PANEL_ZOOM_OUT: "edit_web_panel_zoom_out",
  EDIT_WEB_PANEL_ZOOM_IN: "edit_web_panel_zoom_in",
  EDIT_WEB_PANEL_ZOOM: "edit_web_panel_zoom",
  CREATE_WEB_PANEL: "create_web_panel",
  SWITCH_WEB_PANEL: "switch_web_panel",
  DELETE_WEB_PANEL: "delete_web_panel",
  SAVE_WEB_PANELS: "save_web_panels",
  OPEN_NEW_WEB_PANEL_POPUP: "open_new_web_panel_popup",
};

export const SidebarEvents = {
  EDIT_SIDEBAR_POSITION: "edit_sidebar_position",
  EDIT_SIDEBAR_PADDING: "edit_sidebar_padding",
  EDIT_SIDEBAR_NEW_WEB_PANEL_POSITION: "edit_sidebar_new_web_panel_position",
  EDIT_SIDEBAR_UNPINNED_PADDING: "edit_sidebar_unpinned_padding",
  EDIT_SIDEBAR_HIDE_IN_POPUP_WINDOWS: "edit_sidebar_hide_in_popup_windows",
  EDIT_SIDEBAR_AUTO_HIDE_BACK_BUTTON: "edit_sidebar_auto_hide_back_button",
  EDIT_SIDEBAR_AUTO_HIDE_FORWARD_BUTTON:
    "edit_sidebar_auto_hide_forward_button",
  EDIT_SIDEBAR_CONTAINER_BORDER: "edit_sidebar_container_border",
  EDIT_SIDEBAR_AUTO_HIDE: "edit_sidebar_auto_hide",
  EDIT_SIDEBAR_AUTO_HIDE_ANIMATED: "edit_sidebar_auto_hide_animated",
  EDIT_SIDEBAR_WIDTH: "edit_sidebar_width",
  SAVE_SIDEBAR: "save_sidebar",
  COLLAPSE_SIDEBAR: "collapse_sidebar",
};

/**
 *
 * @param {string} type
 * @param {object} detail
 */
export const sendEvent = (type, detail = {}) => {
  const lastWindow = WindowManagerWrapper.getMostRecentBrowserWindow();
  const customEvent = new CustomEvent(type, {
    detail: {
      ...detail,
      isActiveWindow: window === lastWindow,
    },
  });
  lastWindow.dispatchEvent(customEvent);
};

/**
 *
 * @param {string} type
 * @param {object} detail
 */
export const sendEvents = (type, detail = {}) => {
  const lastWindow = WindowManagerWrapper.getMostRecentBrowserWindow();
  for (const window of WindowWatcherWrapper.getWindowEnumerator()) {
    const customEvent = new CustomEvent(type, {
      detail: {
        ...detail,
        isActiveWindow: WindowWrapper.isEqual(window, lastWindow),
      },
    });
    window.dispatchEvent(customEvent);
  }
};

/**
 *
 * @param {string} type
 * @param {function(Event):void} callback
 */
export const listenEvent = (type, callback) => {
  new WindowWrapper().addEventListener(type, (event) => {
    console.log(`Got event ${event.type}:`, event.detail);
    callback(event);
  });
};
