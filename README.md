
#  Disaster Response Coordination Platform

A backend-heavy MERN stack application to coordinate and support disaster response with real-time updates, geospatial lookups, and official data integration.

---

##  Features

- **Disaster Management**: Create, update, and track disasters with title, location, description, and tags.
- **Location Extraction & Geocoding**: Extract location from descriptions using Google Gemini API and geocode with Mapbox.
- **Image Verification**: Validate disaster images using Google Gemini Vision API.
- **Social Media Monitoring**: Fetch relevant mock posts for disaster events and emit real-time updates.
- **Official Updates Aggregation**: Scrape and serve latest updates from reliefweb.int.
- **Geospatial Resource Mapping**: Query nearby shelters/resources using Supabase geospatial features.
- **Caching**: Use Supabase for API response caching (1hr TTL) to reduce rate limit issues.
- **WebSocket Integration**: Real-time updates for disasters, social media, and resource data via Socket.IO.
- **Minimal Frontend**: A simple frontend with HTML and JavaScript for interacting with the backend.

---

##  Folder Structure

```
.
├── routes/
│   ├── disasters.js
│   ├── reports.js
│   ├── geocode.js
│   ├── socialMedia.js
│   ├── verify.js
│   ├── resources.js
│   └── updates.js
├── index.html
└── server.js
```

---

##  Technologies Used

- **Node.js + Express.js** – API & backend logic
- **Supabase (PostgreSQL)** – Data storage, geospatial queries, caching
- **Socket.IO** – Real-time communication
- **Google Gemini API** – Location extraction & image verification
- **Mapbox API** – Geocoding
- **Cheerio + Axios** – Web scraping for official updates
- **Frontend** – Minimal vanilla HTML + JS

---
##  How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file**:
   ```
   SUPABASE_URL=<your_supabase_url>
   SUPABASE_KEY=<your_supabase_key>
   GEMINI_API_KEY=<your_google_gemini_api_key>
   MAPBOX_API_KEY=<your_mapbox_key>
   ```

3. **Run the server**:
   ```bash
   node server.js
   ```

4. **Open the app**:
   - Open `index.html` in your browser to test APIs.

---

##  Real-Time Events

| Event                | Triggered On                     |
|---------------------|----------------------------------|
| `disaster_updated`  | Create/Update/Delete disaster    |
| `resources_updated` | New geospatial resource query    |
| `social_media_updated` | New mock social posts fetched |

---

##  API Endpoints Summary

###  Disaster APIs

- `POST /disasters` – Create disaster
- `GET /disasters` – Get all disasters
- `PUT /disasters/:id` – Update disaster
- `DELETE /disasters/:id` – Delete disaster

###  Geocoding

- `POST /geocode` – Extract + geocode location from text

###  Image Verification

- `POST /disasters/:id/verify-image` – Verify image with Gemini

###  Nearby Resources

- `GET /disasters/:id/resources?lat=...&lon=...` – Find resources near coordinates

###  Social Media

- `GET /disasters/:id/social-media` – Fetch mock social media updates

###  Official Updates

- `GET /disasters/:id/official-updates` – Scrape & serve updates from reliefweb

---

##  AI Tool Usage

- **Cursor/Windsurf** used for:
  - WebSocket logic generation
  - Supabase RPC queries
  - Route scaffolding and cache integration

---

##  Mock Auth

Users are hardcoded:
- `netrunnerX`
- `reliefAdmin`

Roles: `admin`, `contributor` (for future auth logic expansion)

---

##  Sample Data

```json
{
  "title": "NYC Flood",
  "location_name": "Manhattan, NYC",
  "description": "Heavy flooding in Manhattan",
  "tags": ["flood", "urgent"],
  "owner_id": "netrunnerX"
}
```

---

##  Notes

- Rate-limited APIs use caching.
- Location extracted from Gemini is then geocoded with Mapbox.
- Image verification and caching logic stored in Supabase `cache` table.
- Use `disasters`, `resources`, and `reports` tables with proper indexes (GIST/GIN).
- Browser-based frontend is lightweight and aligned with test needs.




