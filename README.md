# SEYTRONS

Development and test instructions

Run a quick static server from the project root (Python 3):

```bash
# from project root
python -m http.server 8000
# then open http://localhost:8000 in a browser
```

Or use Node (if installed):

```bash
npx serve -s . -l 8000
```

Smoke test (browser): open `tests/lang-smoke.html` in your browser while the server is running. It will attempt to change language and show PASS/FAIL on the page.

Next tasks:

- Verify `languageSelect` in Settings populates and switching languages updates UI.
- Wire dynamic strings in `framing/script.js` to `i18n.translate` (some are already wired).
- Remove or implement PyScript if you intend to use Python in the browser.
- Optionally add automated headless tests (Puppeteer).
