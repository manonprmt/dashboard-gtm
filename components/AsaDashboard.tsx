'use client';

import { useState, useMemo } from 'react';
import { asaKpis, asaByKeyword, asaDailyTrend, type AsaKpis } from '@/lib/asaData';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtUsd = (n: number) => `$${n.toFixed(2)}`;

// ─── N-1 data (empty — to be filled when exports are available) ───────────────
const asaKpisN1: AsaKpis | null = null;

// ─── Period presets ───────────────────────────────────────────────────────────
const PERIOD_PRESETS = [
  { value: '7d',  label: '7 jours' },
  { value: '14d', label: '14 jours' },
  { value: '30d', label: '30 jours' },
] as const;
type PeriodPreset = typeof PERIOD_PRESETS[number]['value'];

const ALL_DAYS = asaDailyTrend.map((d) => d.day).sort();
const LAST_DAY = ALL_DAYS[ALL_DAYS.length - 1];

function getFilteredDays(preset: PeriodPreset) {
  if (preset === '30d') return asaDailyTrend;
  const n = preset === '7d' ? 7 : 14;
  return asaDailyTrend.slice(-n);
}

function computeKpisFromDays(days: typeof asaDailyTrend): Pick<AsaKpis, 'totalSpend' | 'totalInstalls' | 'totalTaps'> {
  return {
    totalSpend:    days.reduce((s, d) => s + d.spend, 0),
    totalInstalls: days.reduce((s, d) => s + d.installs, 0),
    totalTaps:     days.reduce((s, d) => s + d.taps, 0),
  };
}

