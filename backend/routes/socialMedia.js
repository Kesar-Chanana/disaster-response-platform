const express = require('express');
const router = express.Router();

function socialMediaRouter(io) {
  router.get('/', (req, res) => {
    const mockPosts = [
      { user: "citizen1", post: "#floodrelief Need food in NYC" },
      { user: "volunteer2", post: "Offering shelter in Brooklyn #earthquake" }
    ];
    io.emit('social_media_updated', mockPosts);
    res.json(mockPosts);
  });

  return router;
}

module.exports = { socialMediaRouter };
