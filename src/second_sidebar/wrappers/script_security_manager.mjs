export class ScriptSecurityManagerWrapper {
  /**@type {number} */
  static DEFAULT_USER_CONTEXT_ID =
    Services.scriptSecurityManager.DEFAULT_USER_CONTEXT_ID;

  /**
   *
   * @returns {number}
   */
  static getSystemPrincipal() {
    return Services.scriptSecurityManager.getSystemPrincipal();
  }
}
