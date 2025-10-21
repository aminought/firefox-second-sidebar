export const SIDEBAR_MAIN_CSS = `
  #sb2-main {
    display: flex;
    flex-direction: column;
    justify-content: var(--sb2-main-web-panel-buttons-position);
    gap: var(--space-small);
    top: 0;
    height: 100%;
    padding: 0 var(--sb2-main-padding) var(--space-small) var(--sb2-main-padding);
    overflow-y: scroll;
    scrollbar-width: none;

    &[overlay="true"] {
      position: absolute;
      z-index: 9999;
      background-color: var(--toolbox-bgcolor);
      box-shadow: var(--content-area-shadow);

      @media (-moz-windows-mica) {
        backdrop-filter: blur(32px);
        background-color: light-dark(rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0.6));
      }
    }

    toolbarpaletteitem[place="panel"][id^="wrapper-customizableui-special-spring"], toolbarspring {
      flex: 1;
      min-height: 10px;
      max-height: 112px;
      min-width: unset;
      max-width: unset;
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

  :root[customizing] {
    #sb2-main {
      min-width: unset !important;
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
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

  .sb2-main-button[temporary="true"] > stack.toolbarbutton-badge-stack {
    background-color: var(--attention-dot-color) !important;
  }

  .sb2-main-button:not([image]):not([loading]) .toolbarbutton-icon {
    list-style-image: url("chrome://global/skin/icons/security.svg");
  }

  .sb2-main-button[loading] .toolbarbutton-icon {
    list-style-image: url("chrome://global/skin/icons/loading.svg");
  }

  .sb2-main-button[unloaded="true"] {
    .toolbarbutton-icon {
      opacity: var(--toolbarbutton-disabled-opacity);
    }
  }

  #widget-overflow-fixed-list .sb2-main-button {
    padding: var(--arrowpanel-menuitem-padding);
  }

  :root:has(#sb2-wrapper[position="left"]) {
    #sb2-main {
      left: 0;
    }

    #sb2-collapse-button {
      list-style-image: url("chrome://userscripts/content/second_sidebar/icons/sidebar-left.svg");
    }
  }

  :root:has(#sb2-wrapper[position="right"]) {
    #sb2-main {
      right: 0;
    }

    #sb2-collapse-button {
      list-style-image: url("chrome://userscripts/content/second_sidebar/icons/sidebar-right.svg");
    }
  }
`;
