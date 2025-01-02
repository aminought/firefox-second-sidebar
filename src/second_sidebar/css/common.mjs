export const COMMON_CSS = `
  @import url("chrome://global/content/elements/moz-toggle.css");

  #browser {
    --sb2-main-button-size: calc(2 * var(--toolbarbutton-inner-padding) + 16px);
    --sb2-main-button-icon-overlay-size: 12px;
    --sb2-main-padding: var(--space-small);
    --sb2-main-width: calc(var(--sb2-main-button-size) + 2 * var(--sb2-main-padding));
    --sb2-main-web-panel-buttons-position: start;

    --sb2-box-unpinned-padding: var(--space-small);
    --sb2-box-unpinned-top-padding: var(--sb2-box-unpinned-padding);
    --sb2-box-unpinned-bottom-padding: var(--sb2-box-unpinned-padding);
    --sb2-box-unpinned-side-padding: var(--sb2-box-unpinned-padding);

    position: relative;
  }
`;
