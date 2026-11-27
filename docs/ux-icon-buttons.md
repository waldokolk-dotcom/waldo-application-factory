# WAF UX icon-button and responsive rules v0.1.0

## Standard icon set
Use one consistent outline icon set. Required actions are: enter/submit, next, back, close, expand/collapse, menu, search, filter, location, add, edit, delete, success, warning and help. Use inline SVG or a maintained open-source icon package. Emoji and mixed icon styles are not allowed for task controls.

Every icon-only control has an accessible name via `aria-label` and a visible tooltip/title on desktop. Text buttons pair a recognizable icon with a verb when the action benefits from recognition: “Verder”, “Terug”, “Opslaan”, “Sluiten”, “Filter”.

## Interaction contract
- Minimum touch target: 48 × 48 px on touch devices.
- Desktop controls: minimum 42 × 42 px.
- Enter submits the active form; Escape closes a dialog or sheet; Alt/Left returns to the prior view where supported.
- Back, close and cancel are separate actions with consistent placement.
- Never use a bare arrow as the only label for a critical action.
- Disabled controls explain why they are disabled; loading controls retain their width and expose busy state.

## Laptop layout contract
- Build mobile-first, then test at 1280 × 800 and 1440 × 900.
- Use a centered content frame with a maximum width; do not stretch phone layouts across a laptop.
- At desktop width, use a two-column shell where the primary task remains readable and secondary context sits beside it.
- Do not leave mobile bottom navigation floating at the bottom of a laptop viewport. Replace it with a left rail or a desktop header.
- Keep body text at least 16 px and critical labels at least 14 px.
- Test keyboard navigation, focus order, Enter, Escape and browser zoom at 200%.
- Test at 320, 375, 768, 1280 and 1440 px widths. A layout is not ready when only the phone viewport works.
