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
      updates.push({
        title: $(el).text().trim(),
        url: 'https://reliefweb.int' + $(el).attr('href')
      });
    });

    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

module.exports = { updatesRouter: router };
