/**
 * @typedef {Object} ParsedFunction
 * @property {string} name
 * @property {Function} func
 */

/**
 *
 * @param {string} functionSource
 * @returns {ParsedFunction}
 */
export function parseFunction(functionSource) {
  const matches = [...functionSource.matchAll(/function\s(.*)\((.*)\)/gim)];
  const groups = matches[0];
  const name = groups[1];
  const args = groups.slice(2);
  const body = functionSource.split("\n").slice(1, -1).join("\n");
  return { name, func: new Function(...args, body) };
}
