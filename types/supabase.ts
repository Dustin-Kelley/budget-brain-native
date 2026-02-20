export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          household_id: string;
          id: string;
          month: number | null;
          name: string | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          created_at?: string;
          household_id: string;
          id?: string;
          month?: number | null;
          name?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          created_at?: string;
          household_id?: string;
          id?: string;
          month?: number | null;
          name?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
      };
      household: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
      };
      income: {
        Row: {
          amount: number;
          created_at: string;
          created_by: string;
          household_id: string;
          id: string;
          month: number | null;
          name: string | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          created_by?: string;
          household_id: string;
          id?: string;
          month?: number | null;
          name?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          created_by?: string;
          household_id?: string;
          id?: string;
          month?: number | null;
          name?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
      };
      line_items: {
        Row: {
          category_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          month: number | null;
          name: string | null;
          planned_amount: number | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          month?: number | null;
          name?: string | null;
          planned_amount?: number | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          month?: number | null;
          name?: string | null;
          planned_amount?: number | null;
          updated_at?: string | null;
          year?: number | null;
        };
      };
      transactions: {
        Row: {
          amount: number | null;
          created_at: string;
          created_by: string | null;
          date: string | null;
          description: string | null;
          household_id: string;
          id: string;
          line_item_id: string | null;
          month: number | null;
          type: string | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string;
          created_by?: string | null;
          date?: string | null;
          description?: string | null;
          household_id: string;
          id?: string;
          line_item_id?: string | null;
          month?: number | null;
          type?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string;
          created_by?: string | null;
          date?: string | null;
          description?: string | null;
          household_id?: string;
          id?: string;
          line_item_id?: string | null;
          month?: number | null;
          type?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          first_name: string | null;
          household_id: string | null;
          id: string;
          last_name: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          household_id?: string | null;
          id?: string;
          last_name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          household_id?: string | null;
          id?: string;
          last_name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
