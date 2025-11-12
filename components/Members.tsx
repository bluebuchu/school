'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Member } from '@/lib/types';

export default function Members() {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    // 이미지 목록 가져오기
    fetch('/api/images')
      .then(res => res.json())
      .then(data => {
        const images = data.images.map((img: any) => img.path);
        setAvailableImages(images);
      })
      .catch(error => {
        console.error('Failed to fetch images:', error);
      });
  }, []);

  useEffect(() => {
    if (availableImages.length >= 0) {
      fetchMembers();
    }
  }, [availableImages]);

  // localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'memberOrder') {
        fetchMembers();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [availableImages]);

  useEffect(() => {
    // 멤버 변경 감지를 위한 리스너
    const subscription = supabase
      .channel('members_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'members' 
      }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 이름 기반 자동 이미지 매칭 함수
  const findMatchingImage = (memberName: string): string | null => {
    // 1. 정확한 이름 매칭 (예: "홍길동.png")
    const exactMatch = availableImages.find(img => 
      img.toLowerCase() === `/${memberName.toLowerCase()}.png` ||
      img.toLowerCase() === `/${memberName.toLowerCase()}.jpg` ||
      img.toLowerCase() === `/${memberName.toLowerCase()}.jpeg`
    );
    if (exactMatch) return exactMatch;

    // 2. 부분 매칭 (이름이 포함된 파일)
    const partialMatch = availableImages.find(img => {
      const fileName = img.toLowerCase().replace(/\.[^/.]+$/, ''); // 확장자 제거
      return fileName.includes(memberName.toLowerCase());
    });
    if (partialMatch) return partialMatch;

    return null;
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*');

      if (error) {
        console.error('Error fetching members:', error);
        return;
      }

      let orderedMembers = data || [];
      
      // localStorage에서 순서 정보 가져오기
      const savedOrder = localStorage.getItem('memberOrder');
      
      if (savedOrder) {
        try {
          const orderMap = JSON.parse(savedOrder);
          // localStorage의 순서에 따라 정렬
          orderedMembers.sort((a, b) => {
            const orderA = orderMap[a.id] ?? 999;
            const orderB = orderMap[b.id] ?? 999;
            return orderA - orderB;
          });
        } catch (e) {
          console.error('Error parsing saved order:', e);
          // 오류 시 created_at으로 정렬
          orderedMembers.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        }
      } else {
        // 저장된 순서가 없으면 display_order 또는 created_at으로 정렬
        orderedMembers.sort((a, b) => {
          if (a.display_order !== undefined && b.display_order !== undefined) {
            return a.display_order - b.display_order;
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
      }

      // 이미지 경로 처리: 1) 저장된 이미지, 2) 자동 이름 매칭, 3) 기본값
      const membersWithImages = orderedMembers.map(member => ({
        ...member,
        image: member.image || findMatchingImage(member.name) || null
      }));
      setMembers(membersWithImages);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openSNSPopup = (url: string, platform: string) => {
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      url,
      `${platform}_popup`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-calmBrown">데이터를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-calmBrown mb-4">
          함께하는 사람들
        </h2>
        <p className="text-center text-gray-600 mb-12">
          다양한 배경과 열정을 가진 사람들
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="relative group"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="bg-beige rounded-lg p-4 md:p-5 lg:p-6 transition-transform duration-300 group-hover:scale-105">
                <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto mb-4 bg-gray-300 rounded-full overflow-hidden">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-softOrange to-calmBrown" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-center text-calmBrown mb-1">
                  {member.name}
                </h3>
                <p className="text-center text-gray-600 mb-4">{member.role}</p>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    hoveredMember === member.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-center text-gray-700 italic mb-3">
                    "{member.comment}"
                  </p>
                </div>
                
                <div className="flex justify-center space-x-3">
                  {member.instagram && (
                    <button 
                      onClick={() => openSNSPopup(member.instagram!, 'instagram')}
                      className="text-softOrange hover:text-calmBrown transition-colors duration-200"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                      </svg>
                    </button>
                  )}
                  {member.facebook && (
                    <button 
                      onClick={() => openSNSPopup(member.facebook!, 'facebook')}
                      className="text-softOrange hover:text-calmBrown transition-colors duration-200"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                  )}
                  {member.linkedin && (
                    <button 
                      onClick={() => openSNSPopup(member.linkedin!, 'linkedin')}
                      className="text-softOrange hover:text-calmBrown transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}