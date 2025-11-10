'use client';

import { useEffect, useRef, useState } from 'react';

export default function Introduction() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-softGray via-warmBeige/30 to-white"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className={`transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-calmBrown mb-12 leading-relaxed">
            다시학교는 배움·일·거주가 연결된<br className="hidden md:block" /> 실험 공동체입니다.
          </h2>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p className={`text-lg md:text-xl text-center transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              우리는 '어떻게 살아갈 것인가'를 함께 배우는 사람들입니다.<br />
              서로를 통해 성장하며, 지역과 연결되고, 작은 실험을 기록해<br />
              삶이 자라는 지속 가능한 '다시 학교'를 만들어갑니다.
            </p>
            
            <div className={`text-center pt-8 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <p className="text-2xl md:text-3xl font-semibold text-sageGreen mb-4">
                모두의 배움과 일<br />
                삶의 연결이 이루어집니다.
              </p>
              <p className="text-lg md:text-xl text-gray-600 italic">
                우리는 공간을 짓는 것이 아니라 관계를 만들어 갑니다.
              </p>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="flex justify-center mt-16">
            <div className={`w-24 h-1 bg-gradient-to-r from-softOrange via-calmBrown to-sageGreen rounded-full transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`} />
          </div>
        </div>
      </div>
    </section>
  );
}