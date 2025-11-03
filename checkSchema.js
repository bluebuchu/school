const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  try {
    console.log('Checking members table schema...\n');
    
    // Get one row to check columns
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Available columns in members table:');
      console.log(Object.keys(data[0]));
    }
    
    // Check if image column exists by trying to select it
    const { data: imageCheck, error: imageError } = await supabase
      .from('members')
      .select('id, image')
      .limit(1);
    
    if (imageError && imageError.message.includes('column')) {
      console.log('\n❌ "image" column does not exist in the table');
    } else {
      console.log('\n✅ "image" column exists in the table');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkSchema();