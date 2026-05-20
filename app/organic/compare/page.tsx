import Link from "next/link";

export default function OrganicComparePage() {
  return (
    <div className="bg-ink-50 min-h-full">
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">Organic</span>
            <span className="font-display text-lg text-primary-800 leading-none">SoMe</span>
          </div>
          <nav className="flex gap-5 text-sm text-ink-500 ml-2">
            <Link href="/organic" className="hover:text-primary-800 transition">Overview</Link>
            <Link href="/organic/compare" className="text-primary-800 font-medium">Compare</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h1 className="font-display text-3xl text-primary-800 mb-2">Compare — coming soon</h1>
        <p className="text-ink-500 text-sm">Historical comparison will be added once monthly data is accumulated.</p>
        <Link href="/organic" className="mt-6 inline-block text-sm text-primary-700 hover:underline">
          ← Back to overview
        </Link>
      </div>
    </div>
  );
}
