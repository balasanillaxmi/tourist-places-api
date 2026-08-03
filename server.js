const express = require("express");
const cors = require("cors");
const path = require("path");
const places = require("./data/places");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_PATH = "/tourist-places-api/api/places";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let nextId = places.reduce((max, place) => Math.max(max, place.id), 0) + 1;

function findPlaceIndex(id) {
  return places.findIndex((place) => place.id === id);
}

// GET all places
app.get(BASE_PATH, (req, res) => {
  res.status(200).json(places);
});

// GET a single place by id
app.get(`${BASE_PATH}/:id`, (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id. Id must be a number." });
  }

  const place = places.find((p) => p.id === id);

  if (!place) {
    return res.status(404).json({ error: `Place with id ${id} not found.` });
  }

  res.status(200).json(place);
});

// POST a new place
app.post(BASE_PATH, (req, res) => {
  const { name, country, continent, description, imageUrl } = req.body || {};

  if (!name || !country || !continent || !description) {
    return res.status(400).json({
      error:
        "Missing required fields. 'name', 'country', 'continent', and 'description' are required.",
    });
  }

  const newPlace = {
    id: nextId++,
    name,
    country,
    continent,
    description,
    imageUrl:
      imageUrl || `https://loremflickr.com/800/600/${encodeURIComponent(name.replace(/\s+/g, ""))}`,
  };

  places.push(newPlace);
  res.status(201).json(newPlace);
});

// PUT update a place
app.put(`${BASE_PATH}/:id`, (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id. Id must be a number." });
  }

  const index = findPlaceIndex(id);

  if (index === -1) {
    return res.status(404).json({ error: `Place with id ${id} not found.` });
  }

  const { name, country, continent, description, imageUrl } = req.body || {};

  if (!name && !country && !continent && !description && !imageUrl) {
    return res.status(400).json({
      error:
        "At least one field ('name', 'country', 'continent', 'description', 'imageUrl') must be provided.",
    });
  }

  const updatedPlace = {
    ...places[index],
    ...(name && { name }),
    ...(country && { country }),
    ...(continent && { continent }),
    ...(description && { description }),
    ...(imageUrl && { imageUrl }),
  };

  places[index] = updatedPlace;
  res.status(200).json(updatedPlace);
});

// DELETE a place
app.delete(`${BASE_PATH}/:id`, (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id. Id must be a number." });
  }

  const index = findPlaceIndex(id);

  if (index === -1) {
    return res.status(404).json({ error: `Place with id ${id} not found.` });
  }

  const [deletedPlace] = places.splice(index, 1);
  res.status(200).json({ message: "Place deleted successfully.", place: deletedPlace });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}${BASE_PATH}`);
});
