import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // 이미지 파일 체크
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // 파일명 안전하게 처리 (한글 지원) + 타임스탬프 추가로 중복 방지
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^가-힣a-zA-Z0-9.-]/g, '_')}`;
    
    // 파일을 ArrayBuffer로 변환
    const bytes = await file.arrayBuffer();
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('member-images')
      .upload(fileName, bytes, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ 
        error: `Upload failed: ${error.message}` 
      }, { status: 500 });
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from('member-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      success: true, 
      path: urlData.publicUrl,
      fileName: fileName,
      originalName: file.name
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}