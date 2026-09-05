# Repository guidance

## Project and runtime

Second Sidebar is a privileged Firefox userChrome.js script loaded through
fx-autoconfig. It adds a second sidebar and web panels to Firefox's browser UI.
It is not a WebExtension or a Node.js/web application: there is no manifest,
bundler, development server, or build step. Deploy the contents of `src/` as-is.

Read `README.md` for features and installation, and the relevant implementation
before changing behavior. Follow applicable user-level agent instructions;
keep machine-specific subagent configuration outside this repository.

## Code map

All paths below are relative to `src/second_sidebar/`, except the entry point.

| Location                                       | Responsibility                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/second_sidebar.uc.mjs`                    | Waits for Firefox startup, skips nested panel windows, injects and decorates the sidebar. |
| `sidebar_injector.mjs`                         | Loads settings/state, creates elements and controllers, then applies settings/state.      |
| `sidebar_elements.mjs`, `browser_elements.mjs` | Sidebar element registry and access to existing Firefox chrome elements.                  |
| `sidebar_controllers.mjs`                      | Creates and connects controllers in dependency order.                                     |
| `controllers/`                                 | Sidebar/panel behavior, geometry, shortcuts, popup actions, and cross-window events.      |
| `xul/`, `xul/base/`                            | UI components and shared fluent wrappers around XUL/HTML elements.                        |
| `css/`, `sidebar_decorator.mjs`                | CSS template-string exports, combined and injected into the chrome document.              |
| `settings/`                                    | Defaults, serialization, persisted settings, and panel state.                             |
| `wrappers/`                                    | Adapters for privileged Firefox globals and services.                                     |
| `patchers/`                                    | Compatibility patches for Firefox's own UI implementation.                                |
| `utils/`, `icons/`                             | Shared helpers and SVG assets.                                                            |

## Implementation conventions

- Use ES modules with explicit relative `.mjs` imports. Follow the existing
  two-space indentation, double quotes, semicolons, and Prettier formatting.
  Files use `snake_case`; classes use `PascalCase`; methods use `camelCase`.
- Keep JSDoc consistent with nearby code. Some imports exist only for JSDoc and
  use a targeted `no-unused-vars` suppression; do not remove their type context
  just to silence lint.
- Put behavior in controllers, UI construction in `xul/`, and Firefox API access
  in the corresponding wrapper. Reuse `XULElement` and `utils/xul.mjs` helpers.
  Preserve the XUL/HTML element distinction.
- Use the existing `sb2-` IDs/classes and `--sb2-` CSS variables for new sidebar
  styles. Preserve UUID-based panel/widget identities. Add new CSS exports to
  `sidebar_decorator.mjs` when they need to be injected.
- Match existing Firefox theme tokens and native controls. Keep keyboard focus,
  shortcuts, tooltips, and both sidebar positions working when changing UI.
- `MozButton` and `Toggle` wrap HTML custom elements with `isXUL: false`;
  popup/menu wrappers use XUL. Reuse their factories when adding controls.
- Before changing layout CSS, trace the controller that sets the element's
  attributes and geometry. Keep calculated dimensions/offsets in the geometry
  flow; physical panel anchors are not interchangeable with logical CSS spacing.
  Preserve theme-token fallbacks and affected `browser.nova.enabled` rules.
- Update the README when user-visible features or installation steps change.
  Keep edits focused; avoid unrelated formatting or framework/toolchain changes.

## Changing settings

Follow an existing setting through these files under `src/second_sidebar/`:

- Sidebar: `xul/sidebar_main_popup_settings.mjs` →
  `controllers/sidebar_main_settings.mjs` → `controllers/events.mjs` → the
  receiving controller → `settings/sidebar_settings.mjs`.
- Panel editing: `xul/web_panel_popup_edit.mjs` →
  `controllers/web_panel_edit.mjs` → `controllers/events.mjs` →
  `controllers/web_panels.mjs` / `controllers/web_panel.mjs` →
  `settings/web_panel_settings.mjs`. Also check the new-panel popup/controller
  when the setting should be available during creation.

Both settings dialogs apply changes live. Their Cancel handlers only close the
popup; Save persists the current settings. Do not assume Cancel restores the
previous values when extending these flows.

## Invariants and sensitive areas

- Preserve startup ordering: wait for `UC_API.Runtime.startupFinished()` or
  `delayedStartupPromise`; skip `sb2-webpanels-window` and popup windows; load
  settings/state before creating elements, controllers, and applying values.
- `xul/web_panels_browser.mjs` hosts a nested Firefox chrome window whose tabs
  back the panels. Its startup observers, SessionStore handling, close commands,
  popup notifications, and URL-bar patches are part of the implementation.
  Validate changes to this code in a real Firefox instance.
- Reuse widget readiness helpers such as `doWhenButtonReady`; CustomizableUI
  instances are not always available synchronously in every window.
- Use `controllers/events.mjs` for cross-window actions. Preserve event names,
  UUIDs, payload fields, and `isActiveWindow` behavior. Permanent panels are
  shared across windows; temporary creation is limited to the active window.
- Settings are JSON string preferences: `second-sidebar.settings`,
  `second-sidebar.web-panels`, and `second-sidebar.web-panels-state`. Preserve
  saved user data and defaults for missing fields. When adding a setting, update
  its model, load/save or `fromObject`/`toObject` paths, UI, and event handling
  together. Keep panel settings distinct from state such as `lastUrl`.
- Preserve container identity and the existing loading/security context when
  creating or navigating panel tabs. Account for temporary panels, unload on
  close, reload timers, listeners, and observers when changing panel lifecycle.
- Firefox internals are version-sensitive. For patcher changes, inspect the
  actual target Firefox source (Searchfox's `firefox-main` may differ from the
  installed release) and verify the text/regex replacement still matches.
  Preserve temporary-module cleanup in `utils/files.mjs`. Keep these patches
  isolated rather than spreading source rewriting through controllers.

## Static checks

There is no tracked package manifest, lockfile, npm script, or automated test
suite. `.gitignore` excludes `package.json`, `package-lock.json`, and
`node_modules`; these may exist locally but are not the project contract.
The tracked check definitions are `eslint.config.mjs`, `.prettierrc`, and
`.github/workflows/`.

For a checkout without local tooling, install the lint/format tools from the
repository root (this is development setup, not a runtime dependency):

```sh
npm install --no-save --package-lock=false eslint@9.7.0 @eslint/js@9 globals@15 prettier@3
```

Run the checks relevant to changed files:

```sh
npx eslint .
npx prettier --check "src/**/*.mjs" "*.mjs" "*.md" ".github/workflows/*.yml"
git diff --check
```

For documentation-only edits, check formatting on the edited Markdown files.
For targeted formatting fixes, use `npx prettier --write <changed-files>`.
Do not reformat unrelated files to clear an existing repository-wide failure.
On PowerShell, `npm.cmd`/`npx.cmd` can be used if `.ps1` launchers are blocked.

CI installs ESLint 9.7.0 and uploads SARIF using
`@microsoft/eslint-formatter-sarif@3.1.0`; its lint step uses `continue-on-error`.
Inspect lint output rather than treating a green workflow as proof of no errors.
The Prettier workflow uses a dry run. Add legitimate Firefox globals to the
existing ESLint globals list when needed, rather than broadly disabling rules.
Node syntax checks and lint cannot validate privileged Firefox APIs or XUL UI.

## Firefox validation

Use a dedicated test profile with fx-autoconfig. Follow the README: copy
`src/second_sidebar.uc.mjs` and `src/second_sidebar/` into the profile's
`chrome/JS/`, enable `toolkit.legacyUserProfileCustomizations.stylesheets` and
`dom.allow_scripts_to_close_windows`, clear the startup cache as documented by
fx-autoconfig, then restart Firefox. Do not assume a page reload reloads modules.

Select manual scenarios according to the change:

- Startup, sidebar show/hide, left/right placement, toolbar customization.
- Panel create/edit/delete, navigation, close/reopen, and temporary panels.
- Floating/pinned geometry, resizing, auto-hide, and keyboard shortcuts.
- A second browser window, propagation of edits, and persistence after restart.
- Containers, zoom, mute, unload/reload, and permission popups when affected.
- Light/dark themes and affected conditional theme rules for color/style changes.

Check Firefox's Browser Console for errors. Record the Firefox version, operating
system, and scenarios actually exercised. If Firefox cannot be run, say which
runtime checks remain unverified; do not present static checks as runtime tests.

## Upstream references

- [fx-autoconfig installation and startup cache](https://github.com/MrOtherGuy/fx-autoconfig)
- [Searchfox: Firefox source and internal APIs](https://searchfox.org/firefox-main/source/)
- [Firefox desktop components](https://firefoxux.github.io/firefox-desktop-components/)
