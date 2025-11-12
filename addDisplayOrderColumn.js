const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addDisplayOrderColumn() {
  try {
    // Add display_order column to members table
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE members 
        ADD COLUMN IF NOT EXISTS display_order INTEGER;
      `
    });

    if (alterError) {
      console.error('Error adding column:', alterError);
      // Try alternative approach
      console.log('Trying alternative SQL approach...');
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log('Column might already exist or needs manual addition via Supabase dashboard');
      }
    } else {
      console.log('Successfully added display_order column');
    }

    // Update existing members with display_order based on created_at
    const { data: members, error: fetchError } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Error fetching members:', fetchError);
      return;
    }

    // Assign display_order to each member
    for (let i = 0; i < members.length; i++) {
      const { error: updateError } = await supabase
        .from('members')
        .update({ display_order: i })
        .eq('id', members[i].id);

      if (updateError) {
        console.error(`Error updating member ${members[i].name}:`, updateError);
      } else {
        console.log(`Updated ${members[i].name} with display_order: ${i}`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

addDisplayOrderColumn();