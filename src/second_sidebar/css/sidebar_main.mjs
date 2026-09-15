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
      background-color: var(--toolbox-background-color, var(--toolbox-bgcolor));
      box-shadow: var(--content-area-shadow);

      @media (-moz-windows-mica) {
        /* The toolbox color can be translucent with Mica. Paint it over the
           same opaque fallback Firefox uses for its expanding sidebar. */
        background-color: light-dark(#e8e8e8, #202020);
        background-image: image(var(--toolbox-background-color, var(--toolbox-bgcolor)));
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
      top: calc(var(--toolbarbutton-inner-padding, var(--toolbarbutton-padding-inner)) + 2px);
      right: calc(-1 * var(--toolbarbutton-inner-padding, var(--toolbarbutton-padding-inner)) - 2px);
      padding: 2px;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: var(--border-radius-circle);
      background-color: color-mix(in srgb, var(--toolbar-bgcolor, var(--toolbar-background-color)) 50%, transparent);
      fill: var(--toolbar-color, var(--toolbar-text-color));

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
      top: calc(-1 * var(--toolbarbutton-inner-padding, var(--toolbarbutton-padding-inner)) - 2px);
      right: calc(-1 * var(--toolbarbutton-inner-padding, var(--toolbarbutton-padding-inner)) - 2px);
      border-radius: var(--border-radius-circle);
      background-color: color-mix(in srgb, var(--toolbar-bgcolor, var(--toolbar-background-color)) 50%, transparent);

      &[value] {
        display: flex;
      }

      &[hidden] {
        display: none;
      }

      span {
        color: var(--toolbar-color, var(--toolbar-text-color));
      }
    }
  }

  /* Keep the active web panel visually in sync with Firefox's selected tab.
     The ID raises specificity above the native toolbarbutton [open] rule. */
  #sb2-main .sb2-main-web-panel-button[open] > .toolbarbutton-badge-stack {
    background-color: var(
      --tab-background-color-selected,
      var(--toolbarbutton-background-color-active)
    );
    box-shadow: var(--tab-box-shadow-selected, none);
  }

  .sb2-main-button[temporary="true"] > stack.toolbarbutton-badge-stack {
    background-color: var(
      --attention-dot-color,
      var(--button-attention-dot-color, var(--color-accent-attention, AccentColor))
    ) !important;
  }

  .sb2-main-button:not([image]):not([loading]) .toolbarbutton-icon {
    list-style-image: url("chrome://global/skin/icons/security.svg");
  }

  .sb2-main-button[loading] .toolbarbutton-icon {
    list-style-image: url("chrome://global/skin/icons/loading.svg");
  }

  .sb2-main-button[unloaded="true"] {
    .toolbarbutton-icon {
      opacity: var(--toolbarbutton-disabled-opacity, var(--toolbarbutton-opacity-disabled));
    }
  }

  #widget-overflow-fixed-list .sb2-main-button {
    padding: var(--panel-menuitem-padding, var(--arrowpanel-menuitem-padding));
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

  @media -moz-pref("browser.nova.enabled") {
    #sb2-main {
      box-sizing: border-box;
      border: var(--sb2-nova-card-border-width) solid var(--sb2-nova-border-color);
      border-radius: var(--sb2-nova-connected-radius);

      /* Negative margins collapse the layout box, but chrome-block paint can
         still extend past it as a border or shadow. Stop painting only after
         the slide-out transition has completed. */
      &[sb2-collapsed] {
        visibility: hidden;
      }

      &[overlay="true"] {
        color: var(--toolbox-text-color, var(--toolbar-text-color));
        background-color: light-dark(#e8e8e8, #202020);
        background-image:
          var(--toolbox-background-gradient, image(transparent)),
          image(var(--toolbox-background-color, var(--toolbox-bgcolor)));
        background-size: 100vw 100vh, auto;
        border-width: var(--border-width, 1px);
        border-radius: var(--sb2-nova-radius);

        :root[sb2-nova-card-layout] & {
          background-color: var(--toolbox-background-color, var(--toolbox-bgcolor));
          background-image: none;
          background-size: auto;
        }

        :root[sb2-nova-card-layout][lwtheme] &:-moz-window-inactive {
          color: var(--toolbox-text-color-inactive, var(--toolbox-text-color));
          background-color: var(
            --toolbox-background-color-inactive,
            var(--toolbox-background-color, var(--toolbox-bgcolor))
          );
        }
      }

      /* Firefox's Stable card layout uses the toolbar surface for built-in
         themes in both the persistent and expanding launcher states. */
      :root[sb2-nova-card-layout]:not([lwtheme]) & {
        color: var(--sb2-nova-sidebar-text-color);
        background-color: var(--sb2-nova-sidebar-surface-color);
      }

      @media (-moz-platform: linux) {
        :root:not([sb2-nova-card-layout], [lwtheme]) & {
          color: var(--toolbox-text-color, -moz-headerbartext);
          background-color: var(--toolbox-background-color, -moz-headerbar);
        }
      }
    }

    /* Nova's selected tab is a filled surface with an accent border. Matching
       both layers keeps the active panel visible even when Mica is enabled. */
    #sb2-main .sb2-main-web-panel-button[open] > .toolbarbutton-badge-stack {
      box-sizing: border-box;
      border: var(--border-width, 1px) solid transparent;
      padding: calc(
        var(--toolbarbutton-inner-padding, var(--toolbarbutton-padding-inner)) -
          var(--border-width, 1px)
      );
      background:
        var(--tab-border-color-accent, transparent) border-box border-area,
        var(
            --tab-background-color-selected,
            var(--toolbarbutton-background-color-active)
          )
          padding-box;
    }

    #sb2-wrapper[position="left"] #sb2-main[overlay="true"] {
      background-position-x: 0%;
    }

    #sb2-wrapper[position="right"] #sb2-main[overlay="true"] {
      background-position-x: 100%;
    }

    @media (-moz-platform: linux) {
      /* Firefox's connected Nova layout has no native #browser gap. Preserve
         separation from the adjacent panel or content on Linux. */
      :root:not([sb2-nova-card-layout])
        #sb2-wrapper[position="left"]
        #sb2-main {
        margin-right: var(--space-xsmall, 4px);
      }

      :root:not([sb2-nova-card-layout])
        #sb2-wrapper[position="right"]
        #sb2-main {
        margin-left: var(--space-xsmall, 4px);
      }
    }

    :root[sizemode="maximized"] {
      #sb2-main {
        border-end-start-radius: 0;
        border-end-end-radius: 0;
        border-block-end-width: 0;
      }

      #sb2-wrapper[position="left"] #sb2-main {
        border-start-start-radius: 0;
        border-inline-start-width: 0;
      }

      #sb2-wrapper[position="right"] #sb2-main {
        border-start-end-radius: 0;
        border-inline-end-width: 0;
      }
    }

    /* Firefox 155 keeps the card model in compact density even though its
       window-gap token is zero. Preserve the one content-facing top corner. */
    :root[uidensity="compact"] #sb2-wrapper[position="left"] #sb2-main {
      border-start-end-radius: var(--sb2-nova-card-radius);
    }

    :root[uidensity="compact"] #sb2-wrapper[position="right"] #sb2-main {
      border-start-start-radius: var(--sb2-nova-card-radius);
    }

    :root:is([inFullscreen], [inDOMFullscreen], [fullscreenNavToolboxHidden]) #sb2-main {
      border: none;
      border-radius: 0;
    }
  }
`;
