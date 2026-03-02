import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomItems(arr, maxAmount) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.max(1, Math.floor(Math.random() * maxAmount) + 1));
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
    console.log("Fetching survey...");
    const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('id, questions(id, key, type, options_json)')
        .eq('slug', 'ai-usage-2026')
        .single();

    if (surveyError || !surveyData) {
        console.error("Survey error:", surveyError);
        return;
    }

    const surveyId = surveyData.id;
    const questions = surveyData.questions;

    console.log("Generating 100 mock submissions...");
    const now = new Date();
    const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let successCount = 0;

    for (let i = 0; i < 100; i++) {
        const createdAt = randomDate(pastWeek, now).toISOString();

        // 1. Insert Submission
        const { data: subData, error: subError } = await supabase
            .from('submissions')
            .insert({
                survey_id: surveyId,
                user_agent: 'MockDataGenerator NextJS/14',
                ip_hash: `mocked_ip_hash_${i}`,
                created_at: createdAt
            })
            .select('id')
            .single();

        if (subError) {
            console.error("Submission insert error:", subError);
            continue;
        }

        const submissionId = subData.id;
        const answersToInsert = [];

        // 2. Generate Answers
        for (const q of questions) {
            let ansValue = null;
            let generateOther = false;

            if (q.type === 'single-select' || q.type === 'likert') {
                const item = getRandomItem(q.options_json);
                ansValue = { value: item };
                if (item === 'אחר') generateOther = true;
            } else if (q.type === 'multi-select') {
                const items = getRandomItems(q.options_json, 3);
                ansValue = { values: items };
                if (items.includes('אחר')) generateOther = true;
            } else if (q.type === 'free-text') {
                // Randomly skip free text
                if (Math.random() > 0.3) {
                    ansValue = { text: "פידבק לדוגמה מהצוות - " + Math.random().toString(36).substring(7) };
                }
            }

            if (ansValue) {
                answersToInsert.push({
                    submission_id: submissionId,
                    question_id: q.id,
                    value_json: ansValue,
                    created_at: createdAt
                });
            }
        }

        // 3. Insert Answers
        if (answersToInsert.length > 0) {
            const { error: ansError } = await supabase.from('answers').insert(answersToInsert);
            if (ansError) {
                console.error("Answer insert error:", ansError);
            } else {
                successCount++;
                if (successCount % 10 === 0) console.log(`Created ${successCount}/100 submissions...`);
            }
        }
    }

    console.log("Done! Total mock submissions successfully created:", successCount);
}

run();
