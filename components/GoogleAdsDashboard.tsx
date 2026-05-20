'use client';

import { useState } from 'react';
import { googleAdsData, googleAdsTotals, type GoogleAdsRow, type GoogleAdsTotal } from '@/lib/googleAdsData';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtRoas = (n: number) => `${n.toFixed(2)}x`;

// ─── N-1 data (empty — to be filled when exports are available) ───────────────
const googleAdsTotalsN1: GoogleAdsTotal[] | null = null;
const googleAdsDataN1: GoogleAdsRow[] | null = null;

// ─── Period presets ───────────────────────────────────────────────────────────
const PERIODS = [
  { value: '7d',  label: '7 jours' },
  { value: '14d', label: '14 jours' },
  { value: '30d', label: '30 jours' },
] as const;
type Period = typeof PERIODS[number]['value'];

const PARTNERS = ['Tous', 'CVS', 'WG', 'Picta'] as const;
type Partner = typeof PARTNERS[number];

// Partner accent kept intentionally distinct (brand colours)
const PARTNER_ACCENT: Record<string, string> = {
  CVS:   'from-blue-500 to-blue-600',
  WG:    'from-emerald-500 to-emerald-600',
  Picta: 'from-primary-600 to-primary-700',
};
const PARTNER_BADGE: Record<string, string> = {
  CVS:   'bg-blue-100 text-blue-700 border-blue-200',
  WG:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  Picta: 'bg-primary-100 text-primary-700 border-primary-200',
};

