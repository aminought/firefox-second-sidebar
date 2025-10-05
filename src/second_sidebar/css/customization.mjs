export const CUSTOMIZATION_CSS = `
  #customization-container {
    position: absolute;
    z-index: 2147483647;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

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
