const express = require('express');
const queries = require('../database/queries');

const router = express.Router();

router.post('/', (req, res, next) => {
  queries
    .addConsumption(req.body.flightNo, req.body.timestamp, req.body.items)
    .then(() => res.end())
    .catch(next);
});

module.exports = router;
