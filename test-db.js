import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkDelete() {
  const { data: cycles } = await supabase.from('cycles').select('id, name');
  console.log('Cycles:', cycles);
  
  if (cycles && cycles.length > 0) {
    const cycleId = cycles[0].id;
    console.log(`Attempting to delete cycle: ${cycles[0].name} (${cycleId})`);
    
    // Test what error we get
    const { error } = await supabase.from('cycles').delete().eq('id', cycleId);
    console.log('Error deleting cycle directly:', error);
  }
}

checkDelete();
