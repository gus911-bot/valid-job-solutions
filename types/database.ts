// Type généré-like pour le client Supabase typé.
// Reflète supabase/schema.sql.

import type {
  PreferredSlot,
  ReservationStatus,
  ServiceType,
} from './index';

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          email: string;
          phone: string;
          service: ServiceType;
          target_country: string | null;
          current_situation: string | null;
          message: string | null;
          preferred_date: string | null;
          preferred_slot: PreferredSlot | null;
          status: ReservationStatus;
          admin_notes: string | null;
          cv_path: string | null;
          cv_filename: string | null;
          cv_size_bytes: number | null;
          cv_mime: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          service: ServiceType;
          target_country?: string | null;
          current_situation?: string | null;
          message?: string | null;
          preferred_date?: string | null;
          preferred_slot?: PreferredSlot | null;
          status?: ReservationStatus;
          admin_notes?: string | null;
          cv_path?: string | null;
          cv_filename?: string | null;
          cv_size_bytes?: number | null;
          cv_mime?: string | null;
        };
        Update: {
          status?: ReservationStatus;
          admin_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          role: 'user' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          role?: 'user' | 'admin';
        };
        Update: {
          email?: string | null;
          role?: 'user' | 'admin';
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      reservation_status: ReservationStatus;
      service_type: ServiceType;
    };
    CompositeTypes: Record<string, never>;
  };
}
