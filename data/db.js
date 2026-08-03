const path = require("path");
const Database = require("better-sqlite3");
const seedPlaces = require("./seedPlaces");

const db = new Database(path.join(__dirname, "places.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    continent TEXT NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT
  )
`);

const rowCount = db.prepare("SELECT COUNT(*) AS count FROM places").get().count;

if (rowCount === 0) {
  const insertSeed = db.prepare(`
    INSERT INTO places (id, name, country, continent, description, imageUrl)
    VALUES (@id, @name, @country, @continent, @description, @imageUrl)
  `);
  const insertAll = db.transaction((rows) => {
    rows.forEach((row) => insertSeed.run(row));
  });
  insertAll(seedPlaces);
}

function getAllPlaces() {
  return db.prepare("SELECT * FROM places ORDER BY id").all();
}

function getPlaceById(id) {
  return db.prepare("SELECT * FROM places WHERE id = ?").get(id);
}

function createPlace({ name, country, continent, description, imageUrl }) {
  const info = db
    .prepare(
      "INSERT INTO places (name, country, continent, description, imageUrl) VALUES (?, ?, ?, ?, ?)"
    )
    .run(name, country, continent, description, imageUrl);
  return getPlaceById(info.lastInsertRowid);
}

function updatePlace(id, fields) {
  const existing = getPlaceById(id);
  if (!existing) return null;

  const merged = { ...existing, ...fields };
  db.prepare(
    "UPDATE places SET name = ?, country = ?, continent = ?, description = ?, imageUrl = ? WHERE id = ?"
  ).run(merged.name, merged.country, merged.continent, merged.description, merged.imageUrl, id);

  return getPlaceById(id);
}

function deletePlace(id) {
  const existing = getPlaceById(id);
  if (!existing) return null;

  db.prepare("DELETE FROM places WHERE id = ?").run(id);
  return existing;
}

module.exports = {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
