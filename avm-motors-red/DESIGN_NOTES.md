# AVM Motors — flagship concept v4

Scope: **only** `avm-motors-red/`. `avm-motors-heritage/` is intentionally untouched.

## Design thesis
Redline Automotive Editorial: real shop imagery, near-black graphite, warm chalk-white surfaces, precise motorsport-red, editorial typography and deliberate movement. No generic dashboard cards, animated page scroll-progress line, speculative brand claims or fictional awards.

## Sources actually consulted and how they were applied
- https://prompt-motion.com/ — restrained kinetic typography and visual pacing. Used as inspiration, no video or original motion assets copied.
- https://astryx.atmeta.com/components — accessible selectable fields, native dialog patterns, stepper logic, command palette. Reimplemented in framework-free JS; **@astryxdesign/core is NOT installed** (React 19+).
- https://ui.aceternity.com/blocks/hero-sections — photo-driven, asymmetrical cinematic hero and microinteractions. Pattern adapted, **no paid component source copied**.
- https://21st.dev/community/templates/free — strong editorial hierarchy/hero composition research. No template copied.
- https://21st.dev/ and https://21st.dev/@jahed/components/cinematic-landing-hero — cinematic photographic hero and intentional scene transitions adapted, without copying licensed source.
- https://styles.refero.design/?sort=popular — intentional negative space, restrained color scale, differentiated service list hierarchy.
- https://liquidglassdesign.com/ — functional translucent nav and controlled modal layering. Native backdrop-filter, no heavy glass-refractive React runtime.
- https://www.fontshare.com/ — Satoshi Latin font CSS, paired with Cyrillic-ready Unbounded/Golos Text.
- https://motion.dev/docs — Motion for JavaScript loaded as optional enhancement, graceful fallback when CDN is offline or reduced motion is enabled.
- https://github.com/jakubkrehel/skills — UI clarity, spacing, typography, form/accessibility checklist.
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill — intentional visual direction/anti-pattern review.
- https://github.com/davila7/claude-code-templates — frontend QA and UX review process; no unknown hooks or MCPs installed.
- https://github.com/meta/astryx — React + StyleX design-system context only, see Astryx above.

## Business facts
Public listing reviewed: https://yandex.com/maps/org/abm_motors/207066786029/ and user-provided https://yandex.ru/maps/org/avm_motors/136576810690/ . Address Krasnodar, Pamirskaya 2/1, phone +7 (928) 411-23-15. Gallery uses 8 direct Yandex public photo URLs; real owners retain rights. Ratings 5.0/101 are a snapshot dated 2026-11-19, not live. Price cues are explicitly unverified, not a binding public pricelist. Commercial photo use requires permission.

## Conversion and data model
Four-step dialog: issue → brand/model/year → symptoms + time → name + optional phone, with validation, prior/next, accessible focus, summary, prepared copy + native share. **No backend, no storage, no real booking.** No private user data is transmitted by this demo.

## QA
Dedicated Playwright suite avm-motors-assets/tests/redline.spec.cjs, 320–1920px viewport checks, real screenshots, search, wizard, keyboard, gallery, phone, navigation, and no-JS essential content. Existing heritage QA remains isolated and unchanged in purpose.
