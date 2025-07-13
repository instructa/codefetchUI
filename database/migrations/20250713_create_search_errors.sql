-- D1 migration: create search_errors table
CREATE TABLE IF NOT EXISTS search_errors (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        DATETIME     NOT NULL, -- insertion timestamp
  repo      TEXT         NOT NULL,
  engine    TEXT         NOT NULL, -- ast | vector | hybrid
  pattern   TEXT         NOT NULL,
  error     TEXT         NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_search_errors_ts ON search_errors(ts DESC);
CREATE INDEX IF NOT EXISTS idx_search_errors_repo ON search_errors(repo);