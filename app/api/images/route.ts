import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // public 폴더 경로
    const publicDirectory = path.join(process.cwd(), 'public');
    
    // public 폴더의 파일 목록 읽기
    const files = fs.readdirSync(publicDirectory);
    
    // 이미지 파일만 필터링 (.png, .jpg, .jpeg, .webp)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
    });
    
    // 파일명과 경로를 포함한 객체 배열 생성
    const images = imageFiles.map(file => ({
      name: file,
      path: `/${file}`,
      label: file.replace(/\.[^/.]+$/, '') // 확장자 제거
    }));
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ images: [], error: 'Failed to read images' }, { status: 500 });
  }
}