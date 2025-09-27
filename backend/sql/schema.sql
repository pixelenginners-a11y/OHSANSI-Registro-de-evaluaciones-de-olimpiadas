-- Habilita citext para unicidad case-insensitive (opcional pero recomendado)
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS levels (
  id         SERIAL PRIMARY KEY,
  name       CITEXT NOT NULL,          -- o VARCHAR(120) si no quieres citext
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disparador para updated_at
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_levels_set_updated ON levels;
CREATE TRIGGER trg_levels_set_updated
BEFORE UPDATE ON levels
FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Unicidad por nombre (cumple Criterios 2 y 6)
CREATE UNIQUE INDEX IF NOT EXISTS ux_levels_name ON levels (name);

-- Vista para “solo activos” (Criterio 4)
CREATE OR REPLACE VIEW levels_active AS
  SELECT id, name FROM levels WHERE is_active = TRUE;
