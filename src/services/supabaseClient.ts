import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side client using the public "publishable" key — safe to expose,
 * restricted to read-only access by the RLS policy on signal_snapshots
 * (see supabase/schema.sql). Writing history is done separately by a
 * scheduled GitHub Action using the service_role key, never in the browser.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
