# ЧИЖ-АВТО / FLAGSHIP DESIGN CONCEPT / 2026-11

## Why a rebuild
The earlier concept was a generic auto-service landing page: stock-grid imagery, repetitive cards and relatively ordinary interactions. It did not show the actual value of a customization and accessory installation business. This new version is **an interaction-driven automotive editorial**: the visitor chooses what they want to change in their car, explores the systems, examines published work and can initiate contact.

## Source-of-truth facts
- Official business site: https://chizhavto.ru/
- Branch: Krasnodar, ul. imeni Zhloby, 115. Contact number +7 (989) 199-00-22, email chizh-avto@mail.ru, daily 09:00–18:00: https://chizhavto.ru/contacts/
- Company describes itself as a certified automotive installation/tuning center with more than 20 years of experience: https://chizhavto.ru/company/
- Service categories and published FROM prices: https://chizhavto.ru/services/
- Examples of completed projects (Audi A6 headlamp 1 day / 7,500 ₽, Volkswagen Passat ambient lighting 6h / 18,500 ₽, Mercedes starry ceiling 1 week / 145,000 ₽): https://chizhavto.ru/projects/
- Yandex Maps card: https://yandex.ru/maps/org/chizh_avto/1266081535/

The public demo is not an authorized site of the company. The prices are historical public list/from prices, **not current quotes**; the photos are illustrative. No owner consent, brand permission or image rights to official project photos has been granted. On a real launch, confirm all information and replace illustrative visuals with approved originals.

## Deliberate art direction
- **Palette:** the amber and near-black Chizh-Avto identity carried forward from the earlier concept; amber #FFB22E, night #10100F, porcelain #F0EDE5; no random bright neon gradients.
- **Type:** Tektur + Golos Text (meaningful angular display vs readable Russian interface), fallback works without font CDN.
- **Composition:** cinematic photography, oversized optical typography, strong editorial negative space, bespoke technical dashboard and model, unboxed service index, horizontally browsable case sheets, contrasting proof chapter, minimal inquiry flow.
- **Copy:** precise, business-specific, avoids fake guarantees, fabricated awards, filler promises and empty 'premium' claims.
- **Motion system:** Motion for JavaScript (stagger, inView, scroll-linked hero depth, active-result transition); native CSS reveal, ring orbit, marquee, hover; responsive pointer tilt and restrained magnetic CTA. `prefers-reduced-motion` respected and no content concealed by JS.
- **Interaction system:** custom 5-mode config console with illustrated car zones, results and preselected mail inquiry; Embla-enhanced portfolio with native CSS scroll-snap fallback; accessible mobile menu, keyboard arrow mode selection, FAQ details, genuine map/telephone links.

## Skills/guides actually reviewed
- https://github.com/jakubkrehel/skills: better-interface (evidence-first audit), better-typography, better-layout, better-colors and UI detail; applied spacing hierarchy, semantic roles, responsive stress tests and no invented contrast measurement.
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill: priority guideline checklist (touch areas, keyboard access, responsive layout, motion with purpose, avoid emoji icons).
- https://github.com/meta/astryx: component-first accessible theming and token ideas. **Not installed**: actual Astryx package requires React 19+ and this isolated static GitHub Pages demo uses vanilla HTML. Adding React to fit a library would increase bundle complexity and create no actual user benefit.
- https://motion.dev/docs: vanilla JS `animate`, `inView`, `scroll`, `stagger` and reduced motion via matchMedia; imported as progressive enhancement.
- https://www.embla-carousel.com/docs/v8/: Embla Carousel 8.6.0 as optional drag-scroll enhancement.
- https://vercel.com/design/guidelines: accessibility, non-blocking controls, labels and clear form semantics.
- https://lenis.dev/: reviewed, **deliberately not added** to retain browser-native scrolling, avoid latency with maps and preserve accessibility.

## Local QA (offline Chromium)
Performed with a local inlined CSS/JS preview because this execution environment blocks live internet and local file/server navigation in Chromium. Remote image, Google Fonts, Motion and Embla could not be network-tested; they have native fallbacks. Checked desktop and mobile widths: 320, 390, 768, 1024, 1440 px, with JS enabled and disabled at 390 and 1440. All test widths had document.scrollWidth equal to window.innerWidth after fixing the marquee. Core content visible without JS. Interactive five-mode console tested: selecting 'Звучание' updates price to 4,000 ₽ and preselects 'Автозвук' in the inquiry form. HTML local links, input label associations and JS syntax checked. Browser screenshot test captured hero, console and sections.

**Not yet verified:** live deployment success, remote image/font/CDN loading, end-to-end actual outbound email, visual appearance under fully loaded online fonts and photo. Never report these as passed without real browser verification.

## Repository/deploy
One shared repo: https://github.com/davidshaton2006-droid/parsing; site path /chizh-avto/ and address https://davidshaton2006-droid.github.io/parsing/chizh-avto/. Existing other site folders were left untouched. Original Chizh site was archived in `chizh-avto/_archive/2026-11-19-v1/`. This version uses `chizh-avto/index.html`, `flagship.css`, `flagship.js`. Current GitHub Actions workflow publishes any commit to main.

## Production follow-up
Obtain approved real Chizh-Avto photos and branding, confirm current prices/portfolio rights, add authorized legal privacy/cookie policies (if collecting personal data), replace mailto with a real secure form backend and audit source traffic/conversion. Don't claim the fake booking works: no actual reservation can be created in the present static demo.