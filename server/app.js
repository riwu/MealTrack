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

app.use('/consumption', consumption);

module.exports = app;
