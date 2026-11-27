# Release 0.2.0

A release receipt is created only when every Quality gate has exact-commit evidence, Render reports the same full commit live, the bounded HTTPS health endpoint has been verified, and a distinct previous commit has a dated rollback procedure. A queued or accepted deploy is never a successful release.

The consumer repository owns CI and deployment. Use `checksPass`, least-privilege workflow permissions and exact-head checks; then wait until the live status endpoint returns the merge commit. Recheck health, protected-route denial and applicable user journeys. Rollback is a new deploy or revert to the recorded compatible commit; it does not reverse data migrations or external writes, so migrations require their own retention-safe recovery plan.
