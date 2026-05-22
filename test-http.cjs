const http = require('http');
const req = http.request({ hostname: 'localhost', port: 3000, path: '/', method: 'GET', timeout: 5000 }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body (first 100 chars):', data.substring(0, 100));
    process.exit(0);
  });
});
req.on('error', e => { console.error('Error:', e.message); process.exit(1); });
req.on('timeout', () => { console.error('Timeout'); req.destroy(); process.exit(1); });
req.end();
