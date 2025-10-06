export const COMMON_CSS = `
  @import url("chrome://global/content/elements/moz-toggle.css");

  :root {
    --sb2-main-padding: var(--space-small);
    --sb2-main-web-panel-buttons-position: start;

    --sb2-box-floating-padding: var(--space-small);
    --sb2-box-floating-top-padding: var(--sb2-box-floating-padding);
    --sb2-box-floating-bottom-padding: var(--sb2-box-floating-padding);
    --sb2-box-floating-side-padding: var(--sb2-box-floating-padding);
  }

  #browser {
    position: relative;
  }
`;
