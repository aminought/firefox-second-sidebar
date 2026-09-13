export const SIDEBAR_SPLITTER_CSS = `
  @media -moz-pref("browser.nova.enabled") {
    #sb2-splitter {
      width: var(--chrome-window-gap, var(--splitter-width));
      border-inline: none;
      margin-inline: calc(-1 * var(--chrome-window-gap, 1px) + 1px);

      /* Stable Nova uses a real 2px #browser gap in compact density while its
         gap token is zero. Nightly has no token and keeps the 4px splitter. */
      :root[uidensity="compact"] & {
        width: calc(var(--chrome-window-gap, var(--splitter-width) - 2px) + 2px);
        margin-inline: calc(-1 * var(--chrome-window-gap, -2px) - 2px);
      }
    }

    #sb2-after-splitter {
      display: none;
    }
  }
`;
