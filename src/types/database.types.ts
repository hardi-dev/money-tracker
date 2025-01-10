export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'INCOME' | 'EXPENSE'
          color: string
          icon: string | null
          description: string | null
          is_default: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'INCOME' | 'EXPENSE'
          color: string
          icon?: string | null
          description?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'INCOME' | 'EXPENSE'
          color?: string
          icon?: string | null
          description?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string
          amount: number
          type: 'INCOME' | 'EXPENSE'
          description: string | null
          date: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          amount: number
          type: 'INCOME' | 'EXPENSE'
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          amount?: number
          type?: 'INCOME' | 'EXPENSE'
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          amount: number
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          amount: number
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          amount?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_new_user_categories: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      category_type: 'INCOME' | 'EXPENSE'
    }
  }
}

// Helper types for Supabase functions
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Enum helper types
export type CategoryType = Enums<'category_type'>

// Table row types
export type Profile = Tables<'profiles'>
export type Category = Tables<'categories'>
export type Transaction = Tables<'transactions'>
export type Budget = Tables<'budgets'>

// Table insert types
export type ProfileInsert = TablesInsert<'profiles'>
export type CategoryInsert = TablesInsert<'categories'>
export type TransactionInsert = TablesInsert<'transactions'>
export type BudgetInsert = TablesInsert<'budgets'>

// Table update types
export type ProfileUpdate = TablesUpdate<'profiles'>
export type CategoryUpdate = TablesUpdate<'categories'>
export type TransactionUpdate = TablesUpdate<'transactions'>
export type BudgetUpdate = TablesUpdate<'budgets'>
