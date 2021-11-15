CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  habitat TEXT,
  date TEXT,
  appearance TEXT,
  behaviour TEXT,
  vocalisation TEXT,
  flock_size INTEGER
)