const dontHasCustomizationShown = /* css */ `:not(:has(~ #customization-container[hidden="false"]))`;
const hasFloatingSidebar = /* css */ `:has(#sb2[floating-sidebar="true"])`;

export const SIDEBAR_MAIN_CSS = /* css */ `
  #sb2-main {
    display: flex;
    flex-direction: column;
    justify-content: var(--sb2-main-web-panel-buttons-position);
    gap: var(--space-small);
    padding: 0 var(--sb2-main-padding) var(--space-small) var(--sb2-main-padding);
    overflow-y: scroll;
    scrollbar-width: none;
    background-color: transparent;

    toolbarpaletteitem[place="panel"][id^="wrapper-customizableui-special-spring"], toolbarspring {
      flex: 1;
      min-height: unset;
      max-height: unset;
      min-width: unset;
      max-width: unset;
      flex-grow: 1;
      flex-shrink: 1;
    }

    .toolbaritem-combined-buttons {
      justify-content: center;
      margin-inline: 0;
    }

    .toolbarbutton-1 {
      padding: 0 !important;
    }
  }

  #sb2-main[fullscreenShouldAnimate] {
    transition: 0.8s margin-right ease-out, 0.8s margin-left ease-out;
  }

  #sb2-main[shouldAnimate] {
    transition: 0.2s margin-right ease-out, 0.2s margin-left ease-out;
  }

  #browser:has(#sb2-box:not([hidden])), 
  #browser:has(#sb2-main toolbarbutton[open]),
  #main-window:has(#sb2-main-popup-settings[panelopen]),
  #main-window:has(#sb2-main-menupopup[panelopen]),
  #main-window:has(#sb2-web-panel-button-menupopup[panelopen]) {
    #sb2-main {
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
  }

  :root[customizing] {
    #sb2-main {
      min-width: unset !important;
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
  }

  #browser:has(#sb2[position="right"]) #sb2-main {
    order: 17 !important;
  }

  #browser:has(#sb2[position="left"]) #sb2-main {
    order: -3 !important;
  }

  #zen-main-app-wrapper${dontHasCustomizationShown}${hasFloatingSidebar} #sb2-main {
    position: fixed;
    top: 32px;
    bottom: 32px;
    z-index: 99;
    background-color: var(--sidebar-background-color);
    box-shadow: var(--zen-big-shadow);
    outline: 1px solid var(--zen-colors-border-contrast);
    outline-offset: -1px;
    -moz-window-dragging: no-drag;
    
    transition: transform 0.2s 0.35s ease-in-out, opacity 0.1s 0.35s linear;
    opacity: 0;
    margin: 0;
    padding-top: var(--space-small);
    padding-bottom: var(--space-small);
  }

  #zen-main-app-wrapper${dontHasCustomizationShown}:has(#sb2[position="right"])${hasFloatingSidebar} #sb2-main {
    right: -1px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;

    transform: translateX(calc(100% - 4px));
  }

  #zen-main-app-wrapper${dontHasCustomizationShown}:has(#sb2[position="left"])${hasFloatingSidebar} #sb2-main {
    left: -1px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    transform: translateX(calc(-100% + 4px));
  }

  #zen-main-app-wrapper${dontHasCustomizationShown}:has(#sb2[floating-sidebar="true"]:not([type="split"])):has(#sb2-box:not([hidden="true"])) #sb2-main,
  #zen-main-app-wrapper${dontHasCustomizationShown}${hasFloatingSidebar} #sb2-main:hover,
  #zen-main-app-wrapper${dontHasCustomizationShown}${hasFloatingSidebar} #sb2-main:focus-within {
    transform: translateX(0) !important;
    transition: transform 0.2s ease-in-out, opacity 0.1s linear;
    opacity: 1;
  }

  .sb2-main-button {
    position: relative;
    padding: 0;

    .sb2-sound-icon {
      position: relative;
      display: none;
      height: 16px;
      width: 16px;
      top: calc(var(--toolbarbutton-inner-padding) + 2px);
      right: calc(-1 * var(--toolbarbutton-inner-padding) - 2px);
      padding: 2px;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: var(--border-radius-circle);
      background-color: color-mix(in srgb, var(--toolbar-bgcolor) 50%, transparent);
      fill: var(--toolbar-color);

      &[soundplaying] {
        display: flex;
        background-image: url("chrome://browser/skin/tabbrowser/tab-audio-playing-small.svg");
      }

      &[muted] {
        display: flex;
        background-image: url("chrome://browser/skin/tabbrowser/tab-audio-muted-small.svg");
      }

      &[hidden] {
        display: none;
      }
    }

    .sb2-notification-badge {
      display: none;
      position: relative;
      justify-content: center;
      align-items: center;
      width: 16px;
      height: 16px;
      top: calc(-1 * var(--toolbarbutton-inner-padding) - 2px);
      right: calc(-1 * var(--toolbarbutton-inner-padding) - 2px);
      border-radius: var(--border-radius-circle);
      background-color: color-mix(in srgb, var(--toolbar-bgcolor) 50%, transparent);

      &[value] {
        display: flex;
      }

      &[hidden] {
        display: none;
      }

      span {
        color: var(--toolbar-color);
      }
    }
  }

  .sb2-main-button[unloaded="true"] {
    .toolbarbutton-icon {
      opacity: var(--toolbarbutton-disabled-opacity);
    }
  }

  #widget-overflow-fixed-list .sb2-main-button {
    padding: var(--arrowpanel-menuitem-padding);
  }

  #sb2-collapse-button[position="left"] {
    list-style-image: url("chrome://userscripts/content/second_sidebar/icons/sidebar-left.svg");
  }

  #sb2-collapse-button[position="right"] {
    list-style-image: url("chrome://userscripts/content/second_sidebar/icons/sidebar-right.svg");
  }
`;
