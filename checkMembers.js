const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkMembers() {
  try {
    console.log('Fetching current members from database...\n');
    
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching members:', error);
      return;
    }
    
    console.log(`Found ${data.length} members:\n`);
    
    data.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name}`);
      console.log(`   Role: ${member.role}`);
      console.log(`   Comment: ${member.comment}`);
      console.log(`   Created: ${member.created_at}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkMembers();