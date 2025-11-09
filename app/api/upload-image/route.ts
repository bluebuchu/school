import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일명 안전하게 처리 (한글 지원)
    const fileName = file.name.replace(/[^가-힣a-zA-Z0-9.-]/g, '_');
    
    // public 폴더 경로
    const publicDir = path.join(process.cwd(), 'public');
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, fileName);
    
    // 파일 저장
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      path: `/${fileName}`,
      fileName: fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}