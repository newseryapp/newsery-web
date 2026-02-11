# Netlify artifact audit (newsery-web)

Date: 2026-02-11

Goal: Identify Netlify-specific artifacts and remove only LOW-risk items without changing current Coolify production behavior (no routing/URL changes).

## Findings (with risk)

- `netlify.toml` → `netlify.toml` → Netlify-only build config (`publish="."`) and a redirect rule (`/get-the-app` → `/.netlify/functions/get-the-app`). Coolify/static hosting does not read this file. **Risk: LOW**
- `netlify/` → `netlify/functions/get-the-app.js` → Netlify Function handler (Basic Auth gate that 302s to `/download.html`). Referenced only by `netlify.toml`; no references from site HTML/JS. **Risk: LOW**
- `.netlify/` → (not found) → No Netlify build cache directory committed. **Risk: LOW**
- `_redirects` → (not found) → No Netlify redirects file present. **Risk: LOW**
- `_headers` → (not found) → No Netlify headers file present. **Risk: LOW**
- `/.netlify/functions/*` calls → (not found outside `netlify.toml`) → No runtime calls from the static site were found. **Risk: LOW**
- `netlify` keyword occurrences → (only in `netlify.toml`) → No other references in the repo. **Risk: LOW**
- `package.json` Netlify deps/scripts → (no `package.json`) → Not applicable for this repo. **Risk: LOW**

## Evidence (search results summary)

- `rg -n "netlify" -S .` → only `netlify.toml`
- `rg -n "\\.netlify/functions/|/\\.netlify/functions/|\\.netlify/functions" -S .` → only `netlify.toml`

## Removal decision (per safety rules)

Eligible for deletion (LOW only):

- `netlify.toml`
- `netlify/functions/get-the-app.js` (and the now-unused `netlify/` directory), since there are no `/.netlify/functions/*` runtime references and no imports/requires in the repo.

Not eligible for deletion:

- None detected (no MED/HIGH findings).

