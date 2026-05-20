import { env } from "./env";

const BASE = `https://graph.facebook.com/${env.GRAPH_API_VERSION}`;

type QueryParams = Record<string, string | number | undefined>;

async function graph<T>(path: string, params: QueryParams = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("access_token", env.IG_ACCESS_TOKEN);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  const text = await res.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Graph API non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg = (body as { error?: { message?: string } })?.error?.message ?? text;
    throw new Error(`Graph API ${res.status} on ${path}: ${msg}`);
  }
  return body as T;
}

export async function fetchAccountProfileViewsTotal(
  sinceUnix: number,
  untilUnix: number,
): Promise<number | null> {
  const MAX = 30 * 24 * 60 * 60;
  let total = 0;
  let any = false;
  let cursor = sinceUnix;
  while (cursor < untilUnix) {
    const chunkEnd = Math.min(cursor + MAX, untilUnix);
    try {
      const res = await graph<{
        data: { name: string; total_value?: { value: number } }[];
      }>(`/${env.IG_BUSINESS_ID}/insights`, {
        metric: "profile_views",
        metric_type: "total_value",
        period: "day",
        since: cursor,
        until: chunkEnd,
      });
      const v = res.data?.[0]?.total_value?.value;
      if (typeof v === "number") {
        total += v;
        any = true;
      }
    } catch {
      /* tolerate per-chunk failures */
    }
    cursor = chunkEnd;
  }
  return any ? total : null;
}

export async function getTokenStatus(): Promise<{
  expires_at: string | null;
  days_remaining: number | null;
}> {
  // Fetches token expiry from Supabase token_status table.
  // Import inline to avoid circular deps.
  const { supabaseAdmin } = await import("./supabase");
  const db = supabaseAdmin();
  const { data } = await db
    .from("token_status")
    .select("expires_at")
    .eq("platform", "instagram")
    .maybeSingle();
  const expires_at = data?.expires_at ?? null;
  const days_remaining = expires_at
    ? Math.floor((new Date(expires_at).getTime() - Date.now()) / 86400000)
    : null;
  return { expires_at, days_remaining };
}
