# Changelog

All notable changes to the FS Design Standard are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses semantic versioning.

## [1.1.0] — 2026-11-11

Initial standardized baseline extracted from the original local design package.

### Added

- `AGENTS.md` — portable, agent-agnostic page-generation workflow (replaces the
  Kiro-only `.kiro/steering/fs-page-generation.md`).
- `CHANGELOG.md` and versioning guidance.
- `.gitlab-ci.yml` — runs `build.js`, `validate.js`, and `verify.js` on merge requests.

### Changed

- `package.json` renamed to `fs-design-standard` and aligned to version `1.1.0`.
- `README.md` rewritten for the standardized repository scope.
- `verify.js` workflow now documents `npm ci` instead of `npm install`.

### Removed

- `node_modules/` — reinstall with `npm ci`.
- `.kiro/hooks/` — Kiro-only hooks; the workflow no longer depends on them.
- `.kiro/specs/component-reference-system/` — historical design document.
- `.kiro/steering/fs-page-generation.md` — content migrated to `AGENTS.md`.
- `fs-components/component-specs/manifest.json` — stale duplicate (referenced
  non-existent `demo/preview/` paths).
- `fs-components/component-specs/spec/` — unused parallel JSON specs.
- `fs-components/component-specs/schemas/` — only served the removed JSON specs.
- `fs-components/component-specs/intent-map.json` — unreferenced.
- `.vscode/settings.json` — local editor configuration.
- `.DS_Store` files.
