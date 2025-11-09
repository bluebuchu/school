require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addImageColumn() {
  console.log('🔧 Adding image column to members table...');
  
  try {
    // SQL을 통해 컬럼 추가
    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE members ADD COLUMN IF NOT EXISTS image TEXT;'
    });

    if (error) {
      console.error('❌ Error adding column:', error);
      console.log('ℹ️ Trying alternative method...');
      
      // 대안: 직접 SQL 실행 (rpc가 안되는 경우)
      const { data: result, error: sqlError } = await supabase
        .from('members')
        .select('image')
        .limit(1);
        
      if (sqlError && sqlError.message.includes('column "image" does not exist')) {
        console.log('✅ Confirmed: image column does not exist');
        console.log('📝 Please run this SQL in Supabase dashboard:');
        console.log('ALTER TABLE members ADD COLUMN image TEXT;');
        return false;
      } else if (!sqlError) {
        console.log('✅ Column already exists!');
        return true;
      }
    } else {
      console.log('✅ Column added successfully!');
      return true;
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

async function testImageColumn() {
  console.log('🧪 Testing image column access...');
  
  try {
    const { data, error } = await supabase
      .from('members')
      .select('id, name, image')
      .limit(1);
      
    if (error) {
      console.error('❌ Error accessing image column:', error.message);
      return false;
    } else {
      console.log('✅ Image column accessible!');
      console.log('Sample data:', data?.[0] || 'No data');
      return true;
    }
  } catch (error) {
    console.error('💥 Test error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting image column setup...\n');
  
  // 먼저 테스트
  const testResult = await testImageColumn();
  
  if (testResult) {
    console.log('\n🎉 Image column already exists and is working!');
  } else {
    console.log('\n🔧 Attempting to add image column...');
    const addResult = await addImageColumn();
    
    if (addResult) {
      console.log('\n🧪 Testing after addition...');
      const finalTest = await testImageColumn();
      
      if (finalTest) {
        console.log('\n🎉 Success! Image column is now ready!');
      } else {
        console.log('\n❌ Column added but test failed. Check Supabase permissions.');
      }
    } else {
      console.log('\n📋 Manual action required:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Table Editor → members table');
      console.log('3. Add column: name="image", type="text", nullable=true');
      console.log('4. Or run SQL: ALTER TABLE members ADD COLUMN image TEXT;');
    }
  }
}

main();