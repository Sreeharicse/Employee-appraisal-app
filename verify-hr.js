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

async function verify() {
    // 1. Get or create an active cycle
    console.log('Checking for active cycles...');
    let { data: cycles } = await supabase.from('cycles').select('*').eq('status', 'active');
    let cycle;
    if (cycles.length === 0) {
        console.log('No active cycle found. Creating one...');
        const { data, error } = await supabase.from('cycles').insert({
            name: 'Test Cycle 2026',
            start_date: '2026-01-01',
            end_date: '2026-12-31',
            status: 'active'
        }).select().single();
        if (error) { console.error('Error creating cycle:', error); return; }
        cycle = data;
    } else {
        cycle = cycles[0];
    }
    console.log('Cycle ID:', cycle.id);

    // 2. Get an employee and manager
    const { data: profiles } = await supabase.from('profiles').select('*');
    const manager = profiles.find(p => p.role === 'manager') || profiles[0];
    const employee = profiles.find(p => p.role === 'employee' && p.manager_id === manager.id) || profiles[1];

    if (!employee || !manager) {
        console.error('Need at least a manager and an employee with manager_id set.');
        console.log('Profiles found:', profiles.length);
        return;
    }
    console.log(`Using Manager: ${manager.name} (${manager.id})`);
    console.log(`Using Employee: ${employee.name} (${employee.id})`);

    // 3. Create a pending evaluation
    console.log('Creating a pending evaluation...');
    const { data: evalData, error: evalError } = await supabase.from('evaluations').insert({
        cycle_id: cycle.id,
        employee_id: employee.id,
        manager_id: manager.id,
        goal_ratings: {},
        work_performance_rating: 4,
        behavioral_rating: 4,
        feedback: 'Test verification feedback',
        status: 'pending_approval',
        submitted_at: new Date().toISOString().split('T')[0]
    }).select().single();

    if (evalError) {
        console.error('Error creating evaluation:', evalError);
    } else {
        console.log('Successfully created pending evaluation ID:', evalData.id);
        console.log('HR should now see this in the Approvals page.');
    }
}

verify();
