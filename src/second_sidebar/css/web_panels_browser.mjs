export const WEB_PANELS_BROWSER_CSS = `
  .sb2-web-panels-browser {
    width: 100%;
    height: calc(100% + 1px);
    background-color: var(--toolbar-background-color, var(--toolbar-bgcolor));
    clip-path: inset(
      -1px 0 round 0 0 var(--sb2-box-bottom-right-radius, var(--border-radius-medium))
        var(--sb2-box-bottom-left-radius, var(--border-radius-medium))
    );
  }
`;
