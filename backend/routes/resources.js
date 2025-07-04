const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Replace with your actual values or use .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/:id/resources', async (req, res) => {
  const { lat, lon } = req.query;
  const { id } = req.params;

  if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude required' });

  try {
    const { data, error } = await supabase.rpc('nearby_resources', {
      disaster_id_input: id,
      search_point: `SRID=4326;POINT(${lon} ${lat})`,
      radius_km: 10
    });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { resourceRouter: router };
