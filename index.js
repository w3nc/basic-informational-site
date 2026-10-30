// Basic Informational Site - plain Node.js (no frameworks)
// Run with: node index.js   ->  http://localhost:8080

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = process.env.PORT || 8080;

// Map each URL to the file that should be served for it.
// The keys are written without a leading slash or the .html extension, so
// both "/about" and "/about.html" reach about.html.
const routes = {
  '': 'index.html',
  'index': 'index.html',
  'about': 'about.html',
  'contact-me': 'contact-me.html',
  '404': '404.html',
};

// Simple static asset: the one stylesheet the pages use.
const assets = {
  '/styles.css': { file: 'styles.css', type: 'text/css; charset=utf-8' },
};

// Serve one file with the right status code and content type.
async function sendPage(res, fileName, statusCode, contentType = 'text/html; charset=utf-8') {
  try {
    const filePath = path.join(__dirname, fileName);
    const body = await fs.readFile(filePath, 'utf8');
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(body);
  } catch (error) {
    // The file is missing or unreadable - fall back to a plain text error
    // so the server never hangs or crashes.
    console.error(`Could not read ${fileName}:`, error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 - Internal Server Error');
  }
}

const server = http.createServer(async (req, res) => {
  // Keep only the path: drop any ?query=string, trailing slashes and the
  // leading slash, and ignore a trailing .html so "/about" and "/about.html"
  // both work.
  const pathname = (req.url.split('?')[0].replace(/\/+$/, '').replace(/^\.?\//, '') || '')
    .replace(/\.html$/i, '');

  const fileName = routes[pathname];
  const asset = assets['/' + pathname];

  if (fileName) {
    await sendPage(res, fileName, 200);
  } else if (asset) {
    await sendPage(res, asset.file, 200, asset.type);
  } else {
    // Any URL that is not listed above gets the 404 page.
    await sendPage(res, '404.html', 404);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
