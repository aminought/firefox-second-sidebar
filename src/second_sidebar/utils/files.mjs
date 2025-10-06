import { ChromeRegistry } from "../wrappers/chrome_registry.mjs";
import { IOUtilsWrapper } from "../wrappers/io_utils.mjs";
import { PathUtilsWrapper } from "../wrappers/path_utils.mjs";

const CONTENT_URL = "chrome://userchrome/content/";

/**
 *
 * @param {string} relativePath
 * @param {string} data
 * @returns {Promise<string>}
 */
export async function writeFile(relativePath, data) {
  const path = makePath(relativePath);
  await IOUtilsWrapper.writeUTF8(path, data);
  return makeChromePath(relativePath);
}

/**
 *
 * @param {string} relativePath
 */
export async function removeFile(relativePath) {
  const path = makePath(relativePath);
  await IOUtilsWrapper.remove(path);
}

/**
 *
 * @param {string} relativePath
 * @returns {string}
 */
function makePath(relativePath) {
  const contentDir = ChromeRegistry.convertChromeURL(CONTENT_URL);
  const resourcePath = contentDir.QueryInterface(Ci.nsIFileURL).file.parent
    .path;
  const resourcePathParts = PathUtilsWrapper.split(resourcePath);
  const relativePathParts = relativePath.split("/");
  return PathUtilsWrapper.join(resourcePathParts.concat(relativePathParts));
}

/**
 *
 * @param {string} path
 * @returns {string}
 */
function makeChromePath(path) {
  return CONTENT_URL + path;
}
