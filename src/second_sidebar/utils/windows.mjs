import { XULElement } from "../xul/base/xul_element.mjs";

/**
 *
 * @returns {boolean}
 */
export const isPopupWindow = () => {
  const mainWindow = new XULElement({
    element: document.getElementById("main-window"),
  });
  return (
    mainWindow.hasAttribute("chromehidden") &&
    mainWindow.getAttribute("chromehidden").includes("extrachrome")
  );
};
