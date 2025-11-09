import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  try {
    // Supabase가 설정되지 않은 경우 로컬 이미지만 반환
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase not configured, returning local images only');
      
      let localImages: any[] = [];
      try {
        const publicDirectory = path.join(process.cwd(), 'public');
        if (fs.existsSync(publicDirectory)) {
          const files = fs.readdirSync(publicDirectory);
          const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
          });
          
          localImages = imageFiles.map(file => ({
            name: file,
            path: `/${file}`,
            label: file.replace(/\.[^/.]+$/, ''),
            source: 'local'
          }));
        }
      } catch (localError) {
        console.log('Local images not available');
      }
      
      return NextResponse.json({ images: localImages });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Supabase Storage에서 이미지 목록 가져오기
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('member-images')
      .list('', {
        limit: 100,
        offset: 0,
      });

    // 로컬 public 폴더에서 이미지 목록도 가져오기 (기존 이미지들)
    let localImages: any[] = [];
    try {
      const publicDirectory = path.join(process.cwd(), 'public');
      if (fs.existsSync(publicDirectory)) {
        const files = fs.readdirSync(publicDirectory);
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
        });
        
        localImages = imageFiles.map(file => ({
          name: file,
          path: `/${file}`,
          label: file.replace(/\.[^/.]+$/, ''),
          source: 'local'
        }));
      }
    } catch (localError) {
      console.log('Local images not available (expected in production)');
    }

    // Supabase Storage 이미지들
    let supabaseImages: any[] = [];
    if (storageFiles && !storageError) {
      supabaseImages = await Promise.all(
        storageFiles
          .filter(file => {
            const ext = path.extname(file.name).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
          })
          .map(async (file) => {
            const { data: urlData } = supabase.storage
              .from('member-images')
              .getPublicUrl(file.name);

            return {
              name: file.name,
              path: urlData.publicUrl,
              label: file.name.replace(/^\d+_/, '').replace(/\.[^/.]+$/, ''), // 타임스탬프 제거
              source: 'supabase',
              createdAt: file.created_at
            };
          })
      );
    }

    // 두 소스의 이미지들을 합치고 정렬
    const allImages = [...localImages, ...supabaseImages].sort((a, b) => {
      if (a.source === 'supabase' && b.source === 'local') return -1;
      if (a.source === 'local' && b.source === 'supabase') return 1;
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.name.localeCompare(b.name);
    });
    
    return NextResponse.json({ images: allImages });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ images: [], error: 'Failed to read images' }, { status: 500 });
  }
}