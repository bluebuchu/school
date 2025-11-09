import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  console.log('🔧 Attempting to add image column to members table...');
  
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase configuration' 
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 먼저 컬럼이 존재하는지 테스트
    console.log('🧪 Testing if image column exists...');
    const { data: testData, error: testError } = await supabase
      .from('members')
      .select('image')
      .limit(1);
      
    if (!testError) {
      console.log('✅ Image column already exists!');
      return NextResponse.json({ 
        success: true, 
        message: 'Image column already exists and is accessible',
        exists: true
      });
    }
    
    if (testError.message.includes('column "image" does not exist')) {
      console.log('❌ Image column does not exist');
      
      // Service role key가 있으면 시도
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        console.log('🔑 Trying with service role key...');
        const adminSupabase = createClient(supabaseUrl, serviceKey);
        
        // SQL 직접 실행 시도
        const { data: sqlData, error: sqlError } = await adminSupabase.rpc('exec_sql', {
          query: 'ALTER TABLE members ADD COLUMN IF NOT EXISTS image TEXT;'
        });
        
        if (!sqlError) {
          console.log('✅ Column added successfully with service role!');
          return NextResponse.json({ 
            success: true, 
            message: 'Image column added successfully',
            method: 'service_role'
          });
        } else {
          console.log('❌ Service role attempt failed:', sqlError);
        }
      }
      
      return NextResponse.json({ 
        success: false, 
        error: 'Image column does not exist and cannot be created automatically',
        solution: {
          method1: 'Supabase Dashboard → Table Editor → members → Add column: "image" (text, nullable)',
          method2: 'SQL Editor: ALTER TABLE members ADD COLUMN image TEXT;'
        }
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: `Database error: ${testError.message}` 
    }, { status: 500 });
    
  } catch (error: any) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: `Server error: ${error.message}` 
    }, { status: 500 });
  }
}