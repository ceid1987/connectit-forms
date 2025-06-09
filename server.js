import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';

const dev = false; // must be false for production
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, err => {
    if (err) throw err;
    console.log(`> Server ready on http://localhost:${PORT}`);
  });
});
