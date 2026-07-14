import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copia .env.example a .env.local y rellena los valores."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export type BlockedDate = {
  id: string;
  date: string;
  reason: string | null;
  created_at: string;
};

export type Cita = {
  id: string;
  created_at: string;
  nombre: string;
  telefono: string;
  evento: string | null;
  personas: number | null;
  paquete: string | null;
  fecha_evento: string | null;
  fecha_visita: string | null;
  hora_visita: string | null;
  degustacion: boolean;
  estado: "pendiente" | "aceptada" | "borrada";
  deleted_at: string | null;
};