function N1Empty() {
  return <span className="text-ink-300 text-xs num">—</span>;
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

function cpaBadge(cpa: number) {
  let cls = 'bg-success-100 text-success-700';
  if (cpa > 5)      cls = 'bg-error-100 text-error-700';
  else if (cpa > 3) cls = 'bg-tertiary-100 text-tertiary-700';
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold num ${cls}`}>
      {fmtUsd(cpa)}
    </span>
  );
}


export default function AsaDashboard() {
  const [preset, setPreset] = useState<PeriodPreset>('30d');
  const [showN1, setShowN1] = useState(false);

  const filteredDays = useMemo(() => getFilteredDays(preset), [preset]);
  const kpis = useMemo(() => {
    const base = computeKpisFromDays(filteredDays);
    return { ...asaKpis, ...base };
  }, [filteredDays]);

  const periodLabel = preset === '30d'
    ? '20 avr – 19 mai 2026'
    : `${filteredDays[0]?.day.slice(5).replace('-', '/')} – ${LAST_DAY.slice(5).replace('-', '/')}`;

  const kpiRows = [
    {
      label: 'Dépenses',
      value: fmtCurrency(kpis.totalSpend),
      n1val: asaKpisN1 ? fmtCurrency(asaKpisN1.totalSpend) : null,
      n1raw: asaKpisN1?.totalSpend ?? null,
      raw: kpis.totalSpend,
      dot: 'bg-blue-500',
      sub: `${filteredDays.length}j · ${fmtCurrency(kpis.totalSpend / filteredDays.length)}/j moy.`,
    },
    {
      label: 'Installs',
      value: fmt(kpis.totalInstalls),
      n1val: asaKpisN1 ? fmt(asaKpisN1.totalInstalls) : null,
      n1raw: asaKpisN1?.totalInstalls ?? null,
      raw: kpis.totalInstalls,
      dot: 'bg-success-500',
      sub: `${fmt(kpis.totalNewDownloads)} new · ${fmt(kpis.totalRedownloads)} re-dl`,
    },
    {
      label: 'CPA moyen',
      value: fmtUsd(kpis.avgCpa),
      n1val: asaKpisN1 ? fmtUsd(asaKpisN1.avgCpa) : null,
      n1raw: asaKpisN1?.avgCpa ?? null,
      raw: kpis.avgCpa,
      dot: 'bg-primary-500',
      sub: `CPT moy. ${fmtUsd(kpis.avgCpt)}`,
    },
    {
      label: 'Taps / TTR',
      value: fmt(kpis.totalTaps),
      n1val: asaKpisN1 ? fmt(asaKpisN1.totalTaps) : null,
      n1raw: asaKpisN1?.totalTaps ?? null,
      raw: kpis.totalTaps,
      dot: 'bg-tertiary-500',
      sub: `TTR ${fmtPct(kpis.avgTtr)} · CR ${fmtPct(kpis.avgCr)}`,
    },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-ink-200/70 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl text-primary-800">Apple Search Ads</h1>
            <p className="text-xs text-ink-400 mt-0.5">Picta x CVS Photo · iOS · {periodLabel}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Period presets */}
            <div className="flex items-center gap-1 bg-ink-100 p-1 rounded-full">
              {PERIOD_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPreset(p.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    preset === p.value
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
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">

        {/* N-1 banner */}
        {showN1 && !asaKpisN1 && (
          <div className="flex items-center gap-3 bg-tertiary-50 border border-tertiary-200 rounded-2xl px-4 py-3 text-sm text-tertiary-700">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Données N-1 non disponibles. Importez un export ASA sur la période équivalente de l'année précédente.</span>
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpiRows.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-ink-200/70 p-5 card">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${kpi.dot}`} />
                <span className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">{kpi.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <div className="font-display num text-3xl text-ink-900 leading-none">{kpi.value}</div>
                {showN1 && <DeltaBadge current={kpi.raw} prev={kpi.n1raw} />}
              </div>
              {showN1 ? (
                <p className="text-[10px] text-ink-400 mt-2">N-1 : {kpi.n1val ?? <span className="text-ink-300">—</span>}</p>
              ) : (
                <p className="text-[11px] text-ink-400 mt-2">{kpi.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Keyword performance table */}
        <div className="bg-white rounded-2xl border border-ink-200/70 card overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
            <div>
              <p className="font-display text-sm text-ink-800">Performance par mot-clé</p>
              <p className="text-xs text-ink-400 mt-0.5">
                App : Picta x CVS Photo · Pays : United States
                {preset !== '30d' && ' · ⚠️ Agrégation sur 30j — filtre période non disponible par keyword'}
              </p>
            </div>
            {showN1 && !asaKpisN1 && (
              <span className="text-xs text-tertiary-700 bg-tertiary-50 border border-tertiary-200 rounded-full px-2.5 py-0.5">
                Données N-1 non disponibles
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-100">
                <tr>
                  {['Mot-clé', 'Spend', showN1 ? 'N-1 Spend' : null, 'Impressions', 'Taps', 'Installs', showN1 ? 'N-1 Installs' : null, 'New DL', 'TTR', 'CPT', 'CR', 'CPA', showN1 ? 'N-1 CPA' : null]
                    .filter(Boolean)
                    .map((h) => (
                      <th
                        key={h!}
                        className={`px-4 py-3 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap ${
                          h!.startsWith('N-1') ? 'text-ink-300 text-right' : h === 'Mot-clé' ? 'text-left text-ink-500' : 'text-right text-ink-500'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {asaByKeyword.map((kw) => (
                  <tr key={kw.searchTerm} className="hover:bg-ink-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink-900 text-xs whitespace-nowrap">{kw.searchTerm}</td>
                    <td className="px-4 py-3 text-right num text-xs font-semibold text-ink-900">{fmtCurrency(kw.spend)}</td>
                    {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmt(kw.impressions)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmt(kw.taps)}</td>
                    <td className="px-4 py-3 text-right num text-xs font-semibold text-success-700">{fmt(kw.installs)}</td>
                    {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmt(kw.newDownloads)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmtPct(kw.avgTtr)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmtUsd(kw.avgCpt)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmtPct(kw.avgCr)}</td>
                    <td className="px-4 py-3 text-right">{cpaBadge(kw.avgCpa)}</td>
                    {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-ink-200 bg-ink-50">
                <tr>
                  <td className="px-4 py-3 text-xs font-display text-ink-700">TOTAL</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmtCurrency(kpis.totalSpend)}</td>
                  {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmt(asaKpis.totalImpressions)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmt(kpis.totalTaps)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-success-700">{fmt(kpis.totalInstalls)}</td>
                  {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-900">{fmt(asaKpis.totalNewDownloads)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-700">{fmtPct(asaKpis.avgTtr)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-700">{fmtUsd(asaKpis.avgCpt)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-700">{fmtPct(asaKpis.avgCr)}</td>
                  <td className="px-4 py-3 text-right">{cpaBadge(asaKpis.avgCpa)}</td>
                  {showN1 && <td className="px-4 py-3 text-right"><N1Empty /></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
