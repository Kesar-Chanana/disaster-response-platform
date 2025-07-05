const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('../supabaseClient');

// POST /disasters/:id/verify-image
router.post('/:id/verify-image', async (req, res) => {
  const { id } = req.params;
  const { image_url, user_id = 'citizen1' } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    // 1. Call Gemini API
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze image at ${image_url} for signs of manipulation or disaster context.`
              }
            ]
          }
        ]
      }
    );

    const geminiText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    const verificationStatus = geminiText.toLowerCase().includes('manipulated') ? 'rejected' : 'verified';

    // 2. Save result in reports table
    const { data, error } = await supabase
      .from('reports')
      .insert({
        disaster_id: id,
        user_id,
        content: `Image submitted: ${image_url}`,
        image_url,
        verification_status: verificationStatus
      })
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save verification result' });
    }

    // 3. Return result
    res.json({
      message: 'Image verification completed',
      verification_status: verificationStatus,
      gemini_summary: geminiText,
      report: data[0]
    });

  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Gemini API call failed' });
  }
});

module.exports = { verifyImageRouter: router };
