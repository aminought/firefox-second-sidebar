// ==UserScript==
// @name            Second Sidebar for Zen Browser
// @description     A Zen Browser userChrome.js script for adding a second sidebar with web panels like in Vivaldi/Floorp/Edge.
// @author          k00lagin
// @homepageURL     https://github.com/k00lagin/zen-second-sidebar
// ==/UserScript==

import { ContextualIdentityServiceWrapper } from "./second_sidebar/wrappers/contextual_identity_service.mjs";
import { CustomizeModePatcher } from "./second_sidebar/customize_mode_patcher.mjs";
import { SidebarDecorator } from "./second_sidebar/sidebar_decorator.mjs";
import { SidebarInjector } from "./second_sidebar/sidebar_injector.mjs";

const run = () => {
  ContextualIdentityServiceWrapper.ensureDataReady();
  if (SidebarInjector.inject()) {
    SidebarDecorator.decorate();
    CustomizeModePatcher.patch();
  }
};

if (typeof UC_API !== "undefined") {
  UC_API.Runtime.startupFinished().then(run);
} else {
  delayedStartupPromise.then(run);
}
