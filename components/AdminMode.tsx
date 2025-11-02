'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Member, Meeting, Goal, Contact, Message } from '@/lib/types';

interface AdminModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminMode({ isOpen, onClose }: AdminModeProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'meetings' | 'goals' | 'contact' | 'messages'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contact, setContact] = useState<Contact>({
    id: '1',
    email: 'contact@dasischool.com',
    address: '서울시 강남구',
    instagram: '#',
    facebook: '#',
    twitter: '#',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      fetchMeetings();
      fetchGoals();
    }
  }, [isOpen]);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching members:', error);
    } else {
      setMembers(data || []);
    }
  };

  const fetchMeetings = async () => {
    const { data, error } = await supabase.from('meetings').select('*').order('date', { ascending: false });
    if (error) {
      console.error('Error fetching meetings:', error);
    } else {
      const formattedData = data?.map(meeting => ({
        ...meeting,
        nextActions: meeting.next_actions
      })) || [];
      setMeetings(formattedData);
    }
  };

  const fetchGoals = async () => {
    const { data, error } = await supabase.from('goals').select('*').order('updated_at', { ascending: false });
    if (error) {
      console.error('Error fetching goals:', error);
    } else {
      const formattedData = data?.map(goal => ({
        ...goal,
        updatedAt: goal.updated_at
      })) || [];
      setGoals(formattedData);
    }
  };

  if (!isOpen) return null;

  const handleSaveMember = async (member: Member) => {
    try {
      if (editingMember) {
        const { error } = await supabase
          .from('members')
          .update({
            name: member.name,
            role: member.role,
            comment: member.comment,
            instagram: member.instagram || null,
            facebook: member.facebook || null,
            linkedin: member.linkedin || null
          })
          .eq('id', member.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('members')
          .insert({
            id: Date.now().toString(),
            name: member.name,
            role: member.role,
            comment: member.comment,
            instagram: member.instagram || null,
            facebook: member.facebook || null,
            linkedin: member.linkedin || null
          });
        if (error) throw error;
      }
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleSaveMeeting = async (meeting: Meeting) => {
    try {
      const meetingData = {
        date: meeting.date,
        title: meeting.title,
        summary: meeting.summary,
        decisions: meeting.decisions,
        next_actions: meeting.nextActions
      };
      
      if (editingMeeting) {
        const { error } = await supabase
          .from('meetings')
          .update(meetingData)
          .eq('id', meeting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('meetings')
          .insert({
            id: Date.now().toString(),
            ...meetingData
          });
        if (error) throw error;
      }
      setEditingMeeting(null);
      fetchMeetings();
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase.from('meetings').delete().eq('id', id);
      if (error) throw error;
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleSaveGoal = async (goal: Goal) => {
    try {
      const goalData = {
        title: goal.title,
        description: goal.description,
        progress: goal.progress,
        status: goal.status,
        tags: goal.tags,
        author: goal.author,
        updated_at: new Date().toISOString().split('T')[0]
      };
      
      if (editingGoal) {
        const { error } = await supabase
          .from('goals')
          .update(goalData)
          .eq('id', goal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('goals')
          .insert({
            id: Date.now().toString(),
            ...goalData
          });
        if (error) throw error;
      }
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleSaveContact = (contactData: Contact) => {
    setContact(contactData);
  };

  const handleSaveMessage = (message: Message) => {
    if (editingMessage) {
      setMessages(messages.map(m => m.id === message.id ? message : m));
    } else {
      setMessages([...messages, { ...message, id: Date.now().toString() }]);
    }
    setEditingMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="bg-white rounded-lg max-w-6xl mx-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-calmBrown">관리자 모드</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'members' ? 'bg-beige text-calmBrown border-b-2 border-calmBrown' : 'text-gray-600'}`}
            >
              멤버 관리
            </button>
            <button
              onClick={() => setActiveTab('meetings')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'meetings' ? 'bg-beige text-calmBrown border-b-2 border-calmBrown' : 'text-gray-600'}`}
            >
              회의 관리
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'goals' ? 'bg-beige text-calmBrown border-b-2 border-calmBrown' : 'text-gray-600'}`}
            >
              목표 관리
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'contact' ? 'bg-beige text-calmBrown border-b-2 border-calmBrown' : 'text-gray-600'}`}
            >
              연락처 관리
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'messages' ? 'bg-beige text-calmBrown border-b-2 border-calmBrown' : 'text-gray-600'}`}
            >
              메시지 관리
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'members' && (
              <MemberManager
                members={members}
                editingMember={editingMember}
                onEdit={setEditingMember}
                onSave={handleSaveMember}
                onDelete={handleDeleteMember}
                onCancel={() => setEditingMember(null)}
              />
            )}
            {activeTab === 'meetings' && (
              <MeetingManager
                meetings={meetings}
                editingMeeting={editingMeeting}
                onEdit={setEditingMeeting}
                onSave={handleSaveMeeting}
                onDelete={handleDeleteMeeting}
                onCancel={() => setEditingMeeting(null)}
              />
            )}
            {activeTab === 'goals' && (
              <GoalManager
                goals={goals}
                editingGoal={editingGoal}
                onEdit={setEditingGoal}
                onSave={handleSaveGoal}
                onDelete={handleDeleteGoal}
                onCancel={() => setEditingGoal(null)}
              />
            )}
            {activeTab === 'contact' && (
              <ContactManager
                contact={contact}
                onSave={handleSaveContact}
              />
            )}
            {activeTab === 'messages' && (
              <MessageManager
                messages={messages}
                editingMessage={editingMessage}
                onEdit={setEditingMessage}
                onSave={handleSaveMessage}
                onDelete={handleDeleteMessage}
                onCancel={() => setEditingMessage(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberManager({ members, editingMember, onEdit, onSave, onDelete, onCancel }: any) {
  const [formData, setFormData] = useState<Member>(
    editingMember || {
      id: '',
      name: '',
      role: '',
      comment: '',
      instagram: '',
      facebook: '',
      linkedin: '',
    }
  );

  useEffect(() => {
    if (editingMember) {
      setFormData(editingMember);
    }
  }, [editingMember]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">멤버 추가/수정</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="역할"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="한마디"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="px-4 py-2 border rounded-lg col-span-2"
          />
          <input
            type="text"
            placeholder="Instagram URL"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Facebook URL"
            value={formData.facebook}
            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            className="px-4 py-2 border rounded-lg col-span-2"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              onSave(formData);
              setFormData({
                id: '',
                name: '',
                role: '',
                comment: '',
                instagram: '',
                facebook: '',
                linkedin: '',
              });
            }}
            className="px-4 py-2 bg-calmBrown text-white rounded-lg hover:bg-opacity-90"
          >
            {editingMember ? '수정' : '추가'}
          </button>
          {editingMember && (
            <button
              onClick={() => {
                onCancel();
                setFormData({
                  id: '',
                  name: '',
                  role: '',
                  comment: '',
                  instagram: '',
                  facebook: '',
                  linkedin: '',
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-90"
            >
              취소
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">멤버 목록</h3>
        <div className="space-y-2">
          {members.map((member: Member) => (
            <div key={member.id} className="flex justify-between items-center p-4 bg-beige rounded-lg">
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="text-sm italic">{member.comment}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(member)}
                  className="px-3 py-1 bg-softOrange text-white rounded hover:bg-opacity-90"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(member.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-opacity-90"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MeetingManager({ meetings, editingMeeting, onEdit, onSave, onDelete, onCancel }: any) {
  const [formData, setFormData] = useState<Meeting>(
    editingMeeting || {
      id: '',
      title: '',
      date: '',
      summary: '',
      decisions: [],
      nextActions: [],
    }
  );

  useEffect(() => {
    if (editingMeeting) {
      setFormData(editingMeeting);
    }
  }, [editingMeeting]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">회의 추가/수정</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="회의 제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="회의 요약"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg h-24"
          />
          <textarea
            placeholder="결정사항 (줄바꿈으로 구분)"
            value={formData.decisions.join('\n')}
            onChange={(e) => setFormData({ ...formData, decisions: e.target.value.split('\n').filter(d => d.trim()) })}
            className="w-full px-4 py-2 border rounded-lg h-20"
          />
          <textarea
            placeholder="다음 액션 (줄바꿈으로 구분)"
            value={formData.nextActions.join('\n')}
            onChange={(e) => setFormData({ ...formData, nextActions: e.target.value.split('\n').filter(a => a.trim()) })}
            className="w-full px-4 py-2 border rounded-lg h-20"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              onSave(formData);
              setFormData({
                id: '',
                title: '',
                date: '',
                summary: '',
                decisions: [],
                nextActions: [],
              });
            }}
            className="px-4 py-2 bg-calmBrown text-white rounded-lg hover:bg-opacity-90"
          >
            {editingMeeting ? '수정' : '추가'}
          </button>
          {editingMeeting && (
            <button
              onClick={() => {
                onCancel();
                setFormData({
                  id: '',
                  title: '',
                  date: '',
                  summary: '',
                  decisions: [],
                  nextActions: [],
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-90"
            >
              취소
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">회의 목록</h3>
        <div className="space-y-2">
          {meetings.map((meeting: Meeting) => (
            <div key={meeting.id} className="p-4 bg-beige rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">{meeting.title}</p>
                  <p className="text-sm text-gray-600">{meeting.date}</p>
                  <p className="text-sm mt-2">{meeting.summary}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(meeting)}
                    className="px-3 py-1 bg-softOrange text-white rounded hover:bg-opacity-90"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(meeting.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-opacity-90"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalManager({ goals, editingGoal, onEdit, onSave, onDelete, onCancel }: any) {
  const [formData, setFormData] = useState<Goal>(
    editingGoal || {
      id: '',
      title: '',
      description: '',
      progress: 0,
      status: 'pending',
      tags: [],
      author: '',
      updatedAt: '',
    }
  );

  useEffect(() => {
    if (editingGoal) {
      setFormData(editingGoal);
    }
  }, [editingGoal]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">목표 추가/수정</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="목표 제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="목표 설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg h-20"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">진행률 (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">상태</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Goal['status'] })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="pending">대기</option>
                <option value="in-progress">진행 중</option>
                <option value="completed">완료</option>
              </select>
            </div>
          </div>
          <input
            type="text"
            placeholder="태그 (쉼표로 구분)"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="작성자"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              onSave(formData);
              setFormData({
                id: '',
                title: '',
                description: '',
                progress: 0,
                status: 'pending',
                tags: [],
                author: '',
                updatedAt: '',
              });
            }}
            className="px-4 py-2 bg-calmBrown text-white rounded-lg hover:bg-opacity-90"
          >
            {editingGoal ? '수정' : '추가'}
          </button>
          {editingGoal && (
            <button
              onClick={() => {
                onCancel();
                setFormData({
                  id: '',
                  title: '',
                  description: '',
                  progress: 0,
                  status: 'pending',
                  tags: [],
                  author: '',
                  updatedAt: '',
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-90"
            >
              취소
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">목표 목록</h3>
        <div className="space-y-2">
          {goals.map((goal: Goal) => (
            <div key={goal.id} className="p-4 bg-beige rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">{goal.title}</p>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      goal.status === 'completed' ? 'bg-green-500' : 
                      goal.status === 'in-progress' ? 'bg-softOrange' : 'bg-gray-400'
                    }`}>
                      {goal.status === 'completed' ? '완료' : goal.status === 'in-progress' ? '진행 중' : '대기'}
                    </span>
                    <span className="text-xs text-gray-500">진행률: {goal.progress}%</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {goal.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white rounded text-xs">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(goal)}
                    className="px-3 py-1 bg-softOrange text-white rounded hover:bg-opacity-90"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-opacity-90"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactManager({ contact, onSave }: any) {
  const [formData, setFormData] = useState<Contact>(contact);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">연락처 정보 수정</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">주소</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Instagram URL</label>
          <input
            type="url"
            value={formData.instagram || ''}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://instagram.com/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Facebook URL</label>
          <input
            type="url"
            value={formData.facebook || ''}
            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://facebook.com/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Twitter URL</label>
          <input
            type="url"
            value={formData.twitter || ''}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://twitter.com/username"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-calmBrown text-white rounded-lg hover:bg-opacity-90"
        >
          저장
        </button>
      </form>
    </div>
  );
}

function MessageManager({ messages, editingMessage, onEdit, onSave, onDelete, onCancel }: any) {
  const [replyText, setReplyText] = useState('');

  const handleReply = (message: Message) => {
    const updatedMessage = { ...message, reply: replyText };
    onSave(updatedMessage);
    setReplyText('');
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">메시지 관리</h3>
      <div className="space-y-4">
        {messages.map((message: Message) => (
          <div key={message.id} className="p-4 bg-beige rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{message.name}</span>
                  {message.isAnonymous && (
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded">익명</span>
                  )}
                </div>
                {!message.isAnonymous && message.email && (
                  <p className="text-sm text-gray-600">{message.email}</p>
                )}
                <p className="text-sm text-gray-500 mb-2">{message.createdAt}</p>
                <p className="text-gray-700 mb-3">{message.message}</p>
                
                {message.reply && (
                  <div className="bg-white rounded p-3 mb-3">
                    <p className="text-sm font-semibold text-calmBrown mb-1">현재 답변:</p>
                    <p className="text-sm text-gray-700">{message.reply}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <textarea
                    placeholder="답변을 입력하세요..."
                    value={editingMessage?.id === message.id ? replyText : message.reply || ''}
                    onChange={(e) => {
                      if (editingMessage?.id === message.id) {
                        setReplyText(e.target.value);
                      } else {
                        setReplyText(e.target.value);
                        onEdit(message);
                      }
                    }}
                    className="w-full px-3 py-2 border rounded text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(message)}
                      className="px-3 py-1 bg-calmBrown text-white rounded text-sm hover:bg-opacity-90"
                    >
                      {message.reply ? '답변 수정' : '답변 추가'}
                    </button>
                    {message.reply && (
                      <button
                        onClick={() => onSave({ ...message, reply: '' })}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-opacity-90"
                      >
                        답변 삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDelete(message.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-opacity-90 ml-4"
              >
                메시지 삭제
              </button>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            등록된 메시지가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}