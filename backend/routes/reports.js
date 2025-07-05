const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Adjust path

function reportsRouter(io) {
  router.post('/', async (req, res) => {
    const {
      disaster_id,
      user_id,
      content,
      image_url
    } = req.body;

    const newReport = {
      disaster_id: parseInt(disaster_id),
      user_id,
      content,
      image_url,
      verification_status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('reports')
      .insert(newReport)
      .select();

    if (error) {
      console.error('Supabase insert error (report):', error);
      return res.status(500).json({ error: 'Failed to save report' });
    }

    io.emit('report_added', data[0]);
    res.status(201).json(data[0]);
  });

  return router;
}

module.exports = { reportsRouter };
