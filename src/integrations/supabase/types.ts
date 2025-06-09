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
      avaliacoes_enviadas: {
        Row: {
          data: string
          enviado_em: string | null
          id: number
          id_grupo: string
        }
        Insert: {
          data: string
          enviado_em?: string | null
          id?: number
          id_grupo: string
        }
        Update: {
          data?: string
          enviado_em?: string | null
          id?: number
          id_grupo?: string
        }
        Relationships: []
      }
      chamados_whatsapp: {
        Row: {
          atendente: string
          chave_unica: string
          created_at: string
          data: string
          grupo: string
          id: number
          id_grupo: string | null
          telefone: string
        }
        Insert: {
          atendente: string
          chave_unica: string
          created_at?: string
          data: string
          grupo: string
          id?: number
          id_grupo?: string | null
          telefone: string
        }
        Update: {
          atendente?: string
          chave_unica?: string
          created_at?: string
          data?: string
          grupo?: string
          id?: number
          id_grupo?: string | null
          telefone?: string
        }
        Relationships: []
      }
      formulario_suporte: {
        Row: {
          created_at: string
          email: string | null
          empresa: string | null
          id: number
          name: string | null
          nota: number | null
          notes: string | null
          phone: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          empresa?: string | null
          id?: number
          name?: string | null
          nota?: number | null
          notes?: string | null
          phone?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          empresa?: string | null
          id?: number
          name?: string | null
          nota?: number | null
          notes?: string | null
          phone?: number | null
        }
        Relationships: []
      }
      satisfacao: {
        Row: {
          avaliacao: string | null
          created_at: string
          grupo: string | null
          id: number
          nota_convertida: number | null
          participantPhone: string | null
          usuario: string | null
        }
        Insert: {
          avaliacao?: string | null
          created_at?: string
          grupo?: string | null
          id?: number
          nota_convertida?: number | null
          participantPhone?: string | null
          usuario?: string | null
        }
        Update: {
          avaliacao?: string | null
          created_at?: string
          grupo?: string | null
          id?: number
          nota_convertida?: number | null
          participantPhone?: string | null
          usuario?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      relatorio_interacoes_diario: {
        Row: {
          atendente: string | null
          data: string | null
          grupo: string | null
          telefone: string | null
          total_interacoes: number | null
        }
        Relationships: []
      }
      relatorio_interacoes_diario_atendimento: {
        Row: {
          atendente: string | null
          data: string | null
          telefone: string | null
          total_atendimentos: number | null
          total_ponderado: number | null
        }
        Relationships: []
      }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
