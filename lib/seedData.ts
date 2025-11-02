import { supabase } from './supabase';

export const defaultMembers = [
  {
    id: '1',
    name: '김지수',
    role: '프로젝트 리더',
    comment: '함께 배우는 즐거움을 나누고 싶어요',
    instagram: '#',
    linkedin: '#',
    facebook: null,
  },
  {
    id: '2',
    name: '이민호',
    role: '개발자',
    comment: '코드로 꿈을 현실로 만들어요',
    facebook: '#',
    linkedin: '#',
    instagram: null,
  },
  {
    id: '3',
    name: '박서연',
    role: '디자이너',
    comment: '아름다운 경험을 디자인합니다',
    instagram: '#',
    facebook: '#',
    linkedin: null,
  },
  {
    id: '4',
    name: '최준영',
    role: '기획자',
    comment: '모두의 아이디어를 하나로',
    linkedin: '#',
    instagram: null,
    facebook: null,
  },
];

export const defaultMeetings = [
  {
    id: '1',
    date: '2024-11-01',
    title: '프로젝트 킥오프 미팅',
    summary: '프로젝트 비전과 목표 설정',
    decisions: [
      '프로젝트명을 "다시 학교"로 확정',
      '2주 단위 스프린트 진행',
      '매주 화요일 정기 회의',
    ],
    next_actions: [
      '프로젝트 로드맵 작성',
      '개발 환경 구성',
      '디자인 시안 초안 작성',
    ],
  },
  {
    id: '2',
    date: '2024-11-08',
    title: '첫 번째 스프린트 회고',
    summary: '초기 개발 진행 상황 점검',
    decisions: [
      'Next.js + Tailwind CSS 기술 스택 확정',
      'Supabase를 백엔드로 사용',
    ],
    next_actions: [
      '컴포넌트 구조 설계',
      'API 엔드포인트 정의',
    ],
  },
];

export async function seedDatabase() {
  try {
    console.log('시드 데이터 삽입 시작...');

    // 기존 데이터 확인
    const { data: existingMembers } = await supabase.from('members').select('id');
    const { data: existingMeetings } = await supabase.from('meetings').select('id');

    // Members 데이터 삽입
    if (!existingMembers || existingMembers.length === 0) {
      const { error: membersError } = await supabase
        .from('members')
        .insert(defaultMembers);
      
      if (membersError) {
        console.error('Members 삽입 오류:', membersError);
      } else {
        console.log('Members 데이터 삽입 완료');
      }
    } else {
      console.log('Members 데이터가 이미 존재합니다');
    }

    // Meetings 데이터 삽입
    if (!existingMeetings || existingMeetings.length === 0) {
      const { error: meetingsError } = await supabase
        .from('meetings')
        .insert(defaultMeetings);
      
      if (meetingsError) {
        console.error('Meetings 삽입 오류:', meetingsError);
      } else {
        console.log('Meetings 데이터 삽입 완료');
      }
    } else {
      console.log('Meetings 데이터가 이미 존재합니다');
    }

    console.log('시드 데이터 삽입 완료!');
  } catch (error) {
    console.error('시드 데이터 삽입 중 오류:', error);
  }
}