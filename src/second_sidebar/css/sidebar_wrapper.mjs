export const SIDEBAR_WRAPPER_CSS = `
  #sb2-wrapper {
    display: contents;

    &[position="right"] {
      #sb2-after-splitter { order: 20; }
      #sb2-splitter { order: 21; }
      #sb2-box { order: 22; }
      #sb2-main { order: 23; }
    }

    &[position="left"] {
      #sb2-main { order: -23; }
      #sb2-box { order: -22; }
      #sb2-splitter { order: -21; }
      #sb2-after-splitter { order: -20; }
    }
  }
`;
