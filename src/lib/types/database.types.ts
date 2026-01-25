/**
 * Database type definitions for Supabase
 * These types are based on the database schema defined in supabase/migrations
 *
 * In production, these types can be auto-generated using:
 * npx supabase gen types typescript --project-id <project-id> > src/lib/types/database.types.ts
 */

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
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          post_slug: string
          user_id: string
          content: string
          status: 'approved' | 'hidden'
          created_at: string
          updated_at: string
          edited_at: string | null
        }
        Insert: {
          id?: string
          post_slug: string
          user_id: string
          content: string
          status?: 'approved' | 'hidden'
          created_at?: string
          updated_at?: string
          edited_at?: string | null
        }
        Update: {
          id?: string
          post_slug?: string
          user_id?: string
          content?: string
          status?: 'approved' | 'hidden'
          created_at?: string
          updated_at?: string
          edited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
