'use client';

import { useState, useMemo } from 'react';
import { asaKpis, asaByKeyword, asaDailyTrend, type AsaKpis } from '@/lib/asaData';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtUsd = (n: number) => `$${n.toFixed(2)}`;

const asaKpisN1: AsaKpis | null = null;

const PERIOD_PRESETS = [
  { value: '7d',  label: '7j' },
  { value: '14d', label: '14j' },
  { value: '30d', label: '30j' },
] as const;
type PeriodPreset = typeof PERIOD_PRESETS[number]['value'];

const ALL_DAYS = asaDailyTrend.map((d) => d.day).sort();
const LAST_DAY = ALL_DAYS[ALL_DAYS.length - 1];

function getFilteredDays(preset: PeriodPreset) {
  if (preset === '30d') return asaDailyTrend;
  const n = preset === '7d' ? 7 : 14;
  return asaDailyTrend.slice(-n);
}

function computeKpisFromDays(days: typeof asaDailyTrend) {
  return {
    totalSpend:    days.reduce((s, d) => s + d.spend, 0),
    totalInstalls: days.reduce((s, d) => s + d.installs, 0),
    totalTaps:     days.reduce((s, d) => s + d.taps, 0),
  };
}

function cpaBadge(cpa: number) {
  let cls = 'bg-success-100 text-success-700';
  if (cpa > 5)      cls = 'bg-error-100 text-error-700';
  else if (cpa > 3) cls = 'bg-tertiary-100 text-tertiary-700';
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-bold num ${cls}`}>{fmtUsd(cpa)}</span>;
}

export default function AsaDashboard() {
  const [preset, setPreset] = useState<PeriodPreset>('30d');
  const [showN1, setShowN1] = useState(false);

  const filteredDays = useMemo(() => getFilteredDays(preset), [preset]);
  const kpis = useMemo(() => ({ ...asaKpis, ...computeKpisFromDays(filteredDays) }), [filteredDays]);

  const periodLabel =
    preset === '30d'
      ? '20 avr – 19 mai 2026'
      : `${filteredDays[0]?.day.slice(5).replace('-', '/')} – ${LAST_DAY.slice(5).replace('-', '/')}`;

  return (
    <div className="bg-ink-50 min-h-full">
      {/* Sub-header */}
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">Search</span>
            <span className="font-display text-lg text-primary-800 leading-none">Ads</span>
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
              {PERIOD_PRESETS.map((p) => (
                <button key={p.value} onClick={() => setPreset(p.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${preset === p.value ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                  {p.label}
                </button>
              ))}
            </div>

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
          <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">Acquisition mobile</div>
          <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">Apple Search Ads</h1>
          <p className="mt-2 text-xs text-ink-500">{periodLabel} · Picta x CVS Photo · iOS</p>
        </div>

        {/* N-1 banner */}
        {showN1 && !asaKpisN1 && (
          <div className="mb-8 flex items-center gap-3 bg-tertiary-50 border border-tertiary-200 rounded-2xl px-5 py-3 text-sm text-tertiary-700">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-400 flex-shrink-0" />
            Données N-1 non disponibles — importez un export ASA sur la période équivalente 2025.
          </div>
        )}

        {/* Hero KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {/* Hero installs — dark purple */}
          <div className="col-span-2 md:col-span-1 rounded-2xl bg-primary-800 p-6">
            <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium">Installs</div>
            <div className="font-display num text-4xl text-white leading-none mt-3">{fmt(kpis.totalInstalls)}</div>
            <div className="mt-3 text-primary-300 text-xs">{fmt(kpis.totalNewDownloads)} new · {fmt(kpis.totalRedownloads)} re-dl</div>
          </div>

          {/* CPA — orange */}
          <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">CPA moyen</div>
            <div className="font-display num text-4xl text-tertiary-500 leading-none mt-3">{fmtUsd(kpis.avgCpa)}</div>
            <div className="mt-3 text-xs text-ink-400">CPT {fmtUsd(kpis.avgCpt)}</div>
          </div>

          <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Dépenses</div>
            <div className="font-display num text-4xl text-primary-800 leading-none mt-3">{fmtCurrency(kpis.totalSpend)}</div>
            <div className="mt-3 text-xs text-ink-400">{filteredDays.length}j · {fmtCurrency(kpis.totalSpend / Math.max(filteredDays.length, 1))}/j</div>
          </div>

          <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Taps · TTR</div>
            <div className="font-display num text-4xl text-primary-800 leading-none mt-3">{fmt(kpis.totalTaps)}</div>
            <div className="mt-3 text-xs text-ink-400">TTR {fmtPct(kpis.avgTtr)} · CR {fmtPct(kpis.avgCr)}</div>
          </div>
        </section>

        {/* Keyword table */}
        <div className="rounded-2xl bg-white border border-ink-200/70 card overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Performance par mot-clé</span>
              <p className="text-[11px] text-ink-400 mt-0.5">
                Picta x CVS Photo · United States
                {preset !== '30d' && ' · ⚠ données agrégées sur 30j'}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-100">
                <tr>
                  {['Mot-clé', 'Spend', 'Impressions', 'Taps', 'Installs', 'New DL', 'TTR', 'CPT', 'CR', 'CPA'].map((h) => (
                    <th key={h}
                      className={`px-4 py-3 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap ${h === 'Mot-clé' ? 'text-left text-ink-500' : 'text-right text-ink-500'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {asaByKeyword.map((kw) => (
                  <tr key={kw.searchTerm} className="hover:bg-primary-50/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink-900 text-xs whitespace-nowrap">{kw.searchTerm}</td>
                    <td className="px-4 py-3 text-right num text-xs font-semibold text-primary-800">{fmtCurrency(kw.spend)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmt(kw.impressions)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmt(kw.taps)}</td>
                    <td className="px-4 py-3 text-right num text-xs font-semibold text-primary-700">{fmt(kw.installs)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmt(kw.newDownloads)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmtPct(kw.avgTtr)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmtUsd(kw.avgCpt)}</td>
                    <td className="px-4 py-3 text-right num text-xs text-ink-600">{fmtPct(kw.avgCr)}</td>
                    <td className="px-4 py-3 text-right">{cpaBadge(kw.avgCpa)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-ink-200 bg-ink-50">
                <tr>
                  <td className="px-4 py-3 text-[11px] font-display text-ink-700 uppercase tracking-wider">Total</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-primary-800">{fmtCurrency(kpis.totalSpend)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{fmt(asaKpis.totalImpressions)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{fmt(kpis.totalTaps)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-primary-700">{fmt(kpis.totalInstalls)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{fmt(asaKpis.totalNewDownloads)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-700">{fmtPct(asaKpis.avgTtr)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-700">{fmtUsd(asaKpis.avgCpt)}</td>
                  <td className="px-4 py-3 text-right num text-xs font-bold text-ink-700">{fmtPct(asaKpis.avgCr)}</td>
                  <td className="px-4 py-3 text-right">{cpaBadge(asaKpis.avgCpa)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>

      <footer className="max-w-[1280px] mx-auto px-6 py-8 text-xs text-ink-400">
        Picta x CVS Photo · Apple Search Ads · iOS · {periodLabel}
      </footer>
    </div>
  );
}
