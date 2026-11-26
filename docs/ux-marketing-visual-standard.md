# WAF UX, marketing & visual quality — v0.2
Mandatory for websites, webapps and mobile apps. Apply proportionately to internal tools versus commercial products.

## Product and experience
Define audience, primary job, value proposition, success metric and key user journeys before coding. Offer 2–3 genuinely distinct theme directions when design is undecided; show representative screens, not merely palettes. Preserve approved brand identity and existing useful functionality. Prefer proven accessible components, but compose a distinctive interface. Use typography, spacing, responsive grids, meaningful hierarchy, progressive disclosure and consistent interaction. Design loading, empty, error, success, offline and permission states. Test keyboard, touch, focus, forms, search, navigation and recovery.

## Visual and image craft
Avoid generic AI aesthetics: repetitive card grids, gratuitous gradients/glows, decorative badges, meaningless icons, excessive rounded boxes, generic copy and unmotivated hero layouts. Choose an editorial, premium, utilitarian or other coherent visual language based on the audience. Use art-directed realistic imagery where valuable, with consistent light, perspective, materials and believable anatomy. Inspect crops at intended screen sizes; reject visual artifacts, illegible text and irrelevant stock imagery. Use licensed or original assets, document provenance and consent; do not present synthetic imagery as documentary evidence or fabricate testimonials, customers or logos. Optimize images, provide appropriate alt text, and preserve identities in user-provided photo edits.

## Marketing
For public products: clear audience and positioning, concrete benefit, credible evidence, honest calls to action, onboarding and conversion flow; useful metadata and social previews, SEO for indexable pages, privacy-respecting measurement. No fake social proof, dark patterns or unsupported claims. Internal tools prioritize task completion over conversion.

## Release gate
Use independent UX review of rendered screens and real interactions at mobile and desktop widths. Check WCAG 2.2 AA as target, automated axe checks plus manual keyboard/focus/contrast checks; automated tests alone do not prove compliance. Test core journeys with Playwright or equivalent; record screenshots, defects, fixes and retest evidence. Evaluate performance using Lighthouse or equivalent with documented conditions. UX rubric: usability 20, navigation 20, comprehension 15, visual craft 10, consistency 10, mobile 10, accessibility 10, perceived speed 5. Target >=85/100 with evidence, not invented scores. Critical usability, accessibility, security, misleading marketing or visual defects block release regardless of score. Real user feedback where feasible; label simulated reviews as such.
## Reusable library backlog
1. UX component catalog and screen patterns (navigation, search, forms, dashboards, onboarding, map, admin).
2. Interactive UX Studio with theme selection and responsive previews.
3. Versioned brand tokens, curated themes and page compositions.
4. Independent UX reviewer with evidence rubric.
5. Automated accessibility and visual regression tests.
6. UX/marketing/visual gates integrated in each development cycle.
Use free/open-source tooling where suitable; no paid assets or services without approval. Track these six additional milestones separately from the original thirteen; do not mark a specification as working software.

## Reference-driven design
Use real product examples during design, not as decorative moodboards. Record the source URL, the observed interaction pattern, the user problem it addresses, the product-specific adaptation and rendered test proof. Mobbin may be used to compare complete search, filter, onboarding and dashboard flows; pair it with public design-system guidance where implementation details or accessibility states are needed. Never copy trade dress, text, assets or brand identity. A reference without an explicit adaptation and tested loading, empty, error, success and permission states does not satisfy the UX gate.
