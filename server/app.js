const express = require('express');
const logger = require('morgan');
const consumption = require('./routes/consumption');

const app = express();

app.get('/', (req, res) => {
  res.end(); // for health check
});
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204); // for browser request
});

app.use(
  logger((tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens['response-time'](req, res),
    'ms',
    req.headers['x-forwarded-for'],
    JSON.stringify(req.body),
  ].join(' ')),
);

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  console.log('Allowing CORS');
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

app.use('/consumption', consumption);

module.exports = app;
