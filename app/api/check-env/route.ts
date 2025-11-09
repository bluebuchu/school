import { NextResponse } from 'next/server';

export async function GET() {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    configured: hasSupabaseUrl && hasSupabaseKey,
    hasUrl: hasSupabaseUrl,
    hasKey: hasSupabaseKey,
    message: (hasSupabaseUrl && hasSupabaseKey) 
      ? 'Supabase is configured' 
      : 'Supabase environment variables are missing'
  });
}