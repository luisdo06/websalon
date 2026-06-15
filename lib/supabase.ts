import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ucerhgnsjkkxzqqjupug.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZXJoZ25zamtreHpxcWp1cHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODczOTcsImV4cCI6MjA5NzA2MzM5N30.hshh-5VCIF9mAs4NfTItdtAoTlFqrhMehDHLGTAlrKQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export type BlockedDate = {
  id: string;
  date: string;
  reason: string | null;
  created_at: string;
};
