# Quality 0.2.0

The gate requires unit, integration, security, accessibility, journeys, visual and performance evidence. Every passing record is bound to a full commit SHA, a durable GitHub Actions run URL and a parseable capture time; visual artifacts may additionally be bound by SHA-256. Missing, failed, unproved or malformed records block release.

Consumers run the appropriate tools (for example Node test, Playwright, axe, screenshot comparison and Lighthouse) inside their own application because journeys and thresholds are product-specific. Store artifacts in the referenced run, test positive and negative paths, and never substitute a local or older-commit result for exact-head evidence. Manual keyboard and rendered visual inspection remain required by the WAF UX standard and are recorded separately from automation.
