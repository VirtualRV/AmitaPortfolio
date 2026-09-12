const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const SUBMISSIONS_FILE = path.join(PUBLIC_DIR, 'contact-submissions.json');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const cleanUrl = req.url.split('?')[0].replace(/\/$/, '') || '/';

  // Handle Contact Form Submission API (POST /data, /api/contact, /contact)
  if ((cleanUrl === '/data' || cleanUrl === '/api/contact' || cleanUrl === '/contact') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const submission = JSON.parse(body);
        submission.receivedAt = new Date().toISOString();

        console.log('\n📬 [NEW CONTACT BRIEF RECEIVED]');
        console.log(`👤 Name:     ${submission.name}`);
        console.log(`✉️  Email:    ${submission.email}`);
        console.log(`🏢 Company:  ${submission.company || 'N/A'}`);
        console.log(`🎨 Services: ${submission.services}`);
        console.log(`⏱️  Timeline: ${submission.timeline}`);
        console.log(`📝 Details:  ${submission.details}`);
        console.log('--------------------------------------------------\n');

        let submissions = [];
        if (fs.existsSync(SUBMISSIONS_FILE)) {
          try {
            submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
          } catch (e) {
            submissions = [];
          }
        }
        submissions.unshift(submission);
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');
        try { fs.writeFileSync(path.join(PUBLIC_DIR, 'data.json'), JSON.stringify(submissions, null, 2), 'utf8'); } catch (e) {}

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify({ success: true, message: 'Brief received and saved to JSON file successfully', totalSubmissions: submissions.length }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // View stored submissions via GET /data, /data.json, /api/submissions, /api/data
  if ((cleanUrl === '/data' || cleanUrl === '/data.json' || cleanUrl === '/api/submissions' || cleanUrl === '/api/data') && req.method === 'GET') {
    let data = [];
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      try {
        data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
      } catch (e) {
        data = [];
      }
    }
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
