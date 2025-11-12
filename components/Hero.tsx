'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cloudWhite via-warmBeige to-softGray overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url('/school-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-cloudWhite/20 via-transparent to-warmBeige/25" />
      
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 30c0-11.046-8.954-20-20-20s-20 8.954-20 20c0 20 20 40 20 40s20-20 20-40z' fill='%236B8E6B' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Photo Credit */}
      <div className="absolute top-4 left-4 z-20">
        <p className="text-xs text-sageGreen/60 bg-cloudWhite/80 px-3 py-1 rounded-lg backdrop-blur-sm">
          사진출처: 윈즈- 가을하늘 운동장에 드리운 만국기
        </p>
      </div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-sageGreen mb-4 animate-fade-in">
          다시 학교
        </h1>
        <p className="text-xl md:text-2xl text-sageGreen/80 mb-16 animate-fade-in-delay">
          함께 배우고, 함께 성장하는 사람들의 이야기
        </p>
      </div>
      
      <div className="absolute bottom-10 flex flex-col items-center gap-2">
        <p className="text-sm text-sageGreen opacity-60 animate-pulse">스크롤하여 더 보기</p>
        <svg
          className="w-6 h-6 text-sageGreen animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}