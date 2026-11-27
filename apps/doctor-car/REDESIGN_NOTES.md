# Doctor Car — website visual rebuild, 28 November 2026

## Approved direction
Work is based on the user's automotive reference composition, with Huly-inspired UI tokens (near-black / white alternating bands, narrow electric-iris to coral aurora in the hero, pill controls, minimal borders/shadows, Inter typography). This is a responsive coded React/Vite website, **not an image mockup**.

The distinct visual narratives are: car-photo hero + interactive system cards; 6 unique automotive photo-led main service cards; additional technical vector service visuals; interactive top-down vehicle diagnostic scanner; five illustrated process stages; five distinctive schematic technical advantage cards; reviews sourced to Yandex rather than fabricated; contact panel with an explicitly decorative route diagram. Dark and light preferences remain available.

## Factual sources and demo limitations
Business listing: https://yandex.ru/maps/org/doktor_kar/114732639406/
Current 28 November 2026 Yandex Maps listing identifies Krasnodar, ul. imeni Zhloby, 50 (moved from No. 24), phone +7 (958) 609-21-57. Other directories still show the old address/phone; the up-to-date Yandex listing takes precedence. Published hours may vary; verify before visiting. Sources: https://yandex.kz/maps/org/doktor_kar/114732639406/ and https://yandex.kz/maps/ru/org/doktor_kar/1281207888/?lang=ru .
Services follow the original project notes and do not imply guaranteed parts, pricing, warranties, staff credentials or unverified reviews.
Email mail@dr-car.ru is only mentioned by an external catalog and should be confirmed. There is **no backend booking**. The form prepares a mailto draft or allows copying; users must send the inquiry themselves.

## Imagery
The images are thematic illustration, not photographs of this business. Photos are loaded from Unsplash CDN and covered by [Unsplash License](https://unsplash.com/license). Original URLs / photographers:
- Hero (studio SUV): https://unsplash.com/photos/a-black-car-is-shown-in-the-dark-vou-HfglNww
- Diagnostics (mechanic): https://unsplash.com/photos/mechanic-works-on-a-cars-engine-components-tjNRkdeUrp4
- Maintenance / oil (Tim Mossholder): https://unsplash.com/photos/man-refilling-motor-oil-on-car-engine-bay-V37iTrYZz2E
- Engine (Tim Bernhard): https://unsplash.com/photos/a-close-up-of-the-engine-of-a-car-nJl34obC1HM
- Suspension (Zoshua Colah): https://unsplash.com/photos/close-up-of-a-cars-suspension-and-wheel-assembly-fILglZMbipM
- Brakes (McLaren wheel): https://unsplash.com/photos/a-close-up-of-a-wheel-on-a-sports-car-0pAXr9CVhqw
- Steering: https://unsplash.com/photos/black-audi-steering-wheel-in-close-up-photography-NC6WJEX9nuY
External URLs make the photo gallery dependent on image CDN availability. Before production launch, review rights and host optimized assets locally.

## QA
Run npm install, npm run build, npm run test from apps/doctor-car. The GitHub Pages workflow assembles dist into /parsing/doctor-car/.
