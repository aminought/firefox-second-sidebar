export const CUSTOMIZATION_CSS = `
  #customization-container {
    background-color: var(--sidebar-background-color);
    color: var(--sidebar-text-color);
    position: absolute;
    z-index: 2147483647;
    width: 80%;
    height: 70%;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: var(--arrowpanel-border-radius);
    box-shadow: 0px 0px 8px 1px var(--arrowpanel-border-color);

    #customization-panel-container {
      flex: unset;
      .panel-arrow {
        display: none;
      }
    }

    toolbarpaletteitem::after {
      overflow-x: scroll;
      text-overflow: ellipsis;
    }
  }
`;
