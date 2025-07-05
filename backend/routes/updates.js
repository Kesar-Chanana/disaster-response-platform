const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/:id/official-updates', async (req, res) => {
  try {
    const { data } = await axios.get('https://reliefweb.int/');

    const $ = cheerio.load(data);
    const updates = [];

    $('article h3 a').slice(0, 5).each((i, el) => {
      const href = $(el).attr('href').trim();
      const fullUrl = href.startsWith('/') ? `https://reliefweb.int${href}` : href;

      updates.push({
        title: $(el).text().trim(),
        url: fullUrl
      });
    });

    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

module.exports = { updatesRouter: router };
