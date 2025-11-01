'use client';

import { useState } from 'react';

interface Meeting {
  id: number;
  date: string;
  title: string;
  summary: string;
  decisions: string[];
  nextActions: string[];
  participants: string[];
}

const meetings: Meeting[] = [
  {
    id: 1,
    date: '2024-11-01',
    title: '프로젝트 킥오프 미팅',
    summary: '프로젝트 비전과 목표 설정',
    decisions: [
      '프로젝트명을 "다시 학교"로 확정',
      '2주 단위 스프린트 진행',
      '매주 화요일 정기 회의',
    ],
    nextActions: [
      '프로젝트 로드맵 작성',
      '개발 환경 구성',
      '디자인 시안 초안 작성',
    ],
    participants: ['김지수', '이민호', '박서연', '최준영'],
  },
  {
    id: 2,
    date: '2024-11-08',
    title: '첫 번째 스프린트 회고',
    summary: '초기 개발 진행 상황 점검',
    decisions: [
      'Next.js + Tailwind CSS 기술 스택 확정',
      'Supabase를 백엔드로 사용',
    ],
    nextActions: [
      '컴포넌트 구조 설계',
      'API 엔드포인트 정의',
    ],
    participants: ['김지수', '이민호', '박서연'],
  },
];

export default function MeetingRecords() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-beige">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-calmBrown mb-4">
          회의 기록
        </h2>
        <p className="text-center text-gray-600 mb-12">
          우리의 성장 과정을 기록합니다
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-calmBrown mb-4">회의 목록</h3>
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => setSelectedMeeting(meeting)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                    selectedMeeting?.id === meeting.id
                      ? 'bg-softOrange text-white shadow-lg'
                      : 'bg-white hover:bg-beige hover:shadow-md'
                  }`}
                >
                  <div className="font-semibold">{meeting.title}</div>
                  <div className="text-sm opacity-75">{meeting.date}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedMeeting ? (
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-calmBrown mb-2">
                  {selectedMeeting.title}
                </h3>
                <p className="text-gray-500 mb-4">{selectedMeeting.date}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-lg text-calmBrown mb-2">요약</h4>
                  <p className="text-gray-700">{selectedMeeting.summary}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-lg text-calmBrown mb-2">주요 결정사항</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMeeting.decisions.map((decision, idx) => (
                      <li key={idx} className="text-gray-700">{decision}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-lg text-calmBrown mb-2">다음 액션</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMeeting.nextActions.map((action, idx) => (
                      <li key={idx} className="text-gray-700">{action}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg text-calmBrown mb-2">참석자</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeeting.participants.map((participant, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-beige rounded-full text-sm text-calmBrown"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <p className="text-gray-500">회의를 선택하여 상세 내용을 확인하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}