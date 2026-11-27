# WAF Change Control v0.2.0

This block is mandatory for changes to registered applications.

## Lifecycle

`draft → review → approved → published`; a failed production check moves the change to `rolled_back`.

A change record must contain:

- change ID, app, summary and changed files;
- changed WAF/WOC blocks;
- preview URL;
- before/after screenshots;
- UX review, laptop review and accessibility review;
- automated test results;
- rollback target and verified rollback plan;
- named approval and timestamp.

Production publication is blocked until the record is approved. Autonomous development may create drafts, run tests and prepare a preview, but it may not silently publish a change that lacks approval. An explicit user instruction can authorize autonomous publication for a named application and scope; that authorization must be recorded in the change record.

## Required review

Review at 320, 375, 768, 1280 and 1440 px. Check keyboard focus, Enter, Escape, zoom at 200%, empty/loading/error/success states, accessible labels, contrast and the primary user journey.

## Evidence

The release record links to the preview, screenshots and test output. A deployment without evidence is not considered ready. WOC monitors the published version, stores health results and activates the rollback target when the release is unhealthy.

The executable gate requires HTTPS preview and before/after artifact URLs, an exact target commit, a durable GitHub Actions quality run, passing UX/laptop/accessibility reviews, a verified semantic-version rollback target and a named timestamped approval. Evidence can only be attached to a draft and approval only follows review.
