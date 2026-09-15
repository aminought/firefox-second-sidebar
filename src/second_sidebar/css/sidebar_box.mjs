export const SIDEBAR_BOX_CSS = `
  #browser:has(#sb2-box[hidden="true"]) {
    #sb2-box-area {
      display: contents;
    }
  }

  #browser:has(#sb2-box[pinned="true"]) {
    #sb2-box-area {
      display: contents;
    }
  }

  #browser:has(#sb2-box[pinned="false"]) {
    #sb2-box-area {
      position: absolute;
    }
  }

  #sb2-box {
    --sb2-box-top-left-radius: var(--border-radius-medium);
    --sb2-box-top-right-radius: var(--border-radius-medium);
    --sb2-box-bottom-right-radius: var(--border-radius-medium);
    --sb2-box-bottom-left-radius: var(--border-radius-medium);

    background-color: var(--sidebar-background-color);
    color: var(--sidebar-text-color);
    border-radius:
      var(--sb2-box-top-left-radius)
      var(--sb2-box-top-right-radius)
      var(--sb2-box-bottom-right-radius)
      var(--sb2-box-bottom-left-radius);
    box-shadow: var(--content-area-shadow);
    border: 0.5px solid var(--sidebar-border-color);
    overflow: hidden;
    min-width: 200px;
    min-height: 200px;
    width: 400px;
    height: 100%;
    box-sizing: border-box;

    &[pinned="true"] {
      position: relative;
      top: unset !important;
      left: unset !important;
      right: unset !important;
      bottom: unset !important;
      margin-top: unset !important;
      margin-left: unset !important;
      margin-right: unset !important;
      margin-bottom: unset !important;
      height: 100% !important;

      #sb2-toolbar-title-wrapper {
        cursor: auto !important;
      }
    }

    &[pinned="false"] {
      position: absolute;
      z-index: 20;
    }

    #sb2-toolbar {
      background-color: inherit;
      color: inherit;
      flex-direction: row;
      flex: 1;
      min-height: calc(2 * var(--toolbarbutton-inner-padding, var(--toolbarbutton-padding-inner)) + 16px);
      gap: 4px;
      padding: 1px;
      overflow: hidden;
      -moz-window-dragging: no-drag;

      &[shouldAnimate="true"] {
        transition: 0.2s margin-top ease-out;
      }

      #sb2-toolbar-title-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        overflow: hidden;
        padding: 0 var(--space-medium);
        min-width: 64px;
        cursor: grab;

        #sb2-toolbar-title {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0;
          cursor: inherit;
        }
      }

      #sb2-toolbar-reload {
        position: relative;
      }

      #sb2-toolbar-periodic-reload {
        position: absolute;
        z-index: 1;
        bottom: 1px;
        inset-inline: 0;
        width: max-content;
        min-width: 4ch;
        margin: 0 auto;
        padding: 0 2px;
        border-radius: var(--border-radius-small, 3px);
        background-color: Canvas;
        color: CanvasText;
        box-shadow: 0 0 0 1px color-mix(in srgb, CanvasText 25%, Canvas);
        font-size: 9px;
        line-height: 11px;
        font-variant-numeric: tabular-nums;
        text-align: center;
        white-space: nowrap;
        pointer-events: none;
      }
    }
  }

  #sb2-after-splitter {
    width: var(--space-small);
  }

  #sb2-geometry-hint {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 4px;
    background-color: var(--sidebar-background-color);
    color: var(--sidebar-text-color);
    border-radius: var(--border-radius-medium);
    box-shadow: var(--content-area-shadow);
    border: 1px solid var(--sidebar-border-color);
    font-size: small;
    font-weight: bold;
  }

  @media -moz-pref("browser.nova.enabled") {
    /* Firefox Stable's card-style sidebar uses the toolbar surface rather than
       the legacy opaque sidebar color. Keep only Second Sidebar on that token. */
    :root[sb2-nova-card-layout]:not([lwtheme]) #sb2-box {
      background-color: var(--sb2-nova-sidebar-surface-color);
      color: var(--sb2-nova-sidebar-text-color);
    }

    #sb2-box[pinned="false"] {
      --sb2-box-top-left-radius: var(--sb2-nova-radius);
      --sb2-box-top-right-radius: var(--sb2-nova-radius);
      --sb2-box-bottom-right-radius: var(--sb2-nova-radius);
      --sb2-box-bottom-left-radius: var(--sb2-nova-radius);
    }

    #sb2-box[pinned="true"] {
      --sb2-box-top-left-radius: var(--sb2-nova-radius);
      --sb2-box-top-right-radius: var(--sb2-nova-radius);
      --sb2-box-bottom-right-radius: var(--sb2-nova-connected-radius);
      --sb2-box-bottom-left-radius: var(--sb2-nova-connected-radius);

      background-clip: padding-box;
      box-shadow: none;
      border: var(--border-width, 1px) solid var(--sb2-nova-border-color);
      border-block-end-width: var(--sb2-nova-card-border-width);

      :root[lwtheme] & {
        border-color: var(--sidebar-border-color, var(--sb2-nova-border-color));
      }
    }

    /* Only the card layout visually joins a pinned panel to the launcher.
       Nightly's connected layout keeps both top corners rounded. */
    :root[sb2-nova-card-layout]
      #sb2-wrapper[position="left"]
      #sb2-box[pinned="true"] {
      --sb2-box-top-left-radius: var(--sb2-nova-connected-radius);
    }

    :root[sb2-nova-card-layout]
      #sb2-wrapper[position="right"]
      #sb2-box[pinned="true"] {
      --sb2-box-top-right-radius: var(--sb2-nova-connected-radius);
    }

    :root[sizemode="maximized"] #sb2-box[pinned="true"] {
      --sb2-box-bottom-right-radius: 0;
      --sb2-box-bottom-left-radius: 0;

      border-block-end-width: 0;
    }

    #sb2-box #sb2-toolbar {
      background-color: var(--sidebar-background-color);
      border-block-end: var(--border-width, 1px) solid
        var(--sidebar-border-color, var(--sb2-nova-border-color));
    }

    @media (-moz-platform: linux) {
      :root:not([sb2-nova-card-layout], [lwtheme]) #sb2-box,
      :root:not([lwtheme]) #sb2-box #sb2-toolbar {
        background-color: var(--toolbox-background-color, -moz-headerbar);
        color: var(--toolbox-text-color, -moz-headerbartext);
      }
    }
  }
`;
