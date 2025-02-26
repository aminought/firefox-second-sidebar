export const COMMON_CSS = `
  @import url("chrome://global/content/elements/moz-toggle.css");

  :root {
    --sb2-main-padding: var(--space-small);
    --sb2-main-web-panel-buttons-position: start;

    --sb2-box-unpinned-padding: var(--space-small);
    --sb2-box-unpinned-top-padding: var(--sb2-box-unpinned-padding);
    --sb2-box-unpinned-bottom-padding: var(--sb2-box-unpinned-padding);
    --sb2-box-unpinned-side-padding: var(--sb2-box-unpinned-padding);
  }

  #browser {
    position: relative;
  }
`;
