import http from 'http';

const req = http.get('http://localhost:5000/api/v1/vendor/b2b/analytics', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});
req.on('error', console.error);
