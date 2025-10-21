import { WindowManagerWrapper } from "../wrappers/window_manager.mjs";
import { WindowWatcherWrapper } from "../wrappers/window_watcher.mjs";
import { WindowWrapper } from "../wrappers/window.mjs";

export const WebPanelEvents = {
  EDIT_WEB_PANEL_URL: "edit_web_panel_url",
  EDIT_WEB_PANEL_TITLE: "edit_web_panel_title",
  EDIT_WEB_PANEL_FAVICON_URL: "edit_web_panel_favicon_url",
  EDIT_WEB_PANEL_PINNED: "edit_web_panel_pinned",
  EDIT_WEB_PANEL_USER_CONTEXT_ID: "edit_web_panel_user_context_id",
  EDIT_WEB_PANEL_ALWAYS_ON_TOP: "edit_web_panel_always_on_top",
  EDIT_WEB_PANEL_MOBILE: "edit_web_panel_mobile",
  EDIT_WEB_PANEL_LOAD_ON_STARTUP: "edit_web_panel_load_on_startup",
  EDIT_WEB_PANEL_LOAD_LAST_URL: "edit_web_panel_load_last_url",
  EDIT_WEB_PANEL_UNLOAD_ON_CLOSE: "edit_web_panel_unload_on_close",
  EDIT_WEB_PANEL_HIDE_TOOLBAR: "edit_web_panel_hide_toolbar",
  EDIT_WEB_PANEL_HIDE_SOUND_ICON: "edit_web_panel_hide_sound_icon",
  EDIT_WEB_PANEL_HIDE_NOTIFICATION_BADGE:
    "edit_web_panel_hide_notification_badge",
  EDIT_WEB_PANEL_PERIODIC_RELOAD: "edit_web_panel_periodic_reload",
  EDIT_WEB_PANEL_ZOOM_OUT: "edit_web_panel_zoom_out",
  EDIT_WEB_PANEL_ZOOM_IN: "edit_web_panel_zoom_in",
  EDIT_WEB_PANEL_ZOOM: "edit_web_panel_zoom",
  EDIT_WEB_PANEL_SELECTOR_ENABLED: "edit_web_panel_selector_enabled",
  EDIT_WEB_PANEL_SELECTOR: "edit_web_panel_selector",
  EDIT_WEB_PANEL_ANCHOR: "edit_web_panel_anchor",
  EDIT_WEB_PANEL_OFFSET_X_TYPE: "edit_web_panel_offset_x_type",
  EDIT_WEB_PANEL_OFFSET_Y_TYPE: "edit_web_panel_offset_y_type",
  EDIT_WEB_PANEL_WIDTH_TYPE: "edit_web_panel_width_type",
  EDIT_WEB_PANEL_HEIGHT_TYPE: "edit_web_panel_height_type",
  EDIT_WEB_PANEL_SHORTCUT_ENABLED: "edit_web_panel_shortcut_enabled",
  EDIT_WEB_PANEL_SHORTCUT: "edit_web_panel_shortcut",
  CREATE_WEB_PANEL: "create_web_panel",
  DELETE_WEB_PANEL: "delete_web_panel",
};

export const SidebarEvents = {
  EDIT_SIDEBAR_POSITION: "edit_sidebar_position",
  EDIT_SIDEBAR_PADDING: "edit_sidebar_padding",
  EDIT_SIDEBAR_NEW_WEB_PANEL_POSITION: "edit_sidebar_new_web_panel_position",
  EDIT_SIDEBAR_DEFAULT_FLOATING_OFFSET: "edit_sidebar_floating_padding",
  EDIT_SIDEBAR_AUTO_HIDE_BACK_BUTTON: "edit_sidebar_auto_hide_back_button",
  EDIT_SIDEBAR_AUTO_HIDE_FORWARD_BUTTON:
    "edit_sidebar_auto_hide_forward_button",
  EDIT_SIDEBAR_CONTAINER_BORDER: "edit_sidebar_container_border",
  EDIT_SIDEBAR_TOOLTIP: "edit_sidebar_tooltip",
  EDIT_SIDEBAR_TOOLTIP_FULL_URL: "edit_sidebar_tooltip_full_url",
  EDIT_SIDEBAR_VISIBILITY: "edit_sidebar_visibility",
  EDIT_SIDEBAR_AUTO_HIDE_ANIMATED: "edit_sidebar_auto_hide_animated",
  EDIT_SIDEBAR_TOOLBAR_AUTO_HIDE_ANIMATED:
    "edit_sidebar_toolbar_auto_hide_animated",
  EDIT_SIDEBAR_ENABLE_BOX_HINT: "edit_sidebar_enable_box_hint",
  EDIT_SIDEBAR_PINNED_GEOMETRY: "edit_sidebar_pinned_geometry",
  EDIT_SIDEBAR_FLOATING_GEOMETRY: "edit_sidebar_floating_geometry",
  RESET_SIDEBAR_FLOATING_POSITION: "reset_sidebar_floating_position",
  RESET_SIDEBAR_FLOATING_WIDTH: "reset_sidebar_floating_width",
  RESET_SIDEBAR_FLOATING_HEIGHT: "reset_sidebar_floating_height",
  RESET_SIDEBAR_FLOATING_ALL: "reset_sidebar_floating_all",
};

/**
 *
 * @param {string} type
 * @param {object} detail
 */
export const sendEvent = (type, detail = {}) => {
  const window = new WindowWrapper();
  const lastWindow = WindowManagerWrapper.getMostRecentBrowserWindow();
  const customEvent = new CustomEvent(type, {
    detail: {
      ...detail,
      isActiveWindow: WindowWrapper.isEqual(window, lastWindow),
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
