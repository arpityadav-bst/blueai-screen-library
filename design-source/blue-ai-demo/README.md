# blue-ai-demo

Standalone copy of the Blue AI "hire an AI worker" home page demo.

## Files
- `index.html` — homepage hero with an embedded live demo panel
- `app.html` — the hire to chat to budget to download widget (loaded by the hero iframe)

## Running locally
Both files are static. Serve the folder over HTTP so the iframe loads:

```
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

Opening `index.html` directly from the filesystem also works in most browsers.

## Notes
- The chat calls a public Supabase Edge Function (`/functions/v1/chat`) that proxies the LLM, so the widget works wherever these files are served.
- The hero iframe uses a relative `app.html` path, so the design is portable (repo root, GitHub Pages, any static host).
