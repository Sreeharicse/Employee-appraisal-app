import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
    try {
        console.log('1. Trying to insert a cycle...');
        const { data: cycle, error: cycleError } = await supabase.from('cycles').insert({
            name: 'Test Cycle',
            start_date: '2026-01-01',
            end_date: '2026-12-31',
            status: 'active'
        }).select().single();

        if (cycleError) {
            console.error('Cycle Insert Error:', cycleError.message);
        } else {
            console.log('Cycle inserted successfully:', cycle.id);

            console.log('2. Trying to insert an evaluation...');
            // Need a valid employee ID and manager ID. 
            // I'll fetch them first.
            const { data: profiles } = await supabase.from('profiles').select('id, role');
            const manager = profiles.find(p => p.role === 'manager');
            const employee = profiles.find(p => p.role === 'employee');

            if (manager && employee) {
                const { data: evalData, error: evalError } = await supabase.from('evaluations').insert({
                    cycle_id: cycle.id,
                    employee_id: employee.id,
                    manager_id: manager.id,
                    status: 'pending_approval',
                    feedback: 'Test feedback',
                    submitted_at: new Date().toISOString().split('T')[0]
                }).select().single();

                if (evalError) {
                    console.error('Evaluation Insert Error:', evalError.message);
                } else {
                    console.log('Evaluation inserted successfully:', evalData.id);
                }
            } else {
                console.warn('Could not find manager and employee to test evaluation insert.');
            }
        }
    } catch (err) {
        console.error('Script Error:', err);
    }
}

testInsert();
