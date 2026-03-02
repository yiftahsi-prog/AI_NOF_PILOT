-- Explode multi-select values example
SELECT jsonb_array_elements_text(value_json->'values') AS item, count(*)
FROM v_answers_keyed
WHERE question_key='tools_used'
GROUP BY item 
ORDER BY count(*) DESC;

-- Get single-select breakdown
SELECT value_json->>'value' AS item, count(*)
FROM v_answers_keyed
WHERE question_key='role'
GROUP BY item
ORDER BY count(*) DESC;

-- Time series: submissions per day
SELECT DATE(submitted_at) as date, count(DISTINCT submission_id) 
FROM v_answers_keyed 
GROUP BY DATE(submitted_at) 
ORDER BY date ASC;

-- Get latest 50 free comments
SELECT value_json->>'text' AS comment, submitted_at
FROM v_answers_keyed
WHERE question_key='free_comments'
ORDER BY submitted_at DESC
LIMIT 50;
