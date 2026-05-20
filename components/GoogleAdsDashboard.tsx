'use client';

import { useState } from 'react';
import { googleAdsData, googleAdsTotals, type GoogleAdsRow, type GoogleAdsTotal } from '@/lib/googleAdsData';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtRoas = (n: number) => `${n.toFixed(2)}x`;

const googleAdsTotalsN1: GoogleAdsTotal[] | null = null;
const googleAdsDataN1: GoogleAdsRow[] | null = null;

const PERIODS = [
  { value: '7d',  label: '7j' },
  { value: '14d', label: '14j' },
  { value: '30d', label: '30j' },
] as const;
type Period = typeof PERIODS[number]['value'];

const PARTNERS = ['Tous', 'CVS', 'WG', 'Picta'] as const;
type Partner = typeof PARTNERS[number];

const PARTNER_BADGE: Record<string, string> = {
  CVS:   'bg-blue-100 text-blue-700',
  WG:    'bg-emerald-100 text-emerald-700',
  Picta: 'bg-primary-100 text-primary-700',
};

const PARTNER_DOT: Record<string, string> = {
  CVS:   'bg-blue-500',
  WG:    'bg-emerald-500',
  Picta: 'bg-primary-500',
};

function roasBadge(roas: number) {
  let cls = 'bg-error-100 text-error-700';
  if (roas >= 5)      cls = 'bg-primary-100 text-primary-700';
  else if (roas >= 3) cls = 'bg-success-100 text-success-700';
  else if (roas >= 2) cls = 'bg-tertiary-100 text-tertiary-700';
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-bold num ${cls}`}>{fmtRoas(roas)}</span>;
}

function ctrBadge(ctr: number) {
  let cls = 'text-error-600';
  if (ctr > 15)      cls = 'text-success-600';
  else if (ctr >= 5) cls = 'text-tertiary-600';
  return <span className={`num text-xs font-semibold ${cls}`}>{fmtPct(ctr)}</span>;
}

function DeltaBadge({ current, prev }: { current: number; prev: number | null }) {
  if (prev === null) return null;
  const pct = ((current - prev) / Math.abs(prev)) * 100;
  const up = pct >= 0;
  return (
    <span className={`text-[11px] font-semibold ${up ? 'text-success-600' : 'text-error-500'}`}>
      {up ? '+' : ''}{pct.toFixed(1)}%
    </span>
  );
}

type SortKey = keyof Pick<GoogleAdsRow, 'cost' | 'clicks' | 'roas' | 'ctr' | 'conversions' | 'convValue'>;

function CampaignTable({ data, showN1 }: { data: GoogleAdsRow[]; showN1: boolean }) {
  const [sort, setSort] = useState<SortKey>('cost');
  const [asc, setAsc] = useState(false);

  const sorted = [...data].sort((a, b) => {
    const diff = a[sort] - b[sort];
    return asc ? diff : -diff;
  });

  const th = (key: SortKey, label: string, right = true) => (
    <th
      className={`px-4 py-3 text-[11px] font-medium text-ink-500 uppercase tracking-wider cursor-pointer hover:text-primary-700 select-none whitespace-nowrap ${right ? 'text-right' : 'text-left'}`}
      onClick={() => { if (sort === key) setAsc(!asc); else { setSort(key); setAsc(false); } }}
    >
      {label}{sort === key ? (asc ? ' ↑' : ' ↓') : ''}
    </th>
  );

  return (
    <div className="rounded-2xl bg-white border border-ink-200/70 overflow-hidden card">
      <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">{sorted.length} groupes d'annonces</span>
        {showN1 && !googleAdsDataN1 && (
          <span className="text-[11px] text-tertiary-600 bg-tertiary-50 border border-tertiary-200 rounded-full px-3 py-1">
            Données N-1 non disponibles
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-ink-100">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-ink-500 uppercase tracking-wider">Campagne</th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-ink-500 uppercase tracking-wider">Partenaire</th>
              {th('cost', 'Coût')}
              {th('clicks', 'Clics')}
              {th('ctr', 'CTR')}
              {th('conversions', 'Conv.')}
              {th('convValue', 'Valeur')}
              {th('roas', 'ROAS')}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {sorted.map((row, i) => (
              <tr key={i} className="hover:bg-primary-50/40 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink-900 text-xs">{row.campaign}</p>
                  <p className="text-ink-400 text-[11px] mt-0.5">{row.adGroup}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${PARTNER_BADGE[row.partner] || 'bg-ink-100 text-ink-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${PARTNER_DOT[row.partner] || 'bg-ink-400'}`} />
                    {row.partner}
                  </span>
                </td>
                <td className="px-4 py-3 text-right num text-xs font-semibold text-ink-900">{fmtCurrency(row.cost)}</td>
                <td className="px-4 py-3 text-right num text-xs text-ink-700">{fmt(row.clicks)}</td>
                <td className="px-4 py-3 text-right">{ctrBadge(row.ctr)}</td>
                <td className="px-4 py-3 text-right num text-xs text-ink-700">{fmt(row.conversions)}</td>
                <td className="px-4 py-3 text-right num text-xs text-ink-700">{fmtCurrency(row.convValue)}</td>
                <td className="px-4 py-3 text-right">{roasBadge(row.roas)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-ink-200 bg-ink-50">
            <tr>
              <td className="px-4 py-3 text-[11px] font-display text-ink-700 uppercase tracking-wider" colSpan={2}>Total</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-primary-800">{fmtCurrency(data.reduce((s, r) => s + r.cost, 0))}</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{fmt(data.reduce((s, r) => s + r.clicks, 0))}</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{fmt(data.reduce((s, r) => s + r.conversions, 0))}</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{fmtCurrency(data.reduce((s, r) => s + r.convValue, 0))}</td>
              <td className="px-4 py-3 text-right">{roasBadge(data.reduce((s, r) => s + r.convValue, 0) / data.reduce((s, r) => s + r.cost, 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function GoogleAdsDashboard() {
  const [partner, setPartner] = useState<Partner>('Tous');
  const [period, setPeriod]   = useState<Period>('30d');
  const [showN1, setShowN1]   = useState(false);

  const filtered    = partner === 'Tous' ? googleAdsData    : googleAdsData.filter((r) => r.partner === partner);
  const shownTotals = partner === 'Tous' ? googleAdsTotals  : googleAdsTotals.filter((t) => t.partner === partner);

  const totalCost        = shownTotals.reduce((s, t) => s + t.totalCost, 0);
  const totalClicks      = shownTotals.reduce((s, t) => s + t.totalClicks, 0);
  const totalConversions = shownTotals.reduce((s, t) => s + t.totalConversions, 0);
  const totalConvValue   = shownTotals.reduce((s, t) => s + t.totalConvValue, 0);
  const globalRoas       = totalCost > 0 ? totalConvValue / totalCost : 0;

  const PERIOD_LABEL: Record<Period, string> = {
    '7d': '7 derniers jours',
    '14d': '14 derniers jours',
    '30d': 'Jan–Mai 2026',
  };

  return (
    <div className="bg-ink-50 min-h-full">
      {/* Sub-header */}
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">Google</span>
            <span className="font-display text-lg text-primary-800 leading-none">Ads</span>
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Period */}
            <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
              {PERIODS.map((p) => (
                <button key={p.value} onClick={() => setPeriod(p.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${period === p.value ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Partner */}
            <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
              {PARTNERS.map((p) => (
                <button key={p} onClick={() => setPartner(p)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${partner === p ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                  {p}
                </button>
              ))}
            </div>

            {/* N-1 toggle */}
            <button onClick={() => setShowN1(!showN1)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${showN1 ? 'bg-tertiary-500 border-tertiary-500 text-white' : 'bg-white border-ink-200 text-ink-500 hover:border-ink-300'}`}>
              vs N-1
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">Acquisition payante</div>
          <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">Google Ads</h1>
          <p className="mt-2 text-xs text-ink-500">{PERIOD_LABEL[period]} · {filtered.length} groupes actifs</p>
        </div>

        {/* Hero KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Hero spend — dark purple */}
          <div className="col-span-2 md:col-span-1 rounded-2xl bg-primary-800 p-6">
            <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium">Dépenses totales</div>
            <div className="font-display num text-4xl text-white leading-none mt-3">{fmtCurrency(totalCost)}</div>
            <div className="mt-3 text-primary-300 text-xs">{PERIOD_LABEL[period]}</div>
          </div>

          {/* ROAS — orange */}
          <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">ROAS global</div>
            <div className="font-display num text-4xl text-tertiary-500 leading-none mt-3">{fmtRoas(globalRoas)}</div>
            <div className="mt-3 text-xs text-ink-400">valeur / dépenses</div>
          </div>

          <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Clics totaux</div>
            <div className="font-display num text-4xl text-primary-800 leading-none mt-3">{fmt(totalClicks)}</div>
            <div className="mt-3 text-xs text-ink-400">{shownTotals.map(t => `CTR ${fmtPct(t.avgCtr)}`).join(' · ')}</div>
          </div>

          <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Conversions</div>
            <div className="font-display num text-4xl text-primary-800 leading-none mt-3">{fmt(totalConversions)}</div>
            <div className="mt-3 text-xs text-ink-400">{fmtCurrency(totalConvValue)} valeur</div>
          </div>
        </section>

        {/* Partner breakdown */}
        {partner === 'Tous' && (
          <section className="grid grid-cols-3 gap-4 mb-10">
            {googleAdsTotals.map((t) => (
              <div key={t.partner} className="rounded-2xl bg-white border border-ink-200/70 p-5 card">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2 h-2 rounded-full ${PARTNER_DOT[t.partner] || 'bg-ink-400'}`} />
                  <span className="text-[11px] font-medium text-ink-500 uppercase tracking-wider">{t.partner}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider">Dépenses</div>
                    <div className="font-display num text-xl text-primary-800 leading-tight mt-0.5">{fmtCurrency(t.totalCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider">ROAS</div>
                    <div className="font-display num text-xl text-tertiary-500 leading-tight mt-0.5">{fmtRoas(t.avgRoas)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider">Clics</div>
                    <div className="font-display num text-xl text-ink-800 leading-tight mt-0.5">{fmt(t.totalClicks)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider">Conv.</div>
                    <div className="font-display num text-xl text-ink-800 leading-tight mt-0.5">{fmt(t.totalConversions)}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* N-1 banner */}
        {showN1 && !googleAdsTotalsN1 && (
          <div className="mb-6 flex items-center gap-3 bg-tertiary-50 border border-tertiary-200 rounded-2xl px-5 py-3 text-sm text-tertiary-700">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-400 flex-shrink-0" />
            Données N-1 non disponibles — importez un export Google Ads Jan–Mai 2025.
          </div>
        )}

        {/* Campaign table */}
        <CampaignTable data={filtered} showN1={showN1} />
      </div>

      <footer className="max-w-[1280px] mx-auto px-6 py-8 text-xs text-ink-400">
        Picta US · {PERIOD_LABEL[period]} · données agrégées par groupe d'annonces
      </footer>
    </div>
  );
}
