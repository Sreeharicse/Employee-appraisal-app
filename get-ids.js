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

async function getIds() {
    const { data: profiles } = await supabase.from('profiles').select('id, name, role, manager_id');
    console.log('Profiles:', JSON.stringify(profiles, null, 2));

    const { data: cycles } = await supabase.from('cycles').select('id, name, status');
    console.log('Cycles:', JSON.stringify(cycles, null, 2));
}

getIds();
