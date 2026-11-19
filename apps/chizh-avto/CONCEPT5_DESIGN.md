# CHIZH-AVTO — APPROVED DESIGN CONCEPT 5

This version implements the selected **premium modular showroom** concept in React/Vite. Reference rendering: ChatGPT design concept no. 5, approved by the user on 2026-11-19.

Visual foundations: official black/amber Chizh-Avto brand, black-and-gold curved floating header, cinematic full-image hero with actual car photos, cream curved service carousel, dark projects gallery with filters and verified two-photo comparison, official video overlay, campaign linking, light appointment-preference strip and responsive mobile bottom navigation.

**Facts and photos:** only official https://chizhavto.ru/ and verified project photos; existing catalog, prices, projects, offers, contacts and original source links retained. No unrelated stock imagery. The image comparison deliberately says "Фото 01 / Фото 02", NOT "до / после", because chronology cannot be asserted without evidence.

**Booking policy:** static GitHub Pages cannot confirm availability. Date/time controls create a *preferred appointment request* handed to the contact form and then prepared for the user's mail app. Do not present it as confirmed booking or real online availability.

**Technology:** React, Motion for React (reduced-motion aware), Embla carousel, Lucide; layout inspiration from 21st.dev / @jahed and Aceternity patterns, adapted to a distinct bespoke interface. No external UI kit is claimed as installed unless actually present in package.json.

**QA:** production Vite build, company-only media optimizer, Playwright desktop and mobile tests, screenshot artifacts. Only publish after CI success. Public URL: https://davidshaton2006-droid.github.io/parsing/chizh-avto/.
