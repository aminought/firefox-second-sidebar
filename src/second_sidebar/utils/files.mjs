import { ChromeRegistry } from "../wrappers/chrome_registry.mjs";
import { FileProtocolHandler } from "../wrappers/file_protocol_handler.mjs";
import { IOUtilsWrapper } from "../wrappers/io_utils.mjs";

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
  const parentDir = contentDir.QueryInterface(Ci.nsIFileURL).file.parent;
  const resourceFilePath = FileProtocolHandler.getURLSpecFromDir(parentDir);
  const resourcePath = removeFilePrefix(resourceFilePath);
  return resourcePath + relativePath;
}

/**
 *
 * @param {string} path
 * @returns {string}
 */
function removeFilePrefix(path) {
  return path.replace("file://", "");
}

/**
 *
 * @param {string} path
 * @returns {string}
 */
function makeChromePath(path) {
  return CONTENT_URL + path;
}
