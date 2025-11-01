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
    <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-b from-beige to-white overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 30c0-11.046-8.954-20-20-20s-20 8.954-20 20c0 20 20 40 20 40s20-20 20-40z' fill='%23FFB68A' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-calmBrown mb-4 animate-fade-in">
          다시 학교
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-12 animate-fade-in-delay">
          함께 배우고, 함께 성장하는 우리들의 이야기
        </p>
        
        <div className="flex justify-center space-x-8 mb-16">
          <div className="w-20 h-20 bg-softOrange rounded-full animate-pulse" />
          <div className="w-20 h-20 bg-beige rounded-full animate-pulse delay-75" />
          <div className="w-20 h-20 bg-calmBrown rounded-full animate-pulse delay-150" />
        </div>
      </div>
      
      <div className="absolute bottom-10 animate-bounce">
        <svg
          className="w-6 h-6 text-calmBrown"
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