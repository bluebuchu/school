import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const sourceDir = '/home/julyw/school/member';
    const targetDir = path.join(process.cwd(), 'public');
    
    // member 폴더 존재 확인
    if (!fs.existsSync(sourceDir)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Source directory not found' 
      }, { status: 404 });
    }
    
    // member 폴더의 파일 목록 읽기
    const files = fs.readdirSync(sourceDir);
    
    // 이미지 파일만 필터링
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
    });
    
    let copiedFiles: string[] = [];
    let skippedFiles: string[] = [];
    
    // 각 이미지 파일 복사
    imageFiles.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      // 파일이 이미 존재하는지 확인
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
        copiedFiles.push(file);
      } else {
        skippedFiles.push(file);
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: '이미지 동기화 완료',
      totalImages: imageFiles.length,
      copiedFiles,
      skippedFiles
    });
    
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to sync images',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}