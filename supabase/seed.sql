DO $$
DECLARE
  v_survey_id uuid;
BEGIN
  INSERT INTO surveys (slug, version, title)
  VALUES ('ai-usage-2026', 'v1', 'סקר שימוש ב-AI בארגון')
  RETURNING id INTO v_survey_id;

  INSERT INTO questions (survey_id, key, label, type, required, "order", options_json) VALUES
  (v_survey_id, 'role', 'מה התפקיד העיקרי שלך?', 'multi-select', true, 1, '["פיתוח תוכנה", "מחקר / אנליזה", "ניהול", "הנדסה (לא תוכנה)", "תפעול / IT / DevOps", "אחר"]'::jsonb),
  (v_survey_id, 'team', 'מאיזו מחלקה אתה?', 'single-select', true, 2, '["1", "2", "3", "4", "5"]'::jsonb),
  (v_survey_id, 'seniority', 'רמת ותק מקצועי', 'single-select', true, 3, '["0–2 שנים", "3–5 שנים", "6–10 שנים", "10+ שנים"]'::jsonb),
  (v_survey_id, 'tools_used_internet', 'באילו כלי AI זמינים ברשת האינטרנט אתה משתמש?', 'multi-select', true, 4, '["ChatGPT", "Claude", "Gemini", "GitHub Copilot", "Midjourney", "DALL-E", "אחר", "לא משתמש"]'::jsonb),
  (v_survey_id, 'tools_used_internal', 'באילו כלי AI פנימיים ארגוניים אתה משתמש?', 'multi-select', true, 5, '["מודל מקומי (LLM on-prem)", "כלי AI ייעודי ארגוני", "אחר", "לא משתמש"]'::jsonb),
  (v_survey_id, 'usage_frequency', 'תדירות שימוש בכלי AI', 'single-select', true, 6, '["מספר פעמים ביום", "פעם ביום", "מספר פעמים בשבוע", "לעיתים רחוקות", "כלל לא"]'::jsonb),
  (v_survey_id, 'use_cases', 'לאילו מטרות אתה משתמש ב-AI?', 'multi-select', true, 7, '["כתיבת קוד", "דיבוג", "כתיבת מסמכים / מיילים", "ניתוח מידע / דאטה", "מחקר / למידה", "הכנת מצגות", "הנדסת מערכת", "סקרי שוק", "אחר"]'::jsonb),
  (v_survey_id, 'use_cases_other', 'אם ציינת "אחר" במטרות השימוש, אנא פרט:', 'free-text', false, 8, null),
  (v_survey_id, 'efficiency_gain', 'עד כמה ה-AI משפר את היעילות שלך?', 'likert', true, 9, '[1,2,3,4,5]'::jsonb),
  (v_survey_id, 'time_saved', 'הערכת חיסכון בזמן שבועי הודות ל-AI', 'single-select', true, 10, '["0 שעות", "0–1 שעות", "1–3 שעות", "3–5 שעות", "5–10 שעות", "10+ שעות"]'::jsonb),
  (v_survey_id, 'data_sensitivity', 'איזו רמת רגישות של מידע הוזנה לכלי AI?', 'single-select', true, 11, '["מידע ציבורי בלבד", "מידע פנימי", "מידע רגיש / מסווג", "לא ידוע / לא בטוח"]'::jsonb),
  (v_survey_id, 'verification_level', 'באיזו מידה אתה מאמת את תוצרי ה-AI?', 'single-select', true, 12, '["תמיד", "לעיתים קרובות", "לעיתים רחוקות", "אף פעם"]'::jsonb),
  (v_survey_id, 'verification_methods', 'כיצד אתה מאמת תוצרים?', 'multi-select', true, 13, '["בדיקה מול מקור נוסף", "הרצה / בדיקת קוד", "ביקורת עמיתים", "תחושת בטן / ניסיון", "שימוש בכלי אימות אוטומטיים", "לא מאמת"]'::jsonb),
  (v_survey_id, 'quality_improvement', 'תחושת שיפור איכות התוצר בעקבות שימוש ב-AI', 'single-select', true, 14, '["איכות התוצרים נמוכה אבל מתקבלת בקלות ומהירות", "איכות התוצר דומה לביצוע ידני - לא משפר את האיכות", "שיפור קטן באיכות התוצרים", "שיפור משמעותי באיכות התוצר"]'::jsonb),
  (v_survey_id, 'risks_encountered', 'האם נתקלת בבעיות או סיכונים בשימוש ב-AI?', 'multi-select', true, 15, '["טעויות מהותיות בתוכן", "קוד שגוי", "חשש לדליפת מידע", "תלות יתר בכלי", "לא נתקלתי בבעיות"]'::jsonb),
  (v_survey_id, 'risk_description', 'אם כן – תיאור קצר (אופציונלי)', 'free-text', false, 16, null),
  (v_survey_id, 'training_needs', 'אילו הכשרות או הנחיות היו משפרות את השימוש שלך ב-AI?', 'multi-select', true, 17, '["קווים מנחים ברורים", "דוגמאות שימוש מאושרות", "הדרכה טכנית", "הדרכת אבטחת מידע", "לא נדרש"]'::jsonb),
  (v_survey_id, 'free_comments', 'הערות חופשיות', 'free-text', false, 18, null),
  (v_survey_id, 'suggested_tool', 'יש מודל או כלי מהאינטרנט שעוזר לך בעבודה והיית רוצה להכניס לארגון? (אופציונלי)', 'free-text', false, 19, null);
END $$;
