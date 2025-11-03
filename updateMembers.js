const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const updatedMembers = [
  {
    id: '1',
    name: '윈즈',
    role: '프로젝트 리더',
    comment: '함께 배우는 즐거움을 나누고 싶어요',
    instagram: '#',
    linkedin: '#',
    facebook: null,
  },
  {
    id: '2',
    name: '제이콥',
    role: '개발자',
    comment: '코드로 꿈을 현실로 만들어요',
    facebook: '#',
    linkedin: '#',
    instagram: null,
  },
  {
    id: '3',
    name: '지민',
    role: '디자이너',
    comment: '아름다운 경험을 디자인합니다',
    instagram: '#',
    facebook: '#',
    linkedin: null,
  },
  {
    id: '4',
    name: '퓨처코드',
    role: '기획자',
    comment: '모두의 아이디어를 하나로',
    linkedin: '#',
    instagram: null,
    facebook: null,
  },
];

async function updateMembers() {
  try {
    // Delete existing members
    console.log('Deleting existing members...');
    const { error: deleteError } = await supabase
      .from('members')
      .delete()
      .neq('id', '0'); // Delete all (neq with impossible value)
    
    if (deleteError) {
      console.error('Error deleting members:', deleteError);
      return;
    }
    
    // Insert new members
    console.log('Inserting new members with images...');
    const { error: insertError } = await supabase
      .from('members')
      .insert(updatedMembers);
    
    if (insertError) {
      console.error('Error inserting members:', insertError);
    } else {
      console.log('Members updated successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

updateMembers();