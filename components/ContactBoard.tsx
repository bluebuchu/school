'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Contact, Message } from '@/lib/types';

const defaultContact: Contact = {
  id: '1',
  email: 'contact@dasischool.com',
  address: '서울시 강남구',
  instagram: '#',
  facebook: '#',
  twitter: '#',
};

export default function ContactBoard() {
  const [contact] = useState<Contact>(defaultContact);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    isAnonymous: false,
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMessages();
    
    // 실시간 메시지 업데이트 리스너
    const subscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        // messages 테이블이 없는 경우 빈 배열 설정
        setMessages([]);
      } else {
        const formattedData = (data || []).map(msg => ({
          ...msg,
          name: msg.is_anonymous ? '익명' : msg.name,
          isAnonymous: msg.is_anonymous,
          reply: msg.admin_reply,
          createdAt: msg.created_at ? new Date(msg.created_at).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR')
        }));
        setMessages(formattedData);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMessage = {
      name: formData.isAnonymous ? null : formData.name,
      message: formData.message,
      is_anonymous: formData.isAnonymous,
    };
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([newMessage]);

      if (error) {
        console.error('Error saving message:', error);
        alert('메시지 저장 중 오류가 발생했습니다.');
      } else {
        setFormData({ name: '', email: '', message: '', isAnonymous: false });
        setShowForm(false);
        // fetchMessages는 실시간 리스너가 자동으로 호출
      }
    } catch (error) {
      console.error('Error:', error);
      alert('메시지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-beige">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-calmBrown mb-4">
          연락 및 게시판
        </h2>
        <p className="text-center text-gray-600 mb-12">
          여러분의 이야기를 들려주세요
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
              <h3 className="text-2xl font-bold text-calmBrown mb-4">연락처</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-softOrange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-softOrange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{contact.address}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-lg text-calmBrown mb-3">SNS</h4>
                <div className="flex space-x-4">
                  {contact.instagram && (
                    <a href={contact.instagram} className="text-softOrange hover:text-calmBrown transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                      </svg>
                    </a>
                  )}
                  {contact.facebook && (
                    <a href={contact.facebook} className="text-softOrange hover:text-calmBrown transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {contact.twitter && (
                    <a href={contact.twitter} className="text-softOrange hover:text-calmBrown transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-softOrange to-calmBrown text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              메시지 남기기
            </button>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-calmBrown mb-6">우리에게 한마디</h3>
            {loading ? (
              <div className="text-center text-gray-500">메시지를 불러오는 중...</div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    아직 메시지가 없습니다. 첫 번째 메시지를 남겨보세요!
                  </div>
                ) : (
                  messages.map(message => (
                <div key={message.id} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-calmBrown">
                        {message.name}
                      </h4>
                      {!message.isAnonymous && message.email && (
                        <p className="text-sm text-gray-500">{message.email}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">{message.createdAt}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{message.message}</p>
                  {message.reply && (
                    <div className="bg-beige rounded p-3 mt-3">
                      <p className="text-sm font-semibold text-calmBrown mb-1">답변</p>
                      <p className="text-sm text-gray-700">{message.reply}</p>
                    </div>
                  )}
                </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-calmBrown mb-6">메시지 남기기</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) =>
                        setFormData({ ...formData, isAnonymous: e.target.checked })
                      }
                      className="rounded text-softOrange"
                    />
                    <span className="text-gray-700">익명으로 작성</span>
                  </label>
                </div>
                
                {!formData.isAnonymous && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">이름</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-softOrange"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">이메일</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-softOrange"
                      />
                    </div>
                  </>
                )}
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">메시지</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-softOrange"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-calmBrown text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    전송
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}