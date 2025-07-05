const express = require('express');
const router = express.Router();

function socialMediaRouter(io) {
  // This matches /disasters/:id/social-media
  router.get('/:id/social-media', (req, res) => {
    const { id } = req.params;

    const mockPosts = [
      { user: "citizen1", post: `#floodrelief Need food in NYC for disaster ${id}` },
      { user: "volunteer2", post: `Offering shelter in Brooklyn for event ${id}` }
    ];

    io.emit('social_media_updated', mockPosts);
    res.json(mockPosts);
  });

  return router;
}

module.exports = { socialMediaRouter };
 