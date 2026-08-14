import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Browser-side client using the public "publishable" key — safe to expose,
 * restricted to read-only access by the RLS policy on signal_snapshots
 * (see supabase/schema.sql). Writing history is done separately by a
 * scheduled GitHub Action using the service_role key, never in the browser.
 *
 * `createClient` throws synchronously if the URL is missing, which would
 * crash the whole page at import time — null instead, and let callers
 * (fetchScoreHistory) fail gracefully like any other unavailable data source.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
