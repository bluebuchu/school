const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkMessages() {
  try {
    console.log('Checking messages table...\n');
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "public.messages" does not exist')) {
        console.log('❌ Messages table does not exist');
        console.log('Need to create messages table in Supabase dashboard');
      } else {
        console.error('Error:', error);
      }
    } else {
      console.log('✅ Messages table exists');
      console.log('Sample data:', data);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkMessages();