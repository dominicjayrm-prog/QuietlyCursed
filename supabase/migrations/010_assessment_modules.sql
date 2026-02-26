-- ─── Ensure quiz_results has a UUID primary key ───
-- (table may already exist from earlier manual setup)
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_archetype text,
  secondary_archetype text,
  scores jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public can insert quiz results"
    ON quiz_results FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated can read quiz results"
    ON quiz_results FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Modular assessment system ───
-- Stores results from any add-on module (Trauma Lens, Attachment Lens, etc.)
-- Each row links back to the parent quiz_results row and stores
-- module-specific scoring and outputs.
CREATE TABLE IF NOT EXISTS assessment_modules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_result_id uuid REFERENCES quiz_results(id) ON DELETE SET NULL,
  module_type text NOT NULL,
  primary_result text NOT NULL,
  secondary_result text,
  scores jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessment_modules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public can insert assessment modules"
    ON assessment_modules FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated can read assessment modules"
    ON assessment_modules FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_assessment_modules_quiz_result
  ON assessment_modules (quiz_result_id);
CREATE INDEX IF NOT EXISTS idx_assessment_modules_type
  ON assessment_modules (module_type);
CREATE INDEX IF NOT EXISTS idx_assessment_modules_created
  ON assessment_modules (created_at DESC);
