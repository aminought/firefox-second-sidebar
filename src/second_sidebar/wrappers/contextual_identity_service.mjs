/**
 * @typedef {Object} PublicIdentity
 * @property {number} userContextId
 * @property {string} name
 * @property {boolean} public
 * @property {string} color
 * @property {string} icon
 */

export class ContextualIdentityServiceWrapper {
  static ensureDataReady() {
    ContextualIdentityService.ensureDataReady();
  }

  /**
   *
   * @returns {Array<number>}
   */
  static getPublicUserContextIds() {
    return ContextualIdentityService.getPublicUserContextIds();
  }

  /**
   *
   * @param {number} userContextId
   * @returns {PublicIdentity?}
   */
  static getPublicIdentityFromId(userContextId) {
    return ContextualIdentityService.getPublicIdentityFromId(userContextId);
  }

  /**
   *
   * @param {number} userContextId
   * @returns {string?}
   */
  static getUserContextLabel(userContextId) {
    return ContextualIdentityService.getUserContextLabel(userContextId);
  }
}
