import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixManager() {
    // Sreehari's ID
    const employeeId = '46342d06-791b-45e3-8ce2-a67eb322675c';

    // Haran Sinka's ID (the manager)
    const managerId = 'b7e82aea-1d9e-4765-82e1-802f40adcb26';

    const { error } = await supabase
        .from('profiles')
        .update({ manager_id: managerId })
        .eq('id', employeeId);

    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log('Successfully assigned employee to manager!');
    }
}

fixManager();
