const path = require('path');

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.post('/campaigns/201/receivers', (req, res) => {
  res.statusCode = 201;
  res.jsonp([{}]);
});

server.get('/campaigns/201/receivers', (req, res) => {
  res.statusCode = 200;
  res.jsonp({
    customer_id: '1',
    video_url: 'https://www.youtube.com/watch?v=mHONNcZbwDY',
    thumbnail_url:
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    email_sent: true,
    sms_sent: false,
  });
});

server.post('/campaigns/500/receivers', (req, res) => {
  throw 'thrown error';
});

server.post('/campaigns/400/receivers', (req, res) => {
  res.statusCode = 400;
  res.jsonp([
    {
      customer_id: ['A receiver with this ID already exists.'],
    },
  ]);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// Use default router
server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running');
});
