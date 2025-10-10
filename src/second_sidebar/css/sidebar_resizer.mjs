export const SIDEBAR_RESIZER_CSS = `
  .sb2-resizer {
    position: absolute;
    background-color: transparent;
    z-index: 10;
    transition: background-color 0.5s ease-in-out;

    &:hover {
      background-color: var(--focus-outline-color);
    }
  }

  .sb2-resizer[type="left"],
  .sb2-resizer[type="right"] {
    top: 0;
    width: 4px;
    height: 100%;
    cursor: e-resize;
  }

  .sb2-resizer[type="left"] {
    left: 0;
  }

  .sb2-resizer[type="right"] {
    right: 0;
  }

  .sb2-resizer[type="top"],
  .sb2-resizer[type="bottom"] {
    left: 0;
    width: 100%;
    height: 4px;
    cursor: n-resize;
  }

  .sb2-resizer[type="top"] {
    top: 0;
  }

  .sb2-resizer[type="bottom"] {
    bottom: 0;
  }

  .sb2-resizer[type="topleft"],
  .sb2-resizer[type="topright"],
  .sb2-resizer[type="bottomleft"],
  .sb2-resizer[type="bottomright"] {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
    
  .sb2-resizer[type="topleft"] {
      top: -12px;
      left: -12px;
      cursor: nwse-resize;
  }

  .sb2-resizer[type="topright"] {
      top: -12px;
      right: -12px;
      cursor: nesw-resize;
  }

  .sb2-resizer[type="bottomleft"] {
      bottom: -12px;
      left: -12px;
      cursor: nesw-resize;
  }
          
  .sb2-resizer[type="bottomright"] {
      bottom: -12px;
      right: -12px;
      cursor: nwse-resize;
  }

  #sb2-box[pinned="true"] {
    .sb2-resizer {
      display: none;
    }
  }
`;
