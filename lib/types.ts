export interface Member {
  id: string;
  name: string;
  role: string;
  comment: string;
  image?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  display_order?: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  summary: string;
  decisions: string[];
  nextActions: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  tags: string[];
  author: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  email: string;
  address: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
  reply?: string;
}