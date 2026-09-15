export const COMMON_CSS = `
  @import url("chrome://global/content/elements/moz-toggle.css");

  :root {
    --sb2-main-padding: var(--space-small);
    --sb2-main-web-panel-buttons-position: start;
  }

  @media -moz-pref("browser.nova.enabled") {
    :root {
      /* Card-style Nova exposes the gap/radius tokens. Newer connected layouts
         do not, so the fallbacks intentionally describe a flush surface. */
      --sb2-nova-window-gap: var(--chrome-window-gap, 0px);
      --sb2-nova-radius: var(--chrome-block-radius, var(--border-radius-medium));
      --sb2-nova-card-radius: var(--chrome-block-radius, 0px);
      --sb2-nova-connected-radius: min(
        var(--sb2-nova-radius),
        calc(var(--sb2-nova-window-gap) * 2)
      );
      --sb2-nova-card-border-width: min(
        var(--border-width, 1px),
        var(--sb2-nova-card-radius)
      );
      --sb2-nova-border-color: var(
        --chrome-content-separator-color,
        var(--sidebar-border-color)
      );
    }

    :root[sb2-nova-card-layout]:not([lwtheme]) {
      --sb2-nova-sidebar-surface-color: var(
        --toolbar-background-color,
        var(--toolbox-background-color, var(--sidebar-background-color))
      );
      --sb2-nova-sidebar-text-color: var(
        --toolbox-text-color,
        var(--sidebar-text-color)
      );

      @media (-moz-platform: linux) {
        --sb2-nova-sidebar-surface-color: var(
          --toolbox-background-color,
          -moz-headerbar
        );
        --sb2-nova-sidebar-text-color: var(
          --toolbox-text-color,
          -moz-headerbartext
        );
      }
    }

    @media (-moz-windows-mica) {
      /* Opposite window edges can sample slightly different Mica tones. Bias
         only Second Sidebar enough to compensate without flattening the effect. */
      :root[sb2-nova-card-layout]:not([lwtheme]) {
        --sb2-nova-sidebar-surface-color: color-mix(
          in srgb,
          var(--toolbar-background-color) 97.5%,
          white 2.5%
        );
      }
    }

    /* Nightly's connected layout no longer gives the content a corner on the
       edge occupied by Second Sidebar. Restore that native separator and
       radius in restored windows without changing Firefox's own sidebar. */
    :root[sizemode="normal"]:not(
        [sb2-nova-card-layout],
        [inFullscreen],
        [inDOMFullscreen],
        [fullscreenNavToolboxHidden]
      ):has(
        #sb2-wrapper[position="left"] #sb2-main:not([sb2-collapsed], [overlay="true"]),
        #sb2-wrapper[position="left"] #sb2-box[pinned="true"]:not([hidden="true"])
      )
      #tabbrowser-tabpanels
      > :not(.split-view-panel)
      .browserContainer {
      border-top-left-radius: var(--sb2-nova-radius);
      border-left: var(--border-width, 1px) solid var(--sb2-nova-border-color);
    }

    :root[sizemode="normal"]:not(
        [sb2-nova-card-layout],
        [inFullscreen],
        [inDOMFullscreen],
        [fullscreenNavToolboxHidden]
      ):has(
        #sb2-wrapper[position="right"] #sb2-main:not([sb2-collapsed], [overlay="true"]),
        #sb2-wrapper[position="right"] #sb2-box[pinned="true"]:not([hidden="true"])
      )
      #tabbrowser-tabpanels
      > :not(.split-view-panel)
      .browserContainer {
      border-top-right-radius: var(--sb2-nova-radius);
      border-right: var(--border-width, 1px) solid var(--sb2-nova-border-color);
    }

    /* Firefox only keeps a maximized content corner when it sees one of its
       built-in sidebars on that edge. Teach it about the second sidebar too. */
    :root[sizemode="maximized"]:not(
        [inFullscreen],
        [inDOMFullscreen],
        [fullscreenNavToolboxHidden]
      ):has(
        #sb2-wrapper[position="left"] #sb2-main:not([sb2-collapsed], [overlay="true"]),
        #sb2-wrapper[position="left"] #sb2-box[pinned="true"]:not([hidden="true"])
      )
      #tabbrowser-tabpanels
      > :not(.split-view-panel)
      .browserContainer {
      border-top-left-radius: var(--sb2-nova-radius);
      border-left: var(--border-width, 1px) solid var(--sb2-nova-border-color);
    }

    :root[sizemode="maximized"]:not(
        [inFullscreen],
        [inDOMFullscreen],
        [fullscreenNavToolboxHidden]
      ):has(
        #sb2-wrapper[position="right"] #sb2-main:not([sb2-collapsed], [overlay="true"]),
        #sb2-wrapper[position="right"] #sb2-box[pinned="true"]:not([hidden="true"])
      )
      #tabbrowser-tabpanels
      > :not(.split-view-panel)
      .browserContainer {
      border-top-right-radius: var(--sb2-nova-radius);
      border-right: var(--border-width, 1px) solid var(--sb2-nova-border-color);
    }
  }

  #browser {
    position: relative;
  }
`;
