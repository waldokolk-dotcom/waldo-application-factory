# Theme 0.2.0

Import `blocks/theme.css` once, then apply a product-specific identity package with `data-waf-theme` on the document root. `identity.mjs` accepts only versioned, identifier-safe packages, requires every semantic color and rejects body-text or primary-action contrast below WCAG AA (4.5:1). Generated CSS overrides identity tokens only; focus, reduced-motion, forced-colors and responsive media behavior stay central.

The stylesheet exposes both WAF identity tokens and shadcn/ui semantic aliases. Consumers may map these aliases into Tailwind/shadcn configuration without duplicating brand values. A product remains responsible for rendered desktop/mobile inspection, keyboard behavior, component states and visual-regression evidence. Roll back by restoring the previous identity package version; never edit a released package in place.
