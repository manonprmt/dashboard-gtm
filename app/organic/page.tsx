import { Suspense } from "react";
import { KpiCard } from "@/components/organic/KpiCard";
import { RangePicker } from "@/components/organic/RangePicker";
import { YearlyBarChart } from "@/components/organic/YearlyBarChart";
import { TopPostsSection } from "@/components/organic/TopPosts";
import { TokenBanner } from "@/components/organic/TokenBanner";
import {
  currentMonth,
  customRange,
  fmtMonthInput,
  monthRange,
} from "@/lib/organic/dates";
import {
  getKpis,
  getMonthlyBars,
  getTopPosts,
  getStoryDataAvailableFrom,
} from "@/lib/organic/queries";
import { getSnapshotMeta } from "@/lib/organic/snapshots";
import { fmtNum, fmtPct } from "@/lib/organic/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

const REQUIRED_VARS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "IG_BUSINESS_ID", "IG_ACCESS_TOKEN"];

function isConfigured() {
  return REQUIRED_VARS.every((v) => Boolean(process.env[v]));
}

function NotConfigured() {
  return (
    <div className="bg-ink-50 min-h-full">
      <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
        <div className="text-4xl mb-4">🔧</div>
        <h1 className="font-display text-3xl text-primary-800 mb-3">Organic dashboard not configured</h1>
        <p className="text-ink-500 mb-8 text-sm leading-relaxed">
          This section requires Instagram and Supabase credentials to be set as environment variables on Vercel.
        </p>
        <div className="bg-white rounded-2xl border border-ink-200 p-6 text-left text-sm font-mono space-y-2 text-ink-700">
          {REQUIRED_VARS.map((v) => (
            <div key={v} className="flex items-center gap-3">
              <span className={process.env[v] ? "text-green-600" : "text-red-500"}>
                {process.env[v] ? "✓" : "✗"}
              </span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-ink-400">
          Add these in Vercel → Project Settings → Environment Variables, then redeploy.
        </p>
      </div>
    </div>
  );
}

function rangeFromSearch(sp: { month?: string; from?: string; to?: string }) {
  if (sp.from && sp.to) return customRange(sp.from, sp.to);
  if (sp.month) {
    const [y, m] = sp.month.split("-").map(Number);
    if (y && m) return monthRange(y, m - 1);
  }
  return currentMonth();
}

export default async function OrganicPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; from?: string; to?: string }>;
}) {
  if (!isConfigured()) return <NotConfigured />;

  const sp = await searchParams;
  const range = rangeFromSearch(sp);
  const isCurrentMonth = range.start.getTime() === currentMonth().start.getTime();

  const [kpis, yearly, topStatics, topReels, storyFrom, snapshotMeta] =
    await Promise.all([
      getKpis(range),
      getMonthlyBars(),
      getTopPosts(range, "static", 4),
      getTopPosts(range, "reel", 2),
      getStoryDataAvailableFrom(),
      isCurrentMonth ? null : getSnapshotMeta(range),
    ]);

  return (
    <div className="bg-ink-50 min-h-full">
      <TokenBanner />

      {/* Organic sub-header */}
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">Organic</span>
            <span className="font-display text-lg text-primary-800 leading-none">SoMe</span>
          </div>
          <nav className="flex gap-5 text-sm text-ink-500 ml-2">
            <Link href="/organic" className="text-primary-800 font-medium transition">
              Overview
            </Link>
            <Link href="/organic/compare" className="hover:text-primary-800 transition">
              Compare
            </Link>
          </nav>
          <div className="flex-1" />
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-800 text-[11px] font-medium px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            @pictaphotoapp · organic · no crossposts
          </span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">
              Performance
            </div>
            <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">
              {range.label}
            </h1>
            {isCurrentMonth && (
              <p className="mt-2 text-xs italic text-ink-500">
                *month in progress, KPIs to be verified and analyzed EOM
              </p>
            )}
            {!isCurrentMonth && snapshotMeta && (
              <p className="mt-2 text-xs text-ink-500">
                🔒 Finalized{" "}
                {new Date(snapshotMeta.frozen_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "America/New_York",
                })}
              </p>
            )}
          </div>
          <Suspense fallback={null}>
            <RangePicker defaultMonth={fmtMonthInput(range.start)} />
          </Suspense>
        </div>

        {/* Primary KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <KpiCard
            label="Total Followers"
            value={kpis.followers_end}
            tone="primary"
            big
            sublabel={
              kpis.followers_delta != null
                ? `${kpis.followers_delta >= 0 ? "+" : ""}${fmtNum(kpis.followers_delta)} this period`
                : "no data yet"
            }
          />
          <KpiCard label="Organic Reach" value={kpis.organic_reach} big tone="primary" />
          <KpiCard label="Total Views" value={kpis.total_views} big tone="primary" />
          <KpiCard
            label="Engagement Rate"
            value={fmtPct(kpis.engagement_rate, 2)}
            big
            tone="tertiary"
            sublabel="content interactions ÷ total views"
          />
        </section>

        {/* Secondary KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <KpiCard label="Reels Posted" value={kpis.reels_posted} />
          <KpiCard label="Static Posts" value={kpis.static_posted} />
          <KpiCard label="Page Visits" value={kpis.page_visits} />
          <KpiCard label="Reel Views" value={kpis.reel_views} />
          <KpiCard label="Story Views" value={kpis.story_views} />
          <KpiCard label="Saves" value={kpis.saves} />
          <KpiCard label="Shares" value={kpis.shares} />
          <KpiCard label="Comments" value={kpis.comments} />
        </section>

        {/* YTD bar chart */}
        <section className="mb-10">
          <YearlyBarChart data={yearly} />
        </section>

        {/* Content interactions breakdown */}
        <section className="mb-16 rounded-2xl bg-white border border-ink-200/70 p-6 card">
          <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-4">
            Content interactions
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            <Stat label="Likes" value={kpis.likes} />
            <Stat label="Comments" value={kpis.comments} />
            <Stat label="Shares" value={kpis.shares} />
            <Stat label="Replies" value={kpis.replies} />
            <Stat label="Saves" value={kpis.saves} />
            <Stat label="Profile Visits" value={kpis.profile_visits} />
          </div>
        </section>

        {/* Top posts */}
        <TopPostsSection statics={topStatics} reels={topReels} />

        {storyFrom && (
          <p className="mt-12 text-xs text-ink-400 text-center">
            Story data available from {storyFrom}
          </p>
        )}
      </div>

      <footer className="max-w-[1280px] mx-auto px-6 py-8 text-xs text-ink-400">
        All times in America/New_York · Organic only · Owner-posted content (no crossposts) · No ads/boosted
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="text-xs text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl num text-ink-900">{fmtNum(value)}</div>
    </div>
  );
}
