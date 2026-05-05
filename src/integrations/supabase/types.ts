export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      submissions: {
        Row: {
          id: string;
          text: string;
          domain: string;
          coreIssue: string;
          location: string;
          urgency: string;
          sentiment: number;
          emotionalIntensity: number;
          type: string;
          photos: Json;
          keywords: Json;
          date: string;
          language: string;
          created_at: string;
        };
        Insert: {
          id: string;
          text: string;
          domain: string;
          coreIssue: string;
          location: string;
          urgency: string;
          sentiment: number;
          emotionalIntensity: number;
          type: string;
          photos?: Json;
          keywords: Json;
          date: string;
          language: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          domain?: string;
          coreIssue?: string;
          location?: string;
          urgency?: string;
          sentiment?: number;
          emotionalIntensity?: number;
          type?: string;
          photos?: Json;
          keywords?: Json;
          date?: string;
          language?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      policy_briefs: {
        Row: {
          id: string;
          title: string;
          domain: string;
          status: string;
          priorityScore: number;
          submissionCount: number;
          trend: string;
          executiveSummary: string;
          affectedCitizens: number;
          geographicDistribution: Json;
          sentimentTimeline: Json;
          citizenQuotes: Json;
          rootCause: string;
          recommendations: Json;
          createdAt: string;
          updatedAt: string;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          domain: string;
          status: string;
          priorityScore: number;
          submissionCount: number;
          trend: string;
          executiveSummary: string;
          affectedCitizens: number;
          geographicDistribution: Json;
          sentimentTimeline: Json;
          citizenQuotes: Json;
          rootCause: string;
          recommendations: Json;
          createdAt: string;
          updatedAt: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          domain?: string;
          status?: string;
          priorityScore?: number;
          submissionCount?: number;
          trend?: string;
          executiveSummary?: string;
          affectedCitizens?: number;
          geographicDistribution?: Json;
          sentimentTimeline?: Json;
          citizenQuotes?: Json;
          rootCause?: string;
          recommendations?: Json;
          createdAt?: string;
          updatedAt?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          type: string;
          message: string;
          timestamp: string;
          domain: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          type: string;
          message: string;
          timestamp: string;
          domain?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          message?: string;
          timestamp?: string;
          domain?: string | null;
          created_at?: string;
        };
        Relationships: [];
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
