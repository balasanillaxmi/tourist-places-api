# Laxmi's Top Favourite Places in the World — REST API

A simple Node.js + Express REST API and static front-end for browsing 10 of the
world's most breathtaking tourist destinations.

## Tech Stack

- Node.js
- Express
- CORS enabled
- SQLite (via `better-sqlite3`) for persistent storage

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. The server listens on port `3000` and binds to `0.0.0.0` (deploy-ready for a
   VM/EC2 instance). Open in a browser:

   - Local: http://localhost:3000/
   - Hosted: http://<your-server-ip>/tourist-places-api/api/places
     (e.g. http://65.0.104.155/tourist-places-api/api/places)

## Database

Data is stored in a local SQLite database file (`data/places.db`), managed through
`data/db.js`. On first run, the `places` table is created automatically and seeded
with the original 10 places from `data/seedPlaces.js`. All POST/PUT/DELETE requests
persist to this file, so data survives server restarts **when run locally**.

> **Note on Render's free tier:** Render's free instances use an ephemeral
> filesystem — any file written at runtime (including `places.db`) is reset on
> every redeploy or when the service sleeps and wakes back up. For data to persist
> permanently on a hosted deployment, you'd need a paid persistent disk or an
> externally hosted database (e.g. MongoDB Atlas). Locally, persistence works
> exactly as expected.

## Base Path

```
/tourist-places-api/api/places
```

## Endpoints (Postman-ready)

### 1. GET all places

**Request**

```
GET /tourist-places-api/api/places
```

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Banff National Park",
    "country": "Canada",
    "continent": "North America",
    "description": "Canada's oldest national park, famous for turquoise glacial lakes and snow-capped Rocky Mountain peaks. It offers world-class hiking, wildlife spotting, and skiing throughout the year.",
    "imageUrl": "https://loremflickr.com/800/600/banff,nationalpark"
  },
  {
    "id": 2,
    "name": "Mount Fuji",
    "country": "Japan",
    "continent": "Asia",
    "description": "Japan's tallest peak and an iconic, near-symmetrical volcano revered as a sacred site. It draws climbers during the summer season and photographers year-round for its stunning views over Lake Kawaguchi.",
    "imageUrl": "https://loremflickr.com/800/600/mountfuji"
  }
]
```

*(response includes all 10 places)*

---

### 2. GET a single place by id

**Request**

```
GET /tourist-places-api/api/places/1
```

**Response** `200 OK`

```json
{
  "id": 1,
  "name": "Banff National Park",
  "country": "Canada",
  "continent": "North America",
  "description": "Canada's oldest national park, famous for turquoise glacial lakes and snow-capped Rocky Mountain peaks. It offers world-class hiking, wildlife spotting, and skiing throughout the year.",
  "imageUrl": "https://loremflickr.com/800/600/banff,nationalpark"
}
```

**Response (not found)** `404 Not Found`

```json
{
  "error": "Place with id 999 not found."
}
```

---

### 3. POST a new place

**Request**

```
POST /tourist-places-api/api/places
Content-Type: application/json
```

```json
{
  "name": "Santorini",
  "country": "Greece",
  "continent": "Europe",
  "description": "A stunning volcanic island known for whitewashed buildings and blue-domed churches overlooking the Aegean Sea.",
  "imageUrl": "https://loremflickr.com/800/600/santorini"
}
```

**Response** `201 Created`

```json
{
  "id": 11,
  "name": "Santorini",
  "country": "Greece",
  "continent": "Europe",
  "description": "A stunning volcanic island known for whitewashed buildings and blue-domed churches overlooking the Aegean Sea.",
  "imageUrl": "https://loremflickr.com/800/600/santorini"
}
```

**Response (validation error)** `400 Bad Request`

```json
{
  "error": "Missing required fields. 'name', 'country', 'continent', and 'description' are required."
}
```

---

### 4. PUT update a place

**Request**

```
PUT /tourist-places-api/api/places/11
Content-Type: application/json
```

```json
{
  "description": "A romantic Greek island famous for its dramatic caldera views and stunning sunsets over the Aegean Sea."
}
```

**Response** `200 OK`

```json
{
  "id": 11,
  "name": "Santorini",
  "country": "Greece",
  "continent": "Europe",
  "description": "A romantic Greek island famous for its dramatic caldera views and stunning sunsets over the Aegean Sea.",
  "imageUrl": "https://loremflickr.com/800/600/santorini"
}
```

**Response (not found)** `404 Not Found`

```json
{
  "error": "Place with id 999 not found."
}
```

---

### 5. DELETE a place

**Request**

```
DELETE /tourist-places-api/api/places/11
```

**Response** `200 OK`

```json
{
  "message": "Place deleted successfully.",
  "place": {
    "id": 11,
    "name": "Santorini",
    "country": "Greece",
    "continent": "Europe",
    "description": "A romantic Greek island famous for its dramatic caldera views and stunning sunsets over the Aegean Sea.",
    "imageUrl": "https://loremflickr.com/800/600/santorini"
  }
}
```

**Response (not found)** `404 Not Found`

```json
{
  "error": "Place with id 999 not found."
}
```

---

## Error Handling

All errors return JSON with an `error` field and an appropriate status code:

- `400 Bad Request` — invalid input (e.g. non-numeric id, missing required fields)
- `404 Not Found` — resource or route does not exist
- `500 Internal Server Error` — unexpected server error

## Front-end

A static page is served at `/` titled **"Laxmi's Top Favourite Places in the World"**.
It fetches from `GET /tourist-places-api/api/places` and renders each place as a
vertical, full-width list item (image, name, location, description) with spacing
and dividers between entries for a clean scroll-down experience.