function roasBadge(roas: number) {
  let cls = 'bg-error-100 text-error-700';
  if (roas >= 5)      cls = 'bg-primary-100 text-primary-700';
  else if (roas >= 3) cls = 'bg-success-100 text-success-700';
  else if (roas >= 2) cls = 'bg-tertiary-100 text-tertiary-700';
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold num ${cls}`}>{fmtRoas(roas)}</span>;
}

function ctrBadge(ctr: number) {
  let cls = 'text-error-600';
  if (ctr > 15)      cls = 'text-success-600';
  else if (ctr >= 5) cls = 'text-tertiary-600';
  return <span className={`num text-xs font-semibold ${cls}`}>{fmtPct(ctr)}</span>;
}

function DeltaBadge({ current, prev }: { current: number; prev: number | null }) {
  if (prev === null) return <span className="text-ink-300 text-[10px] ml-1">—</span>;
  const pct = ((current - prev) / Math.abs(prev)) * 100;
  const up = pct >= 0;
  return (
    <span className={`text-[10px] font-semibold ml-1 ${up ? 'text-success-600' : 'text-error-500'}`}>
      {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function N1Empty() {
  return <span className="text-ink-300 text-xs num">—</span>;
}

function PartnerSummaryCard({ partner, showN1 }: { partner: string; showN1: boolean }) {
  const t    = googleAdsTotals.find((x) => x.partner === partner);
  const tN1  = googleAdsTotalsN1?.find((x) => x.partner === partner) ?? null;
  if (!t) return null;

  return (
    <div className="bg-white rounded-2xl border border-ink-200/70 card overflow-hidden">
      <div className={`bg-gradient-to-r ${PARTNER_ACCENT[partner]} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <span className="text-white font-display text-sm uppercase tracking-widest">{partner}</span>
          {showN1 && (
            <span className="text-white/60 text-[10px] font-medium border border-white/30 rounded px-1.5 py-0.5">
              N-1 : {tN1 ? fmtCurrency(tN1.totalCost) : '—'}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-white font-display num text-3xl">{fmtCurrency(t.totalCost)}</p>
          {showN1 && <DeltaBadge current={t.totalCost} prev={tN1?.totalCost ?? null} />}
        </div>
        <p className="text-white/70 text-xs mt-0.5">dépensé sur la période</p>
      </div>
      <div className="grid grid-cols-3 divide-x divide-ink-100">
        {[
          { label: 'ROAS',  value: fmtRoas(t.avgRoas),          n1: tN1 ? fmtRoas(tN1.avgRoas) : null },
          { label: 'Clics', value: fmt(t.totalClicks),           n1: tN1 ? fmt(tN1.totalClicks) : null,  sub: `CTR ${fmtPct(t.avgCtr)}` },
          { label: 'Conv.', value: fmt(t.totalConversions),      n1: tN1 ? fmt(tN1.totalConversions) : null, sub: fmtCurrency(t.totalConvValue) },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 text-center">
            <p className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">{s.label}</p>
            <p className="font-display num text-base text-ink-900 leading-tight mt-0.5">{s.value}</p>
            {showN1 && (
              <p className="text-[10px] text-ink-400 mt-0.5">
                N-1 : {s.n1 ?? <span className="text-ink-300">—</span>}
              </p>
            )}
            {!showN1 && s.sub && <p className="text-[10px] text-ink-400 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

type SortKey = keyof Pick<GoogleAdsRow, 'cost' | 'clicks' | 'roas' | 'ctr' | 'conversions' | 'convValue'>;

function CampaignTable({ data, dataN1, showN1 }: { data: GoogleAdsRow[]; dataN1: GoogleAdsRow[] | null; showN1: boolean }) {
  const [sort, setSort] = useState<SortKey>('cost');
  const [asc, setAsc] = useState(false);

  const sorted = [...data].sort((a, b) => {
    const diff = a[sort] - b[sort];
    return asc ? diff : -diff;
  });

  const findN1 = (row: GoogleAdsRow) =>
    dataN1?.find((r) => r.campaign === row.campaign && r.adGroup === row.adGroup) ?? null;

  const th = (key: SortKey, label: string) => (
    <th
      className="px-4 py-3 text-right text-[11px] font-medium text-ink-500 uppercase tracking-wider cursor-pointer hover:text-ink-800 select-none whitespace-nowrap"
      onClick={() => { if (sort === key) setAsc(!asc); else { setSort(key); setAsc(false); } }}
    >
      {label}{sort === key ? (asc ? ' ↑' : ' ↓') : ''}
    </th>
  );

  return (
    <div className="bg-white rounded-2xl border border-ink-200/70 card overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-100 flex items-center justify-between">
        <p className="text-sm font-display text-ink-700">{sorted.length} groupes d'annonces actifs</p>
        {showN1 && !dataN1 && (
          <span className="text-xs text-tertiary-700 bg-tertiary-50 border border-tertiary-200 rounded-full px-2.5 py-0.5">
            Données N-1 non disponibles
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-ink-100">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-ink-500 uppercase tracking-wider">Campagne / Groupe</th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-ink-500 uppercase tracking-wider">Partenaire</th>
              {th('cost', 'Coût')}
              {showN1 && <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-300 uppercase tracking-wider">N-1 Coût</th>}
              {th('clicks', 'Clics')}
              {showN1 && <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-300 uppercase tracking-wider">N-1 Clics</th>}
              {th('ctr', 'CTR')}
              {th('conversions', 'Conv.')}
              {th('convValue', 'Valeur')}
              {th('roas', 'ROAS')}
              {showN1 && <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-300 uppercase tracking-wider">N-1 ROAS</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {sorted.map((row, i) => {
              const n1 = showN1 ? findN1(row) : null;
              return (
                <tr key={i} className="hover:bg-ink-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900 text-xs">{row.campaign}</p>
                    <p className="text-ink-400 text-[11px]">{row.adGroup}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${PARTNER_BADGE[row.partner] || 'bg-ink-100 text-ink-600'}`}>
                      {row.partner}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right num text-xs font-semibold text-ink-900">{fmtCurrency(row.cost)}</td>
                  {showN1 && <td className="px-4 py-3 text-right">{n1 ? <span className="num text-xs text-ink-400">{fmtCurrency(n1.cost)}</span> : <N1Empty />}</td>}
                  <td className="px-4 py-3 text-right num text-xs text-ink-700">{fmt(row.clicks)}</td>
                  {showN1 && <td className="px-4 py-3 text-right">{n1 ? <span className="num text-xs text-ink-400">{fmt(n1.clicks)}</span> : <N1Empty />}</td>}
                  <td className="px-4 py-3 text-right">{ctrBadge(row.ctr)}</td>
                  <td className="px-4 py-3 text-right num text-xs text-ink-700">{fmt(row.conversions)}</td>
                  <td className="px-4 py-3 text-right num text-xs text-ink-700">{fmtCurrency(row.convValue)}</td>
                  <td className="px-4 py-3 text-right">{roasBadge(row.roas)}</td>
                  {showN1 && <td className="px-4 py-3 text-right">{n1 ? roasBadge(n1.roas) : <N1Empty />}</td>}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-ink-200 bg-ink-50">
            <tr>
              <td className="px-4 py-3 text-xs font-display text-ink-700" colSpan={2}>TOTAL</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmtCurrency(data.reduce((s, r) => s + r.cost, 0))}</td>
              {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmt(data.reduce((s, r) => s + r.clicks, 0))}</td>
              {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmt(data.reduce((s, r) => s + r.conversions, 0))}</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmtCurrency(data.reduce((s, r) => s + r.convValue, 0))}</td>
              <td className="px-4 py-3 text-right">{roasBadge(data.reduce((s, r) => s + r.convValue, 0) / data.reduce((s, r) => s + r.cost, 0))}</td>
              {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
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

  const filtered   = partner === 'Tous' ? googleAdsData   : googleAdsData.filter((r) => r.partner === partner);
  const filteredN1 = partner === 'Tous' ? googleAdsDataN1 : googleAdsDataN1?.filter((r) => r.partner === partner) ?? null;
  const shownTotals = partner === 'Tous' ? googleAdsTotals : googleAdsTotals.filter((t) => t.partner === partner);

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-ink-200/70 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl text-primary-800">Google Ads</h1>
            <p className="text-xs text-ink-400 mt-0.5">Picta US · {googleAdsData.length} groupes actifs</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Period selector */}
            <div className="flex items-center gap-1 bg-ink-100 p-1 rounded-full">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    period === p.value
                      ? 'bg-white text-primary-800 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* N-1 toggle */}
            <button
              onClick={() => setShowN1(!showN1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                showN1
                  ? 'bg-tertiary-50 border-tertiary-300 text-tertiary-700'
                  : 'bg-white border-ink-200 text-ink-500 hover:border-ink-300'
              }`}
            >
              <span>{showN1 ? '◉' : '○'}</span>
              Comparer N-1
            </button>

            {/* Partner filter */}
            <div className="flex items-center gap-1 bg-ink-100 p-1 rounded-full">
              {PARTNERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPartner(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    partner === p
                      ? 'bg-white text-primary-800 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">

        {/* N-1 banner */}
        {showN1 && !googleAdsTotalsN1 && (
          <div className="flex items-center gap-3 bg-tertiary-50 border border-tertiary-200 rounded-2xl px-4 py-3 text-sm text-tertiary-700">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Données N-1 non disponibles. Importez un export Google Ads sur la période Jan–Mai 2025 pour activer la comparaison.</span>
          </div>
        )}

        {/* Partner summary cards */}
        <div className={`grid gap-4 ${shownTotals.length === 1 ? 'grid-cols-1 max-w-sm' : shownTotals.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {shownTotals.map((t) => (
            <PartnerSummaryCard key={t.partner} partner={t.partner} showN1={showN1} />
          ))}
        </div>

        {/* Grand total KPIs when all partners */}
        {partner === 'Tous' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Dépenses totales', value: fmtCurrency(googleAdsTotals.reduce((s, t) => s + t.totalCost, 0)) },
              { label: 'Clics totaux',     value: fmt(googleAdsTotals.reduce((s, t) => s + t.totalClicks, 0)) },
              { label: 'Conversions',      value: fmt(googleAdsTotals.reduce((s, t) => s + t.totalConversions, 0)) },
              { label: 'Valeur totale',    value: fmtCurrency(googleAdsTotals.reduce((s, t) => s + t.totalConvValue, 0)) },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl border border-ink-200/70 p-5 card">
                <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">{kpi.label}</div>
                <div className="mt-2 font-display num text-3xl text-ink-900 leading-none">{kpi.value}</div>
                {showN1 && <p className="text-[10px] text-ink-400 mt-2">N-1 : <span className="text-ink-300">—</span></p>}
              </div>
            ))}
          </div>
        )}

        {/* Campaign table */}
        <CampaignTable data={filtered} dataN1={filteredN1 ?? null} showN1={showN1} />
      </div>
    </div>
  );
}
