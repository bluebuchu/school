'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Goal } from '@/lib/types';

export default function GoalsDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
      } else {
        // updated_at 필드명을 updatedAt로 변환
        const formattedData = data?.map(goal => ({
          ...goal,
          updatedAt: goal.updated_at
        })) || [];
        setGoals(formattedData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-calmBrown">목표를 불러오는 중...</div>
        </div>
      </section>
    );
  }

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
    ? goals 
    : goals.filter(goal => goal.tags.includes(selectedFilter));

  const allTags = Array.from(new Set(goals.flatMap(g => g.tags)));

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