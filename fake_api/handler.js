const path = require('path');

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.post('/campaignvideos', (req, res) => {
  res.statusCode = 200;
  res.jsonp([{}]);
});

//if there is  data

server.get('/campaignvideos', (req, res) => {
  res.statusCode = 200;
  res.jsonp({
    records: [
      {
        fields: {
          customer_id: '1',
          thumbnail_url:
            'https://video.storm121.com/API-test/result/thumbnails/Volkan.mov.jpg',
          email_thumbnail_url:
            'https://video.storm121.com/API-test/result/thumbnails/Volkan.mov-mail.jpg',
          landing_page_url: 'https://play.seen.io/v/9aiNN/',
        },
      },
    ],
  });
});

//if there is no data yet
server.get('/campaigns', (req, res) => {
  res.statusCode = 200;
  res.jsonp({
    records: [
      {
        id: 'recb5kdYm2zCRMhEP',
        fields: {
          campaign_name: 'Test-Boys',
          token: 'Token 5c5737b42ae2d0df38b15b3db4c7c0e519421b35',
          campaign_slug: 'Test-Boys',
          active: true,
          fields:
            '[{"type":"text", "label_name":"Fist Name", "field_name" :"first_name", "default_value":""}]',
          last_modified_time: '2022-01-20T10:14:48.000Z',
        },
        createdTime: '2022-01-19T12:41:55.000Z',
      },
      {
        id: 'reczNz6ZwFpLGGOTV',
        fields: {
          campaign_name: 'Coop',
          extra_fields:
            '[{"type":"text", "label_name":"Age", "field_name" :"age", "default_value":""}]',
          token: 'Token cb4aa50f16ea6ecb2b6775b155f675995084e045',
          campaign_slug: 'seensales',
          active: true,
          fields:
            '[{"type":"text", "label_name":"Fist Name", "field_name" :"first_name", "default_value":""},{"type":"text", "label_name":"Last Name", "field_name":"last_name", "default_value":""}]',
          last_modified_time: '2022-01-20T10:13:59.000Z',
        },
        createdTime: '2022-01-19T12:41:55.000Z',
      },
    ],
  });
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
