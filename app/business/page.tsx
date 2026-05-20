'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const AdjustTab = dynamic(() => import('@/components/business/AdjustTab'), { ssr: false });

type Tab = 'analytics' | 'adjust';
const TABS: { id: Tab; label: string }[] = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'adjust',    label: 'Adjust — Origines' },
];

export default function BusinessPage() {
  const [tab, setTab] = useState<Tab>('analytics');

  return (
    <div className="bg-ink-50 min-h-full flex flex-col">
      {/* Sub-header */}
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">Business</span>
            <span className="font-display text-lg text-primary-800 leading-none">General</span>
          </div>

          <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
            {TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${tab === id ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics tab — Looker Studio embed */}
      {tab === 'analytics' && (
        <div className="flex-1 flex flex-col">
          <div className="max-w-[1280px] mx-auto px-6 pt-8 pb-4 w-full">
            <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">Vue générale</div>
            <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">Analytics</h1>
            <p className="mt-2 text-xs text-ink-500">Looker Studio · données consolidées Picta</p>
          </div>
          <div className="flex-1 mx-auto w-full max-w-[1280px] px-6 pb-10">
            <div className="rounded-2xl overflow-hidden border border-ink-200/70 card bg-white" style={{ height: '780px' }}>
              <iframe
                src="https://lookerstudio.google.com/embed/reporting/86454fa6-6e17-450c-9a9a-fcace2743584"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
            <p className="mt-3 text-xs text-ink-400 text-center">
              Si le rapport ne s'affiche pas, <a href="https://datastudio.google.com/u/0/reporting/86454fa6-6e17-450c-9a9a-fcace2743584" target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">ouvrir dans Looker Studio ↗</a>
            </p>
          </div>
        </div>
      )}

      {/* Adjust tab */}
      {tab === 'adjust' && <AdjustTab />}
    </div>
  );
}
