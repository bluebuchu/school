import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          name: string
          role: string
          comment: string | null
          instagram: string | null
          facebook: string | null
          linkedin: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          role: string
          comment?: string | null
          instagram?: string | null
          facebook?: string | null
          linkedin?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          comment?: string | null
          instagram?: string | null
          facebook?: string | null
          linkedin?: string | null
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          date: string
          title: string
          summary: string | null
          decisions: string[] | null
          next_actions: string[] | null
          created_at: string
        }
        Insert: {
          id: string
          date: string
          title: string
          summary?: string | null
          decisions?: string[] | null
          next_actions?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          title?: string
          summary?: string | null
          decisions?: string[] | null
          next_actions?: string[] | null
          created_at?: string
        }
      }
    }
  }
}