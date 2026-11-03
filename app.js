// Basic Informational Site - rewritten with Express
// Run with: node app.js   ->  http://localhost:8080

const express = require('express');
const path = require('node:path');

const app = express();

// The port comes from the environment when it is set (useful on a hosting
// service), otherwise we fall back to 8080 like the plain-Node version did.
const PORT = process.env.PORT || 8080;

// Send one of our HTML files. sendFile needs an absolute path, which is what
// path.join(__dirname, ...) gives us.
function sendPage(res, fileName, statusCode = 200) {
  res.status(statusCode).sendFile(path.join(__dirname, fileName), (error) => {
    if (error) {
      console.error(`Could not send ${fileName}:`, error.message);
      // Only send a fallback if we have not already started the response.
      if (!res.headersSent) {
        res.status(500).send('500 - Internal Server Error');
      }
    }
  });
}

// One route per page. Each route takes a list of paths, so both the clean URL
// (/about) and the file-style URL (/about.html) land on the same page - that
// keeps the links in the HTML working, and the pages still open on their own
// from disk.
app.get(['/', '/index', '/index.html'], (req, res) => sendPage(res, 'index.html'));

app.get(['/about', '/about.html'], (req, res) => sendPage(res, 'about.html'));

app.get(['/contact-me', '/contact-me.html'], (req, res) =>
  sendPage(res, 'contact-me.html')
);

// The stylesheet lives next to the HTML files, so it gets its own route.
// res.sendFile works out the Content-Type from the .css extension.
app.get('/styles.css', (req, res) => sendPage(res, 'styles.css'));

// Anything that matched no route above falls through to here. In Express the
// order matters: this is last, so it only runs when nothing else answered.
app.use((req, res) => sendPage(res, '404.html', 404));

app.listen(PORT, (error) => {
  // Without this, a startup error (such as the port being taken) would fail
  // silently instead of telling us what went wrong.
  if (error) {
    throw error;
  }
  console.log(`Express server running at http://localhost:${PORT}`);
});
