# Alessandro Pet Spa — Website Handover

Static website for Alessandro Pet Spa, 7221 Melrose Ave, Los Angeles, CA 90046.
No build step, no backend, no database, no API keys, no analytics.

## Run / deploy
- Open `index.html`, or serve the folder with any static host
  (GitHub Pages, Netlify, Cloudflare Pages, etc.).
- Deploy = publish this whole folder as-is. Nothing to compile.
- If the site moves from a subpath (e.g. `/alessandro-pet-spa/`) to a
  custom domain root, no code changes are needed — all paths are relative.

## Where things live
- All page text, prices, hours: `index.html`
- Design (colours, layout): `assets/css/spa.css`
- Behaviour (animations, Reveal drag, booking form): `assets/js/spa.js`
- Photos/fonts: `assets/img/`, `assets/fonts/` — photo credits in `humans.txt`

## Booking form — read this
- The form validates in the browser, then opens the visitor's email app
  with the request pre-filled and addressed to **alessandropetspa@yahoo.com**.
  The visitor presses Send. There is no silent online submission and
  nothing is stored.
- To get silent in-page submissions instead, connect a form service
  (e.g. Formspree / Web3Forms) to the form in `index.html` (`id="bookForm"`)
  and remove the `mailto:` step in `assets/js/spa.js`.

## Notes
- Daycare prices shown ($30 half / $55 full / $85 overnight) are the spa's
  published prices. No other service prices are published, so none are shown.
- The Reveal (before/after) uses two similar shih tzus for illustration —
  the caption on the page says so.
- The map in the Booking section is a public Google Maps embed of the
  spa's address. No API key.
- `404.html` is the designed not-found page; GitHub Pages and most static
  hosts serve it automatically.

## Transfer checklist
- [ ] Repo transferred to / shared with the client's GitHub account
- [ ] Client told: form works by email (see above), no analytics installed
- [ ] Client has this guide
