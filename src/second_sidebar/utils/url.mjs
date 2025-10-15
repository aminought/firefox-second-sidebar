import { NetUtilWrapper } from "../wrappers/net_utils.mjs";

/**
 *
 * @param {string} url
 * @returns {string}
 */
export function clearUrl(url) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function extractHostname(url) {
  const uri = NetUtilWrapper.newURI(url);
  return ["http", "https"].includes(uri.scheme) ? uri.host : url;
}
