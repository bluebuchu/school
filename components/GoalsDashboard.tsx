'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { Goal } from '@/lib/types';

const defaultGoals: Goal[] = [
  {
    id: '1',
    title: '웹사이트 MVP 개발',
    description: '기본 기능을 갖춘 웹사이트 첫 버전 완성',
    status: 'in-progress',
    progress: 75,
    author: '김지수',
    updatedAt: '2024-11-15',
    tags: ['개발', '우선순위'],
  },
  {
    id: '2',
    title: '사용자 피드백 시스템 구축',
    description: '방문자들이 의견을 남길 수 있는 게시판 기능',
    status: 'in-progress',
    progress: 40,
    author: '이민호',
    updatedAt: '2024-11-14',
    tags: ['기능', '소통'],
  },
  {
    id: '3',
    title: '디자인 시스템 확립',
    description: '일관된 디자인 가이드라인 및 컴포넌트 라이브러리',
    status: 'completed',
    progress: 100,
    author: '박서연',
    updatedAt: '2024-11-10',
    tags: ['디자인', '완료'],
  },
  {
    id: '4',
    title: '모바일 반응형 최적화',
    description: '모든 디바이스에서 완벽한 사용자 경험 제공',
    status: 'pending',
    progress: 0,
    author: '최준영',
    updatedAt: '2024-11-12',
    tags: ['개발', '계획'],
  },
];

export default function GoalsDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goals] = useLocalStorage<Goal[]>('school-goals', defaultGoals);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayGoals = mounted ? goals : defaultGoals;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-softOrange';
      case 'pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'in-progress':
        return '진행 중';
      case 'pending':
        return '대기';
      default:
        return status;
    }
  };

  const filteredGoals = selectedFilter === 'all' 
    ? displayGoals 
    : displayGoals.filter(goal => goal.tags.includes(selectedFilter));

  const allTags = Array.from(new Set(displayGoals.flatMap(g => g.tags)));

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-calmBrown mb-4">
          목표 대시보드
        </h2>
        <p className="text-center text-gray-600 mb-12">
          우리의 성장 과정을 시각화합니다
        </p>
        
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedFilter === 'all'
                ? 'bg-calmBrown text-white'
                : 'bg-beige text-calmBrown hover:bg-softOrange hover:text-white'
            }`}
          >
            전체
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedFilter === tag
                  ? 'bg-calmBrown text-white'
                  : 'bg-beige text-calmBrown hover:bg-softOrange hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <div
              key={goal.id}
              onClick={() => setSelectedGoal(goal)}
              className="bg-gradient-to-br from-beige to-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-calmBrown flex-1">
                  {goal.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
                    goal.status
                  )}`}
                >
                  {getStatusText(goal.status)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{goal.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>진행률</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-softOrange to-calmBrown h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {goal.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white rounded text-xs text-calmBrown"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-gray-500">
                <p>작성자: {goal.author}</p>
                <p>업데이트: {goal.updatedAt}</p>
              </div>
            </div>
          ))}
        </div>
        
        {selectedGoal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedGoal(null)}
          >
            <div
              className="bg-white rounded-lg p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-calmBrown mb-4">
                {selectedGoal.title}
              </h3>
              <p className="text-gray-600 mb-4">{selectedGoal.description}</p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>상태:</strong> {getStatusText(selectedGoal.status)}
                </p>
                <p>
                  <strong>진행률:</strong> {selectedGoal.progress}%
                </p>
                <p>
                  <strong>작성자:</strong> {selectedGoal.author}
                </p>
                <p>
                  <strong>최종 업데이트:</strong> {selectedGoal.updatedAt}
                </p>
              </div>
              <button
                onClick={() => setSelectedGoal(null)}
                className="mt-6 px-4 py-2 bg-calmBrown text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}