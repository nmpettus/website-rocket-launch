export const PUBLIC_SUPABASE_URL = "https://ppzpihpzmvgqumjvxuvb.supabase.co";
export const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwenBpaHB6bXZncXVtanZ4dXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzI4NTksImV4cCI6MjA4NDA0ODg1OX0.oMELHAOPgOVDiFMopdYVBkmcaHvhHYPeDoEQZ8cM5B0";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || PUBLIC_SUPABASE_ANON_KEY;
export const stripeClientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN || "";