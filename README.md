# Basic Informational Site

The Odin Project — [Project: Basic Informational Site](https://www.theodinproject.com/lessons/nodejs-basic-informational-site).

A tiny four-page site served by plain Node.js. No Express, no dependencies.

## Run it

```bash
cd basic-informational-site
node index.js
```

Then open <http://localhost:8080>.

Change the port if you need to: `PORT=3000 node index.js` (PowerShell: `$env:PORT=3000; node index.js`).

## Routes

| URL                                  | File              | Status |
| ------------------------------------ | ----------------- | ------ |
| `http://localhost:8080`              | `index.html`      | 200    |
| `/about` or `/about.html`            | `about.html`      | 200    |
| `/contact-me` or `/contact-me.html`  | `contact-me.html` | 200    |
| anything else (`/banana`)            | `404.html`        | 404    |

Trailing slashes (`/about/`) work too, and query strings are ignored.

## Files

- `index.js` — the server. A route table maps a URL to a file; unknown URLs fall back to `404.html`.
- `index.html`, `about.html`, `contact-me.html`, `404.html` — the four pages. Their links
  are plain `about.html`-style links, so the pages also work if you just double-click one
  of the files open, with no server running.
- `styles.css` — a little shared styling so the pages are readable.

## How it works

`http.createServer` receives every request. The server trims the query string,
trailing slashes and a trailing `.html` off `req.url`, looks the result up in the
`routes` object, and sends back the matching HTML file with `fs.readFile`. If the
lookup misses, it sends `404.html` with a real `404` status code.
