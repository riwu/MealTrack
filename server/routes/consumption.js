const express = require('express');
const queries = require('../database/queries');

const router = express.Router();

router.get('/', (req, res, next) => {
  queries
    .getConsumption()
    .then(rows => res.send(
      rows.reduce((acc, { number, timestamp, ...item }) => {
        acc[number] = {
          ...acc[number],
          [timestamp]: [...((acc[number] || {})[timestamp] || []), item],
        };
        return acc;
      }, {}),
    ))
    .catch(next);
});

router.post('/', (req, res, next) => {
  queries
    .addConsumption(req.body.flightNo, req.body.timestamp, req.body.items)
    .then(() => res.end())
    .catch(next);
});

module.exports = router;
