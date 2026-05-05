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
      admin_settings: {
        Row: {
          id: string
          updated_at: string
          webhook_events: string[]
          webhook_url: string | null
        }
        Insert: {
          id?: string
          updated_at?: string
          webhook_events?: string[]
          webhook_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          webhook_events?: string[]
          webhook_url?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          marketing_consent: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          marketing_consent?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          marketing_consent?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price_cents: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price_cents: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          company_name: string | null
          created_at: string
          customer_id: string | null
          delivery_address: Json
          discount_cents: number
          id: string
          idempotency_key: string
          invoice_number: string | null
          invoice_sent_at: string | null
          invoice_url: string | null
          is_b2b: boolean
          mollie_payment_id: string | null
          occasion_slug: string | null
          promo_code_id: string | null
          recipient_message: string | null
          sender_name: string | null
          status: string
          total_cents: number
          tracking_number: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_address: Json
          discount_cents?: number
          id?: string
          idempotency_key: string
          invoice_number?: string | null
          invoice_sent_at?: string | null
          invoice_url?: string | null
          is_b2b?: boolean
          mollie_payment_id?: string | null
          occasion_slug?: string | null
          promo_code_id?: string | null
          recipient_message?: string | null
          sender_name?: string | null
          status?: string
          total_cents: number
          tracking_number?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_address?: Json
          discount_cents?: number
          id?: string
          idempotency_key?: string
          invoice_number?: string | null
          invoice_sent_at?: string | null
          invoice_url?: string | null
          is_b2b?: boolean
          mollie_payment_id?: string | null
          occasion_slug?: string | null
          promo_code_id?: string | null
          recipient_message?: string | null
          sender_name?: string | null
          status?: string
          total_cents?: number
          tracking_number?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: string[]
          created_at: string
          description: string | null
          id: string
          images: Json
          is_active: boolean
          name: string
          occasion_slugs: string[]
          price_cents: number
          stock: number
          stock_alert_threshold: number
          updated_at: string
        }
        Insert: {
          allergens?: string[]
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          name: string
          occasion_slugs?: string[]
          price_cents: number
          stock?: number
          stock_alert_threshold?: number
          updated_at?: string
        }
        Update: {
          allergens?: string[]
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          name?: string
          occasion_slugs?: string[]
          price_cents?: number
          stock?: number
          stock_alert_threshold?: number
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          type: string
          value_cents: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          type: string
          value_cents: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          type?: string
          value_cents?: number
        }
        Relationships: []
      }
      recipient_pages: {
        Row: {
          anonymized_at: string | null
          created_at: string
          expires_at: string
          first_viewed_at: string | null
          id: string
          message: string
          occasion_slug: string
          order_id: string
          promo_code_id: string | null
          recipient_first_name: string | null
          sender_name: string
          token: string
        }
        Insert: {
          anonymized_at?: string | null
          created_at?: string
          expires_at: string
          first_viewed_at?: string | null
          id?: string
          message: string
          occasion_slug: string
          order_id: string
          promo_code_id?: string | null
          recipient_first_name?: string | null
          sender_name: string
          token: string
        }
        Update: {
          anonymized_at?: string | null
          created_at?: string
          expires_at?: string
          first_viewed_at?: string | null
          id?: string
          message?: string
          occasion_slug?: string
          order_id?: string
          promo_code_id?: string | null
          recipient_first_name?: string | null
          sender_name?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipient_pages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipient_pages_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order_atomic: {
        Args: {
          p_delivery_address: Json
          p_discount_cents: number
          p_email: string
          p_first_name: string
          p_idempotency_key: string
          p_last_name: string
          p_occasion_slug: string
          p_product_id: string
          p_promo_code_id: string
          p_recipient_message: string
          p_sender_name: string
          p_total_cents: number
          p_unit_price_cents: number
        }
        Returns: string
      }
      next_invoice_number: { Args: never; Returns: number }
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
