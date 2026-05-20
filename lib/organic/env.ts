function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// Lazy getters — evaluated at request time, not at module load / build time.
// This prevents the build from failing when env vars aren't set in CI.
export const env = {
  get IG_BUSINESS_ID() { return required("IG_BUSINESS_ID"); },
  get IG_ACCESS_TOKEN() { return required("IG_ACCESS_TOKEN"); },
  GRAPH_API_VERSION: process.env.GRAPH_API_VERSION ?? "v21.0",
  get SUPABASE_URL() { return required("SUPABASE_URL"); },
  get SUPABASE_SERVICE_ROLE_KEY() { return required("SUPABASE_SERVICE_ROLE_KEY"); },
  TIMEZONE: "America/New_York" as const,
};
