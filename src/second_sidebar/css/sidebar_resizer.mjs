export const SIDEBAR_RESIZER_CSS = `
  .sb2-resizer {
    position: absolute;
    width: 24px;
    height: 24px;
    background-color: transparent;
    border-radius: 50%;
    z-index: 10;
    transition: background-color 0.5s ease-in-out;

    &:hover {
      background-color: var(--focus-outline-color);
    }
  }
    
  .sb2-resizer[type="tl"] {
      top: -12px;
      left: -12px;
      cursor: nwse-resize;
  }

  .sb2-resizer[type="tr"] {
      top: -12px;
      right: -12px;
      cursor: nesw-resize;
  }

  .sb2-resizer[type="bl"] {
      bottom: -12px;
      left: -12px;
      cursor: nesw-resize;
  }
          
  .sb2-resizer[type="br"] {
      bottom: -12px;
      right: -12px;
      cursor: nwse-resize;
  }
`;
