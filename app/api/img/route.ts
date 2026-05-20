import { NextResponse } from "next/server";

// Server-side image proxy for Instagram CDN thumbnails.
// IG returns 403 for browser-originated requests (hotlink prevention),
// so we fetch server-side using a fresh URL from the Graph API.
// Usage: <img src="/api/img?id={ig_post_id}" />

export const runtime = "nodejs";

const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION ?? "v21.0";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: "missing or invalid id" }, { status: 400 });
  }
  if (!IG_ACCESS_TOKEN) {
    return NextResponse.json({ error: "IG_ACCESS_TOKEN not configured" }, { status: 503 });
  }

  let freshUrl: string | undefined;
  try {
    const meta = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${id}?fields=thumbnail_url,media_url&access_token=${IG_ACCESS_TOKEN}`,
      { cache: "no-store" },
    );
    if (!meta.ok) {
      return NextResponse.json({ error: "graph api error" }, { status: 502 });
    }
    const data = (await meta.json()) as { thumbnail_url?: string; media_url?: string };
    freshUrl = data.thumbnail_url ?? data.media_url;
  } catch {
    return NextResponse.json({ error: "graph api unreachable" }, { status: 502 });
  }
  if (!freshUrl) {
    return NextResponse.json({ error: "no media url" }, { status: 404 });
  }

  const upstream = await fetch(freshUrl, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "image fetch failed" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
