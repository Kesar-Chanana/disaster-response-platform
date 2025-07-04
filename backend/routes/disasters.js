const express = require('express');
const router = express.Router();

function disastersRouter(io) {
  const disasters = []; // in-memory for simplicity

  router.post('/', (req, res) => {
    const newDisaster = { id: disasters.length + 1, ...req.body };
    disasters.push(newDisaster);
    io.emit('disaster_updated', newDisaster);
    res.status(201).json(newDisaster);
  });

  router.get('/', (req, res) => {
    const { tag } = req.query;
    const result = tag ? disasters.filter(d => d.tags.includes(tag)) : disasters;
    res.json(result);
  });

  return router;
}

module.exports = { disastersRouter };
