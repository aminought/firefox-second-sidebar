export class DialogBoxWrapper {
  #gDialogBox;

  constructor(gDialogBox) {
    this.#gDialogBox = gDialogBox;
  }

  get raw() {
    return this.#gDialogBox;
  }

  closeDialog() {
    this.raw.dialog.close();
  }
}
