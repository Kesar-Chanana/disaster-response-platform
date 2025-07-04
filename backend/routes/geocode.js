const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { description } = req.body;
  // Mocking Gemini + Mapbox/Google
  const locationName = "Manhattan, NYC"; // extracted by Gemini
  const lat = 40.7831, lon = -73.9712;
  res.json({ location_name: locationName, lat, lon });
});

module.exports = { geocodeRouter: router };
