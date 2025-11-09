import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created');
    
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

    // 파일명 안전하게 처리 (한글 지원) + 타임스탬프 추가로 중복 방지
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^가-힣a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${safeFileName}`;
    
    console.log('📄 Safe filename:', fileName);
    
    // 파일을 ArrayBuffer로 변환
    const bytes = await file.arrayBuffer();
    console.log('💾 File converted to ArrayBuffer, size:', bytes.byteLength);
    
    // 먼저 버킷이 존재하는지 확인
    console.log('🗂️ Checking for existing buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      console.error('Full error details:', JSON.stringify(listError, null, 2));
      return NextResponse.json({ 
        error: `Storage access error: ${listError.message}. Please check Supabase configuration.` 
      }, { status: 500 });
    }

    console.log('📋 Available buckets:', buckets?.map(b => b.name));
    const bucketExists = buckets?.some(bucket => bucket.name === 'member-images');
    console.log('🔍 member-images bucket exists:', bucketExists);
    
    if (!bucketExists) {
      console.log('🔨 Attempting to create member-images bucket...');
      // 버킷이 없으면 생성 시도
      const { error: createError } = await supabase.storage.createBucket('member-images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError && !createError.message.includes('already exists')) {
        console.error('❌ Error creating bucket:', createError);
        console.error('Full create error:', JSON.stringify(createError, null, 2));
        return NextResponse.json({ 
          error: `Storage bucket creation failed: ${createError.message}. Please create "member-images" bucket manually in Supabase.` 
        }, { status: 500 });
      }
      
      if (!createError) {
        console.log('✅ Bucket created successfully');
      } else {
        console.log('ℹ️ Bucket already exists (expected)');
      }
    }
    
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
          error: 'Storage bucket not found. Please create "member-images" bucket in Supabase dashboard.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('row-level security')) {
        return NextResponse.json({ 
          error: 'Storage access denied. Please check bucket policies in Supabase dashboard.' 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: `Upload failed: ${error.message}` 
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