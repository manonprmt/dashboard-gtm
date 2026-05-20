import { Suspense } from "react";
import { ComparePicker } from "@/components/organic/ComparePicker";
import { CompareTable } from "@/components/organic/CompareTable";
import {
  currentMonth,
  customRange,
  previousMonth,
  sameMonthLastYear,
  type DateRange,
} from "@/lib/organic/dates";
import { getKpis } from "@/lib/organic/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

const REQUIRED_VARS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "IG_BUSINESS_ID", "IG_ACCESS_TOKEN"];

function isConfigured() {
  return REQUIRED_VARS.every((v) => Boolean(process.env[v]));
}

type Params = {
  preset?: "mom" | "yoy" | "custom";
  aFrom?: string;
  aTo?: string;
  bFrom?: string;
  bTo?: string;
};

function resolve(sp: Params): { a: DateRange; b: DateRange } {
  const preset = sp.preset ?? "mom";
  if (preset === "custom" && sp.aFrom && sp.aTo && sp.bFrom && sp.bTo) {
    return { a: customRange(sp.aFrom, sp.aTo), b: customRange(sp.bFrom, sp.bTo) };
  }
  const now = currentMonth();
  if (preset === "yoy") return { a: sameMonthLastYear(now), b: now };
  return { a: previousMonth(now), b: now };
}

export default async function OrganicComparePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  if (!isConfigured()) {
    return (
      <div className="bg-ink-50 min-h-full flex items-center justify-center">
        <div className="text-center py-20 px-6">
          <div className="text-4xl mb-4">🔧</div>
          <h1 className="font-display text-2xl text-primary-800 mb-2">Organic dashboard not configured</h1>
          <p className="text-ink-500 text-sm">Add the required environment variables on Vercel to enable this section.</p>
        </div>
      </div>
    );
  }

  const sp = await searchParams;
  const { a, b } = resolve(sp);
  const [aKpis, bKpis] = await Promise.all([getKpis(a), getKpis(b)]);

  return (
    <div className="bg-ink-50 min-h-full">
      {/* Organic sub-header */}
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">Organic</span>
            <span className="font-display text-lg text-primary-800 leading-none">SoMe</span>
          </div>
          <nav className="flex gap-5 text-sm text-ink-500 ml-2">
            <Link href="/organic" className="hover:text-primary-800 transition">
              Overview
            </Link>
            <Link href="/organic/compare" className="text-primary-800 font-medium transition">
              Compare
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">Compare</div>
          <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">
            {a.label} <span className="text-ink-300">vs.</span> {b.label}
          </h1>
        </div>

        <div className="mb-8">
          <Suspense fallback={null}>
            <ComparePicker />
          </Suspense>
        </div>

        <CompareTable a={aKpis} b={bKpis} aLabel={a.label} bLabel={b.label} />

        <p className="mt-6 text-xs text-ink-400">
          Deltas compare {b.label} to {a.label}. Up arrows (orange) = higher in {b.label}; down arrows
          (red) = lower.
        </p>
      </div>
    </div>
  );
}
