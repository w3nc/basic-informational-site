# Basic Informational Site

The Odin Project — [Project: Basic Informational Site](https://www.theodinproject.com/lessons/nodejs-basic-informational-site),
built twice: once with plain Node.js, then rewritten with Express
([Introduction to Express](https://www.theodinproject.com/lessons/node-path-nodejs-introduction-to-express),
assignment step 2).

Four pages, one stylesheet, no database.

## Run it

The Express version:

```bash
cd basic-informational-site
npm install     # first time only
node app.js     # or: npm start
```

Then open <http://localhost:8080>.

The original plain-Node version still works: `node index.js` (or `npm run start:plain`).

Both use port 8080, so run one at a time — or give the second one another port.

Change the port: `PORT=3000 node app.js` (PowerShell: `$env:PORT=3000; node app.js`).

## Routes

| URL                                  | File              | Status |
| ------------------------------------ | ----------------- | ------ |
| `/` (also `/index`, `/index.html`)   | `index.html`      | 200    |
| `/about` or `/about.html`            | `about.html`      | 200    |
| `/contact-me` or `/contact-me.html`  | `contact-me.html` | 200    |
| `/styles.css`                        | `styles.css`      | 200    |
| anything else (`/banana`)            | `404.html`        | 404    |

Query strings are ignored, so `/about?ref=test` still shows the about page.

## Files

- `app.js` — **the Express server.** A few `app.get()` routes, then a final
  `app.use()` as the catch-all that sends the 404 page.
- `index.js` — the original plain-Node server (`http.createServer` + a route
  table). Kept for comparison.
- `index.html`, `about.html`, `contact-me.html`, `404.html` — the four pages.
  Their links are plain `about.html`-style links, so the pages also work if you
  just double-click one open with no server running.
- `styles.css` — a little shared styling so the pages are readable.
- `package.json` — `express` is the only dependency.

## Plain Node vs Express

Both versions answer the same URLs, but the shape of the code is different:

| Plain Node (`index.js`)                                | Express (`app.js`)                                  |
| ------------------------------------------------------ | --------------------------------------------------- |
| `http.createServer((req, res) => …)`, one function      | one `app.get()` per page                            |
| you parse `req.url` yourself (query, slash, `.html`)    | Express matches the path for you                    |
| `fs.readFile` + `res.writeHead` + `res.end`             | `res.status(…).sendFile(…)`                         |
| a route-object lookup, then your own 404 branch         | routes in order, final `app.use()` catches the rest |

## How the Express version works

`app.js` reads the port from `PORT` (falling back to 8080), then registers one
`app.get()` per page. Express walks the routes **in order** and runs the first
one whose path matches the request.

Each page route lists two paths — `/about` and `/about.html` — so the clean URL
and the file-style URL both resolve. `sendPage()` wraps
`res.status(code).sendFile(...)`: `sendFile` needs an absolute path, so the file
name is joined onto `__dirname`, and the error callback stops a missing file from
crashing the server.

The last `app.use((req, res) => …)` has no path, so it matches everything that
reached it unmatched, and it sends `404.html` with a real `404` status.
