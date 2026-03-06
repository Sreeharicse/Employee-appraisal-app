import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const tables = ['profiles', 'cycles', 'goals', 'self_reviews', 'evaluations', 'approvals'];

    for (const table of tables) {
        console.log(`Fetching ${table}...`);
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
            console.error(`Error fetching ${table}:`, error.message);
        } else {
            console.log(`${table} found: ${data.length}`);
            if (data.length > 0) {
                console.log(`Sample from ${table}:`, JSON.stringify(data[0], null, 2));
            }
        }
        console.log('---');
    }
}

test();
