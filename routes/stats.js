const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const db = require('../system/database');

router.get('/', asyncHandler(async function(req, res, next) {
  const { country } = req.query;
  try {
    const results = await getStats(country);
    return res.json(results);
  }
  catch (error) {
    console.log('[/stats] error', error);
    return res.json(error);
  }
}));

async function getStats(country) {
  const conn = db.conn.promise();
  let query = '';
  const args = [];

  if (!country) {
    query = `SELECT SUM(num_confirm) AS num_confirm, SUM(num_suspect) AS num_suspect, SUM(num_dead) AS num_dead, SUM(num_heal) AS num_heal, created
FROM tencent_data_by_country
GROUP BY created
ORDER BY created
LIMIT 1`;
  }
  else {
    query = `
SELECT country, num_confirm, num_suspect, num_dead, num_heal, created
FROM tencent_data_by_country
WHERE country = ? 
ORDER BY created 
LIMIT 1
`;

    args.push(country);
  }

  let result = await conn.query(query, args);
  return result[0];
}

module.exports = router;