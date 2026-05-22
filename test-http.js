const http = require('http');
const req = http.request({ hostname: 'localhost', port: 3000, path: '/', method: 'GET', timeout: 5000 }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data.substring(0, 200)));
});
req.on('error', e => console.error('Error:', e.message));
req.on('timeout', () => { console.error('Timeout!'); req.destroy(); });
req.end();
