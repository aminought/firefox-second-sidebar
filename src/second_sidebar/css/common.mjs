export const COMMON_CSS = `
  @import url("chrome://global/content/elements/moz-toggle.css");

  #browser {
    position: relative;

    --sidebar-2-main-button-icon-size: 32px;
    --sidebar-2-main-button-icon-overlay-size: 12px;
    --sidebar-2-main-padding: var(--space-small);
    --sidebar-2-main-width: calc(var(--sidebar-2-main-button-icon-size) + 2 * var(--toolbarbutton-outer-padding) + 2 * var(--sidebar-2-main-padding));
  }
`;
