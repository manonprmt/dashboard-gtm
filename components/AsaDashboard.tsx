'use client';

import { asaKpis, asaByKeyword, asaDailyTrend } from '@/lib/asaData';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtUsd = (n: number) => `$${n.toFixed(2)}`;

const maxSpend = Math.max(...asaDailyTrend.map((d) => d.spend));
const maxInstalls = Math.max(...asaDailyTrend.map((d) => d.installs));
const maxKwSpend = Math.max(...asaByKeyword.map((k) => k.spend));

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <div className="w-4 h-4 rounded-full bg-white/60" />
      </div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function cpaBadge(cpa: number) {
  let cls = 'bg-green-100 text-green-700';
  if (cpa > 5) cls = 'bg-red-100 text-red-700';
  else if (cpa > 3) cls = 'bg-amber-100 text-amber-700';
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold font-mono ${cls}`}>
      {fmtUsd(cpa)}
    </span>
  );
}

export default function AsaDashboard() {
  const spendShare = (spend: number) => (spend / asaKpis.totalSpend) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Apple Search Ads Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Picta x CVS Photo · iOS · 20 avr – 19 mai 2026 · 30 jours</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold text-gray-600">App Store · Search</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Dépenses totales" value={fmtCurrency(asaKpis.totalSpend)} sub="Apr 20 – Mai 19" color="bg-blue-500" />
          <KpiCard label="Installs totaux" value={fmt(asaKpis.totalInstalls)} sub={`${fmt(asaKpis.totalNewDownloads)} new · ${fmt(asaKpis.totalRedownloads)} re-dl`} color="bg-green-500" />
          <KpiCard label="CPA moyen" value={fmtUsd(asaKpis.avgCpa)} sub={`CPT moy. ${fmtUsd(asaKpis.avgCpt)}`} color="bg-violet-500" />
          <KpiCard label="Taps / TTR" value={fmt(asaKpis.totalTaps)} sub={`TTR ${fmtPct(asaKpis.avgTtr)} · CR ${fmtPct(asaKpis.avgCr)}`} color="bg-amber-500" />
        </div>

        {/* Two columns: chart + keyword table */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Daily trend chart */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Évolution quotidienne</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" /> Dépenses</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Installs</span>
              </div>
            </div>
            <div className="px-5 py-4">
              {/* Dual bar chart */}
              <div className="flex items-end gap-1 h-40">
                {asaDailyTrend.map((d) => {
                  const spendH = Math.round((d.spend / maxSpend) * 100);
                  const installH = Math.round((d.installs / maxInstalls) * 100);
                  const day = d.day.slice(5).replace('-', '/');
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded-lg px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none text-center">
                        <p className="font-semibold">{day}</p>
                        <p>{fmtCurrency(d.spend)}</p>
                        <p>{fmt(d.installs)} installs</p>
                      </div>
                      <div className="w-full flex items-end gap-px">
                        <div className="flex-1 bg-blue-400 rounded-t transition-all" style={{ height: `${spendH}%`, minHeight: 2 }} />
                        <div className="flex-1 bg-green-400 rounded-t transition-all" style={{ height: `${installH}%`, minHeight: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* X-axis labels (every 5 days) */}
              <div className="flex items-center mt-1 px-0">
                {asaDailyTrend.map((d, i) => (
                  <div key={d.day} className="flex-1 text-center">
                    {i % 5 === 0 && <span className="text-[9px] text-gray-400">{d.day.slice(5).replace('-', '/')}</span>}
                  </div>
                ))}
              </div>
            </div>
            {/* Summary below chart */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
              {[
                { label: 'Dépenses / jour', value: fmtCurrency(asaKpis.totalSpend / 30) },
                { label: 'Installs / jour', value: fmt(asaKpis.totalInstalls / 30) },
                { label: 'Taps / jour', value: fmt(asaKpis.totalTaps / 30) },
              ].map((s) => (
                <div key={s.label} className="px-4 py-3 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{s.label}</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spend by keyword (mini bars) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-800">Répartition du spend</p>
              <p className="text-xs text-gray-400 mt-0.5">par mot-clé</p>
            </div>
            <div className="px-5 py-3 space-y-3">
              {asaByKeyword.map((kw) => (
                <div key={kw.searchTerm}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[150px]">{kw.searchTerm}</span>
                    <span className="text-xs font-bold text-gray-900 font-mono">{fmtPct(spendShare(kw.spend))}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={{ width: `${(kw.spend / maxKwSpend) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-gray-400">{fmtCurrency(kw.spend)}</span>
                    <span className="text-[10px] text-gray-400">{fmt(kw.installs)} installs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keyword performance table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800">Performance par mot-clé</p>
            <p className="text-xs text-gray-400 mt-0.5">App : Picta x CVS Photo · Pays : United States</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Mot-clé', 'Spend', 'Impressions', 'Taps', 'Installs', 'New DL', 'TTR', 'CPT', 'CR', 'CPA'].map((h) => (
                    <th key={h} className={`px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${h === 'Mot-clé' ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {asaByKeyword.map((kw) => (
                  <tr key={kw.searchTerm} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 text-xs whitespace-nowrap">{kw.searchTerm}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-900">{fmtCurrency(kw.spend)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmt(kw.impressions)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmt(kw.taps)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-green-700">{fmt(kw.installs)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmt(kw.newDownloads)}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600">{fmtPct(kw.avgTtr)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmtUsd(kw.avgCpt)}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600">{fmtPct(kw.avgCr)}</td>
                    <td className="px-4 py-3 text-right">{cpaBadge(kw.avgCpa)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-xs font-bold text-gray-700">TOTAL</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmtCurrency(asaKpis.totalSpend)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmt(asaKpis.totalImpressions)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmt(asaKpis.totalTaps)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-green-700">{fmt(asaKpis.totalInstalls)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmt(asaKpis.totalNewDownloads)}</td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-gray-700">{fmtPct(asaKpis.avgTtr)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-700">{fmtUsd(asaKpis.avgCpt)}</td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-gray-700">{fmtPct(asaKpis.avgCr)}</td>
                  <td className="px-4 py-3 text-right">{cpaBadge(asaKpis.avgCpa)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
