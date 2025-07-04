const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Adjust path if needed

function disastersRouter(io) {
  // POST /disasters → create a new disaster
  router.post('/', async (req, res) => {
    const {
      title,
      location_name,
      description,
      tags,
      lat = 40.7128,
      lon = -74.0060
    } = req.body;

    const newDisaster = {
      title,
      location_name,
      description,
      tags,
      owner_id: 'netrunnerX',
      location: `POINT(${lon} ${lat})`, // Supabase expects "POINT(lon lat)"
      audit_trail: [{
        action: 'create',
        user_id: 'netrunnerX',
        timestamp: new Date().toISOString()
      }]
    };

    const { data, error } = await supabase
      .from('disasters')
      .insert(newDisaster)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create disaster' });
    }

    io.emit('disaster_updated', data[0]);
    res.status(201).json(data[0]);
  });

  // GET /disasters?tag=flood → fetch disasters, optionally filter by tag
  router.get('/', async (req, res) => {
    const { tag } = req.query;

    let query = supabase
      .from('disasters')
      .select('*')
      .order('created_at', { ascending: false });

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch disasters' });
    }

    res.json(data);
  });

  return router;
}

module.exports = { disastersRouter };
