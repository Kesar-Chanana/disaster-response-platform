const express = require('express');
const router = express.Router();

function reportsRouter(io) {
  const reports = [];

  router.post('/', (req, res) => {
    const newReport = { id: reports.length + 1, ...req.body, verification_status: 'pending' };
    reports.push(newReport);
    io.emit('report_added', newReport);
    res.status(201).json(newReport);
  });

  return router;
}

module.exports = { reportsRouter };
