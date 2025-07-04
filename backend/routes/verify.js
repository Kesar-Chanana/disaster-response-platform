const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { image_url } = req.body;
  // Mock Gemini analysis
  res.json({ status: 'verified', manipulation_detected: false });
});

module.exports = { verifyImageRouter: router };
