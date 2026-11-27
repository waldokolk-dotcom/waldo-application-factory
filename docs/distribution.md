# WAF/WOC distribution block v0.1.0

WAF publishes versioned building blocks. WOC distributes approved updates to registered applications and records their status. Applications pin a known-good version and never receive an untested major change automatically.

## Lifecycle

`available → approved → staged → active`; failures move to `rolled_back`.

Every update contains appId, blockId, fromVersion, toVersion, changeType, compatibility targets, rollbackVersion, release notes and evidence links.

- Patch: security, accessibility or defect fixes; can be auto-staged after checks.
- Minor: compatible UX or feature changes; staged and approved per application.
- Major: migration required; never auto-applied.
- Feature flags permit gradual rollout and immediate disablement.
- WOC records deployment, health result, incident and rollback evidence.
- Actuality changes may be distributed as configuration/content updates without shipping code.

## Application contract

Each app registers its active block versions, accepted platforms, feature flags, data migrations and rollback target. The app exposes a version endpoint and health endpoint. A failed health check pauses rollout and opens an incident.

## Laptop UX

Desktop releases must verify 1280×800 and 1440×900, keyboard focus, Enter/Escape, zoom at 200%, and desktop navigation. Mobile bottom navigation must not be reused as the laptop navigation.

## No false readiness

A registry entry is not production-ready until the block has automated checks, isolated integration evidence, a deployment record and rollback evidence.
