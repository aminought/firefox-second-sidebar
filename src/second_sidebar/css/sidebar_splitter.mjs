export const SIDEBAR_SPLITTER_CSS = `
  @media -moz-pref("browser.nova.enabled") {
    #sb2-splitter {
      width: var(--chrome-window-gap);
      border-inline: none;
      margin-inline: calc(-1 * var(--chrome-window-gap) + 1px);
    }

    #sb2-after-splitter {
      display: none;
    }
  }
`;
