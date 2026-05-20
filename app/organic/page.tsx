import Link from "next/link";
import { YearlyBarChart } from "@/components/organic/YearlyBarChart";
import { fmtNum, fmtPct } from "@/lib/organic/format";
import {
  organicKpis,
  organicCurrentMonth,
  organicMonthlyBars,
  organicTopStatics,
  organicTopReels,
  type StaticTopPost,
} from "@/lib/organicData";

export default function OrganicPage() {
  const kpis = organicKpis;

  return (
    <div className="bg-ink-50 min-h-full">
      {/* Sub-header */}
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">Organic</span>
            <span className="font-display text-lg text-primary-800 leading-none">SoMe</span>
          </div>
          <div className="flex-1" />
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-800 text-[11px] font-medium px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            @pictaphotoapp · organic · no crossposts
          </span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">Performance</div>
          <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">
            {organicCurrentMonth}
          </h1>
          <p className="mt-2 text-xs italic text-ink-500">
            *month in progress, KPIs to be verified and analyzed EOM
          </p>
        </div>

        {/* Primary KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <KpiCard
            label="Total Followers"
            value={fmtNum(kpis.followers_end)}
            tone="primary"
            big
            sublabel={`+${fmtNum(kpis.followers_delta)} this period`}
          />
          <KpiCard label="Organic Reach" value={fmtNum(kpis.organic_reach)} big tone="primary" />
          <KpiCard label="Total Views"   value={fmtNum(kpis.total_views)}   big tone="primary" />
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
          <KpiCard label="Reels Posted"  value={fmtNum(kpis.reels_posted)} />
          <KpiCard label="Static Posts"  value={fmtNum(kpis.static_posted)} />
          <KpiCard label="Page Visits"   value={fmtNum(kpis.page_visits)} />
          <KpiCard label="Reel Views"    value={fmtNum(kpis.reel_views)} />
          <KpiCard label="Story Views"   value={fmtNum(kpis.story_views)} />
          <KpiCard label="Saves"         value={fmtNum(kpis.saves)} />
          <KpiCard label="Shares"        value={fmtNum(kpis.shares)} />
          <KpiCard label="Comments"      value={fmtNum(kpis.comments)} />
        </section>

        {/* YTD chart */}
        <section className="mb-10">
          <YearlyBarChart data={organicMonthlyBars} />
        </section>

        {/* Content interactions */}
        <section className="mb-16 rounded-2xl bg-white border border-ink-200/70 p-6 card">
          <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-4">
            Content interactions
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            <Stat label="Likes"          value={kpis.likes} />
            <Stat label="Comments"       value={kpis.comments} />
            <Stat label="Shares"         value={kpis.shares} />
            <Stat label="Replies"        value={kpis.replies} />
            <Stat label="Saves"          value={kpis.saves} />
            <Stat label="Profile Visits" value={kpis.profile_visits} />
          </div>
        </section>

        {/* Top posts */}
        <TopPostsSection statics={organicTopStatics} reels={organicTopReels} />
      </div>

      <footer className="max-w-[1280px] mx-auto px-6 py-8 text-xs text-ink-400">
        All times in America/New_York · Organic only · Owner-posted content · No ads/boosted
      </footer>
    </div>
  );
}

// ─── Small components ────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sublabel,
  tone = "default",
  big = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "default" | "primary" | "tertiary";
  big?: boolean;
}) {
  const color =
    tone === "primary" ? "text-primary-800"
    : tone === "tertiary" ? "text-tertiary-700"
    : "text-ink-900";
  return (
    <div className="rounded-2xl bg-white border border-ink-200/70 p-5 card">
      <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">{label}</div>
      <div className={`mt-2 font-display num ${color} ${big ? "text-5xl" : "text-3xl"} leading-none`}>
        {value}
      </div>
      {sublabel && <div className="mt-2 text-xs text-ink-500">{sublabel}</div>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl num text-ink-900">{fmtNum(value)}</div>
    </div>
  );
}

function TopPostsSection({
  statics,
  reels,
}: {
  statics: StaticTopPost[];
  reels: StaticTopPost[];
}) {
  return (
    <div className="space-y-16">
      <TopGroup title="Top Performing Instagram" scriptWord="Posts" posts={statics} variant="static" />
      <TopGroup title="Top Performing Instagram" scriptWord="Reels" posts={reels} variant="reel" />
    </div>
  );
}

function TopGroup({
  title,
  scriptWord,
  posts,
  variant,
}: {
  title: string;
  scriptWord: string;
  posts: StaticTopPost[];
  variant: "static" | "reel";
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 items-start">
      <div>
        <h2 className="font-display text-[3.25rem] leading-[1.05] text-primary-800">
          {title}
          <span className="block font-script text-tertiary-500 text-[4rem] leading-none -mt-2 ml-12">
            {scriptWord}
          </span>
        </h2>
      </div>
      {posts.length === 0 ? (
        <div className="text-sm text-ink-400 rounded-2xl border border-dashed border-ink-200 p-8 text-center">
          No {variant === "reel" ? "reels" : "static posts"} this period.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} variant={variant} />
          ))}
        </div>
      )}
    </section>
  );
}

function PostCard({ post, variant }: { post: StaticTopPost; variant: "static" | "reel" }) {
  const titleText = post.caption.split("\n")[0].slice(0, 60);
  const frameCls =
    variant === "reel"
      ? "aspect-[9/16] rounded-[28px] overflow-hidden bg-ink-100 border-[6px] border-ink-900 shadow-xl"
      : "aspect-square rounded-xl overflow-hidden bg-ink-100";

  return (
    <a
      href={post.permalink ?? "#"}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <div className="text-sm font-medium text-ink-800 mb-2 line-clamp-1">{titleText}</div>
      <div className={frameCls}>
        <div className="w-full h-full grid place-items-center text-ink-400 text-xs">
          📷
        </div>
      </div>
      <dl className="mt-3 text-xs text-ink-600 leading-relaxed">
        <Row label="Likes"    value={fmtNum(post.likes)} />
        <Row label="Comments" value={fmtNum(post.comments)} />
        <Row label="Shares"   value={fmtNum(post.shares)} />
        <Row label="Saves"    value={fmtNum(post.saves)} />
      </dl>
    </a>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-ink-100 last:border-0 py-1">
      <dt className="text-ink-500">{label}</dt>
      <dd className="num text-ink-800 font-medium">{value}</dd>
    </div>
  );
}
