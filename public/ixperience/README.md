# iXperience homepage clone

A static duplicate of the https://www.ixperience.co/ homepage with two additions:

- **Dark mode toggle** — persisted in `localStorage` (`ix-theme`), defaults to the
  operating system's `prefers-color-scheme`.
- **English/Spanish toggle** — persisted in `localStorage` (`ix-lang`), defaults
  to English.

Served by Vite from `public/`, so with `npm run dev` running the page is at
http://localhost:5173/ixperience/.

Only the homepage is captured; links to other iXperience pages point back at the
live site.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The captured Webflow markup, with third-party analytics (GTM, Clarity, GrowSurf, Reddit pixel) stripped. Images, fonts and videos still load from the original CDN. |
| `assets/ix-dark.css` | Generated dark palette: every colour rule of the Webflow stylesheet, re-emitted under `html.ix-dark`. |
| `assets/ix-enhance.css` | The floating toggle control plus hand-written dark-theme fixups. |
| `assets/ix-i18n.js` | Spanish copy, keyed by the English source text. |
| `assets/ix-enhance.js` | Toggle behaviour: theme class, translation walker, and the runtime pass that recolours the inline styles Webflow's interactions write. |
| `tools/generate-dark-css.py` | Regenerates `assets/ix-dark.css`. |

## Regenerating the dark stylesheet

```bash
curl -s "$(grep -o 'https://[^"]*webflow.shared[^"]*css' index.html | head -1)" -o /tmp/ixmain.css
python3 tools/generate-dark-css.py /tmp/ixmain.css assets/ix-dark.css
```

## Adding Spanish copy

Add an entry to `assets/ix-i18n.js` keyed by the exact English string. Keys are
matched on whitespace-normalised text nodes, so a phrase split across elements
must be added as its individual parts.
