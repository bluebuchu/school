require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    // 1. Create messages table
    const { error: messagesError } = await supabase.rpc('create_messages_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255),
          message TEXT NOT NULL,
          is_anonymous BOOLEAN DEFAULT false,
          admin_reply TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).single();

    if (messagesError) {
      console.log('Messages table might already exist or error:', messagesError.message);
    } else {
      console.log('✅ Messages table created successfully');
    }

    // 2. Create meetings table
    const { error: meetingsError } = await supabase.rpc('create_meetings_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS meetings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          summary TEXT,
          decisions TEXT[],
          next_actions TEXT[],
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).single();

    if (meetingsError) {
      console.log('Meetings table might already exist or error:', meetingsError.message);
    } else {
      console.log('✅ Meetings table created successfully');
    }

    // 3. Create goals table
    const { error: goalsError } = await supabase.rpc('create_goals_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS goals (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) CHECK (status IN ('pending', 'in-progress', 'completed')),
          progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
          author VARCHAR(255),
          tags TEXT[],
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).single();

    if (goalsError) {
      console.log('Goals table might already exist or error:', goalsError.message);
    } else {
      console.log('✅ Goals table created successfully');
    }

    // 4. Add image column to members table
    const { error: alterError } = await supabase.rpc('alter_members_table', {
      sql: `
        ALTER TABLE members 
        ADD COLUMN IF NOT EXISTS image VARCHAR(255);
      `
    }).single();

    if (alterError) {
      console.log('Error adding image column:', alterError.message);
    } else {
      console.log('✅ Image column added to members table');
    }

    console.log('\n📊 All database schema updates attempted!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables();