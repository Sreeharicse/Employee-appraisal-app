import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load env
const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseAnonKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking Cycles Table...");
  const { data: cycles, error: cErr } = await supabase.from('cycles').select('*');
  if (cErr) {
    console.error("Error fetching cycles:", cErr.message);
  } else {
    console.log("Cycles count:", cycles.length);
  }

  console.log("\nChecking Self Reviews count...");
  const { data: sr, error: srErr } = await supabase.from('self_reviews').select('id');
  console.log("Self reviews count:", sr?.length || 0);

  console.log("\nChecking Evaluations count...");
  const { data: ev, error: evErr } = await supabase.from('evaluations').select('id');
  console.log("Evaluations count:", ev?.length || 0);

  console.log("\nChecking Approvals count...");
  const { data: ap, error: apErr } = await supabase.from('approvals').select('id');
  console.log("Approvals count:", ap?.length || 0);
}

run();
