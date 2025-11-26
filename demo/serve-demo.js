#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const folder = path.join(__dirname);
const port = process.env.PORT || process.argv[2] || 8000;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain'
};

function getLocalIPs() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
}

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/api-demo.html';
    const filePath = path.join(folder, reqPath);
    if (!filePath.startsWith(folder)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, {'Content-Type':'text/plain'});
        res.end('Not found');
        return;
      }
      if (stats.isDirectory()) {
        res.writeHead(301, { Location: (reqPath.endsWith('/') ? reqPath : reqPath + '/') });
        res.end();
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', () => { res.writeHead(500); res.end('Server error'); });
    });
  } catch (e) {
    res.writeHead(500); res.end('Server error');
  }
});

server.listen(port, () => {
  const ips = getLocalIPs();
  console.log('Serving demo from', folder);
  console.log('Open locally: http://localhost:' + port + '/api-demo.html');
  if (ips.length) console.log('On your network: ' + ips.map(ip => `http://${ip}:${port}/api-demo.html`).join(' \n'));
  console.log('Press CTRL+C to stop');
});
