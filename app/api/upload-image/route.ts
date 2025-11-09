import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Service role key가 있으면 우선 사용 (RLS 우회)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  console.log('🚀 Upload request started');
  
  try {
    // Supabase 설정 확인
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase environment variables');
      console.log('URL exists:', !!supabaseUrl);
      console.log('Key exists:', !!supabaseAnonKey);
      return NextResponse.json({ 
        error: 'Storage configuration error. Please check environment variables.' 
      }, { status: 500 });
    }

    console.log('✅ Supabase config found');
    
    // Service role key가 있으면 RLS 우회용 클라이언트 사용
    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('✅ Supabase client created with', supabaseServiceKey ? 'service role (RLS bypass)' : 'anon key');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('📁 File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // 이미지 파일 체크
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // 파일명 안전하게 처리 (영어만 허용) + 타임스탬프 추가로 중복 방지
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'png';
    const baseName = file.name.replace(/\.[^/.]+$/, ""); // 확장자 제거
    // 한글과 특수문자를 제거하고 영어, 숫자, 하이픈, 언더스코어만 허용
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '');
    const fileName = `${timestamp}_${safeBaseName || 'image'}.${fileExtension}`;
    
    console.log('📄 Safe filename:', fileName);
    
    // 파일을 ArrayBuffer로 변환
    const bytes = await file.arrayBuffer();
    console.log('💾 File converted to ArrayBuffer, size:', bytes.byteLength);
    
    // Supabase Storage에 업로드
    console.log('⬆️ Starting upload to member-images bucket...');
    const { data, error } = await supabase.storage
      .from('member-images')
      .upload(fileName, bytes, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      console.error('Full upload error:', JSON.stringify(error, null, 2));
      
      // 더 구체적인 에러 메시지
      if (error.message.includes('Bucket not found')) {
        return NextResponse.json({ 
          error: 'Storage bucket "member-images" not found. Please create it in Supabase dashboard with PUBLIC access.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        return NextResponse.json({ 
          error: 'Storage access denied. Please check bucket is PUBLIC and has proper policies in Supabase dashboard.' 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: `Upload failed: ${error.message}. Please ensure "member-images" bucket exists and is PUBLIC.` 
      }, { status: 500 });
    }

    console.log('✅ Upload successful:', data?.path);

    // 공개 URL 생성
    console.log('🌐 Generating public URL...');
    const { data: urlData } = supabase.storage
      .from('member-images')
      .getPublicUrl(fileName);

    console.log('🔗 Public URL generated:', urlData.publicUrl);

    return NextResponse.json({ 
      success: true, 
      path: urlData.publicUrl,
      fileName: fileName,
      originalName: file.name
    });

  } catch (error: any) {
    console.error('💥 Unexpected error during upload:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: `Server error: ${error.message || 'Failed to upload file'}` },
      { status: 500 }
    );
  }
}