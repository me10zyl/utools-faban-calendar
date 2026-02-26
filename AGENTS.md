# AGENTS.md

## Project Snapshot
- Vue 3 + Vite app, Element Plus UI, uTools integration.
- Entry: src/main.js; Router: src/router.js.
- Components live in src/components; shared logic in src/js.
- Global CSS vars in src/style.css.
- Vite alias: @ -> /src (vite.config.js).
- JS/TS mix: .js for boot/router, .ts for utilities and types, .vue uses lang="ts".

## Setup and Commands
- Install deps: npm install
- Dev server: npm run dev
- Build: npm run build
- Preview build: npm run preview
- Single test: no test runner configured; add one before attempting single-test runs.
- Lint/format: no scripts or config found (no ESLint/Prettier).

## Cursor / Copilot Rules
- Cursor rules: none found in .cursor/rules/ or .cursorrules.
- Copilot rules: none found in .github/copilot-instructions.md.

## Repo Layout
- src/App.vue: root view, router outlet.
- src/components/*.vue: UI and dialogs.
- src/js/*.ts: storage, utools helpers, types.
- public/: uTools plugin assets, preload, Vditor assets.
- public/plugin.json: uTools feature registration.
- public/package.json: sets commonjs for preload runtime.

## Vue SFC Conventions
- Use existing style in each file (some use <script setup>, some defineComponent).
- Prefer Composition API (ref, reactive, computed, watch).
- Use Element Plus components; keep props and v-model names consistent.
- Expose component methods with defineExpose when used via ref.
- Keep templates readable; avoid deeply nested inline logic.
- Use v-if to guard expensive sections when data not ready.
- Keep dialog visibility in refs (dialogVisible, scriptDialogVisible).

## Imports
- Order imports: external packages, then internal aliases (@/), then relative.
- Use @ alias for src when possible; otherwise relative paths.
- Keep import names explicit; avoid unused imports.
- Some files use double quotes; follow file style when editing.

## Formatting
- Indentation varies (2 spaces in SFC templates, 2-4 in TS); do not reformat wholesale.
- Keep semicolons consistent with the existing file.
- Keep line endings and spacing intact; minimize unrelated diffs.

## Types and TS
- TypeScript is used in src/js and many SFC scripts.
- Shared types live in src/js/*.d.ts (calendar.d.ts, options.d.ts).
- Prefer explicit types for refs and reactive objects in new code.
- Use interfaces for structured data (Options, Project, Env, Item).
- When accessing utools globals or window.services, use // @ts-ignore if needed.
- Avoid "any" unless unavoidable; document why if used.

## Naming
- Components: PascalCase filenames and component names.
- Functions: camelCase (e.g., refreshList, projectChange).
- Data refs: nouns or noun phrases (items, selectItem, formData).
- Boolean refs: start with is/has/show (isUpdateSQL, showDialog).
- Constants: use const; avoid var.

## State and Storage
- Persist options and calendars via src/js/myStorage.ts (do not bypass).
- Low-level storage wrapper is src/js/storage.ts (utools.dbStorage).
- Backup logic uses window.services.saveBackupFiles; keep behavior intact.
- When mutating arrays in reactive state, use splice or direct index updates.
- If you add new persisted fields, update type definitions and defaults.

## Command Execution (uTools)
- Command templates support {{var}} replacement via myUtools.evaluateCmd.
- Guard required settings like basePath before running commands.
- UI feedback uses ElMessage for errors and confirmations.
- Command output is captured in CommandDialog (stdout/stderr/exitCode).

## Routing
- Routes are defined in src/router.js (createWebHistory).
- Calendar is "/", Options is "/options".
- myUtools.redirect uses utools feature codes to switch views.

## Styling
- Global CSS variables live in src/style.css.
- Use <style scoped> in components; use :deep() for Element Plus selectors.
- Keep class names descriptive; reuse existing patterns (left, right, anchor).
- Avoid adding global styles unless necessary.

## UI Behavior
- Use ElMessage for short user feedback.
- Use ElDialog for modal flows; prefer explicit "show()" methods.
- Keep lists reactive and sorted as in myStorage.getCalendars.
- Use nextTick when DOM measurements are required.

## Data Flow Patterns
- Initialize complex objects with defaults (projectInit, init).
- Use deepClone for fresh copies when reusing default templates.
- Use watch to persist changes to storage with minimal delay.
- Prefer computed for derived UI strings (checkSuccessText).

## Error Handling
- Return early on invalid inputs (e.g., empty branch names).
- Use user-facing messages instead of throwing in UI code.
- Validate required config fields (basePath, defaultConfCenterName).

## When Adding Features
- Update types in src/js/*.d.ts first.
- Update storage defaults in myStorage.getOptions if needed.
- Keep uTools integration consistent with plugin.json and preload.
- Add new dialogs as components and expose show() via refs.

## Assets and Public
- public/preload.js and plugin.json are part of the uTools plugin bundle.
- Avoid moving or renaming public/vditor assets.

## Tests and QA
- No automated tests present; rely on manual smoke testing.
- Suggested manual checks: open Calendar, create item, edit, persist, export/import.
- If you add tests, document how to run a single test here.

## Git Hygiene for Agents
- Do not reformat unrelated files.
- Do not delete data in local storage unless asked.
- Keep edits scoped to the requested change.

## Quick Reference
- App entry: src/main.js
- Router: src/router.js
- Main view: src/components/Calendar.vue
- Options view: src/components/Options.vue
- Storage: src/js/myStorage.ts and src/js/storage.ts
- Types: src/js/calendar.d.ts and src/js/options.d.ts
- uTools helpers: src/js/myUtools.ts

## Notes
- This repo is ESM (package.json "type": "module").
- public/package.json sets CommonJS for preload runtime.
- Vite dev server defaults to http://localhost:5173/ (plugin.json).
- If you change the dev port, update public/plugin.json.

## Single Test Guidance
- Not available yet; add a test runner (e.g., Vitest) before assuming a command.
- Once added, document example: npm run test -- Calendar.spec.ts.

## Housekeeping
- Keep docs short and actionable for agents.
- Prefer incremental diffs over sweeping refactors.
- Update this file when build or tooling changes.
- End.
