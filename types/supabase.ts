export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string
          household_id: string
          id: string
          month: number | null
          name: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          household_id: string
          id?: string
          month?: number | null
          name?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          household_id?: string
          id?: string
          month?: number | null
          name?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
        ]
      }
      household: {
        Row: {
          created_at: string
          id: string
          name: string | null
          plan_name: string | null
          stripe_customer_id: string | null
          stripe_product_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          plan_name?: string | null
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          plan_name?: string | null
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
        }
        Relationships: []
      }
      household_invitations: {
        Row: {
          created_at: string
          email: string
          household_id: string
          id: string
          invited_by: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          household_id: string
          id?: string
          invited_by: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          household_id?: string
          id?: string
          invited_by?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_invitations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      income: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          household_id: string
          id: string
          month: number | null
          name: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string
          household_id: string
          id?: string
          month?: number | null
          name?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          household_id?: string
          id?: string
          month?: number | null
          name?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "income_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
        ]
      }
      income_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          date: string | null
          description: string | null
          household_id: string
          id: string
          income_id: string
          month: number | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          date?: string | null
          description?: string | null
          household_id: string
          id?: string
          income_id: string
          month?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          date?: string | null
          description?: string | null
          household_id?: string
          id?: string
          income_id?: string
          month?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "income_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_transactions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_transactions_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
        ]
      }
      line_items: {
        Row: {
          category_id: string
          created_at: string
          created_by: string | null
          id: string
          month: number | null
          name: string | null
          planned_amount: number | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          month?: number | null
          name?: string | null
          planned_amount?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          month?: number | null
          name?: string | null
          planned_amount?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "line_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "line_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string
          created_by: string | null
          date: string | null
          description: string | null
          household_id: string
          id: string
          line_item_id: string | null
          month: number | null
          type: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          date?: string | null
          description?: string | null
          household_id: string
          id?: string
          line_item_id?: string | null
          month?: number | null
          type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          date?: string | null
          description?: string | null
          household_id?: string
          id?: string
          line_item_id?: string | null
          month?: number | null
          type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_line_item_id_fkey"
            columns: ["line_item_id"]
            isOneToOne: false
            referencedRelation: "line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_emoji: string | null
          created_at: string
          email: string | null
          first_name: string | null
          household_id: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          avatar_emoji?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          household_id?: string | null
          id?: string
          last_name?: string | null
        }
        Update: {
          avatar_emoji?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          household_id?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

