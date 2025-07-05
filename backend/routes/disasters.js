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
      location: `POINT(${lon} ${lat})`,
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

  // PUT /disasters/:id → update disaster
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
      title,
      location_name,
      description,
      tags,
      lat,
      lon
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (location_name !== undefined) updates.location_name = location_name;
    if (description !== undefined) updates.description = description;
    if (tags !== undefined) updates.tags = tags;
    if (lat !== undefined && lon !== undefined) {
      updates.location = `POINT(${lon} ${lat})`;
    }

    // Get existing audit trail
    const { data: existing, error: fetchError } = await supabase
      .from('disasters')
      .select('audit_trail')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch disaster for update' });
    }

    const newTrail = existing.audit_trail || [];
    newTrail.push({
      action: 'update',
      user_id: 'netrunnerX',
      timestamp: new Date().toISOString()
    });

    updates.audit_trail = newTrail;

    const { data, error } = await supabase
      .from('disasters')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update disaster' });
    }

    io.emit('disaster_updated', data[0]);
    res.json(data[0]);
  });

  // DELETE /disasters/:id → delete disaster
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { data: existing, error: fetchError } = await supabase
      .from('disasters')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error before delete:', fetchError);
      return res.status(404).json({ error: 'Disaster not found' });
    }

    const { error } = await supabase
      .from('disasters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Failed to delete disaster' });
    }

    io.emit('disaster_updated', { deleted_id: id });
    res.json({ message: 'Disaster deleted successfully' });
  });

  return router;
}

module.exports = { disastersRouter };
