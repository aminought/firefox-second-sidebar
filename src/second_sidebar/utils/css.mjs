export function emptySvgAsDataUrl(size = 16) {
  return `data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'/%3E`;
}
