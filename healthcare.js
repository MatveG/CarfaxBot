import http from 'http';

const options = {
  host: 'localhost',
  path: '/healthcare',
  port: process.env.PORT || 3000,
  timeout: 3000,
};

http.request(options, (res) => {
  console.log(res.statusCode);
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', (err) => {
  console.log(err);
  process.exit(1);
}).end();
