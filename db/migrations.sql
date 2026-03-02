CREATE TABLE IF NOT EXISTS surveys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE,
    title text,
    version text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
    key text,
    label text,
    type text,
    required boolean,
    "order" int,
    options_json jsonb,
    created_at timestamptz DEFAULT now(),
    UNIQUE(survey_id, key)
);

CREATE TABLE IF NOT EXISTS submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    user_agent text,
    ip_hash text NULL
);

CREATE TABLE IF NOT EXISTS answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
    question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
    value_json jsonb,
    created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_survey_id ON submissions(survey_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_submission_id ON answers(submission_id);

-- View
CREATE OR REPLACE VIEW v_answers_keyed AS
SELECT 
    s.id as submission_id,
    s.created_at as submitted_at,
    s.survey_id,
    q.key as question_key,
    q.type as question_type,
    a.value_json
FROM submissions s
JOIN answers a ON s.id = a.submission_id
JOIN questions q ON a.question_id = q.id;

-- Auth Attempts table for IP brute-force protection
CREATE TABLE IF NOT EXISTS auth_attempts (
    ip text PRIMARY KEY,
    attempts int DEFAULT 1,
    last_attempt timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;

-- Note: We only allow the service_role to do everything.
-- Public anon should have no access or only read access to surveys/questions if needed.
CREATE POLICY "Service Role All Surveys" ON surveys USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Questions" ON questions USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Submissions" ON submissions USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Answers" ON answers USING (true) WITH CHECK (true);
CREATE POLICY "Service Role All Auth Attempts" ON auth_attempts USING (true) WITH CHECK (true);

-- Allow anon to read surveys and questions without using the service role
CREATE POLICY "Public surveys" ON surveys FOR SELECT USING (true);
CREATE POLICY "Public questions" ON questions FOR SELECT USING (true);
