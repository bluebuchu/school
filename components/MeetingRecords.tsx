'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Meeting } from '@/lib/types';

export default function MeetingRecords() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching meetings:', error);
      } else {
        // next_actions 필드명을 nextActions로 변환
        const formattedData = data?.map(meeting => ({
          ...meeting,
          nextActions: meeting.next_actions
        })) || [];
        setMeetings(formattedData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-beige">
        <div className="container mx-auto px-4 text-center">
          <div className="text-calmBrown">회의 기록을 불러오는 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-beige">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-calmBrown mb-12">
          회의 기록
        </h2>
        
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