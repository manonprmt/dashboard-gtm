'use client';

import { useState } from 'react';
import { googleAdsData, googleAdsTotals, type GoogleAdsRow } from '@/lib/googleAdsData';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtRoas = (n: number) => `${n.toFixed(2)}x`;

const PARTNERS = ['Tous', 'CVS', 'WG', 'Picta'] as const;
type Partner = typeof PARTNERS[number];

const PARTNER_COLORS: Record<string, string> = {
  CVS: 'bg-blue-100 text-blue-700 border-blue-200',
  WG: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Picta: 'bg-violet-100 text-violet-700 border-violet-200',
};

const PARTNER_ACCENT: Record<string, string> = {
  CVS: 'from-blue-500 to-blue-600',
  WG: 'from-emerald-500 to-emerald-600',
  Picta: 'from-violet-500 to-violet-600',
};

function roasBadge(roas: number) {
  let cls = 'bg-red-100 text-red-700';
  if (roas >= 5) cls = 'bg-blue-100 text-blue-700';
  else if (roas >= 3) cls = 'bg-green-100 text-green-700';
  else if (roas >= 2) cls = 'bg-amber-100 text-amber-700';
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold font-mono ${cls}`}>{fmtRoas(roas)}</span>;
}

function ctrBadge(ctr: number) {
  let cls = 'text-red-600';
  if (ctr > 15) cls = 'text-green-600';
  else if (ctr >= 5) cls = 'text-amber-500';
  return <span className={`font-mono text-xs font-semibold ${cls}`}>{fmtPct(ctr)}</span>;
}

function PartnerSummaryCard({ partner }: { partner: string }) {
  const t = googleAdsTotals.find((x) => x.partner === partner);
  if (!t) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`bg-gradient-to-r ${PARTNER_ACCENT[partner]} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-sm uppercase tracking-widest">{partner}</span>
          <span className="text-white/80 text-xs font-medium">Google Ads</span>
        </div>
        <p className="text-white text-3xl font-extrabold mt-1">{fmtCurrency(t.totalCost)}</p>
        <p className="text-white/70 text-xs mt-0.5">dépensé sur la période</p>
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-100 px-0">
        {[
          { label: 'ROAS', value: fmtRoas(t.avgRoas), sub: 'retour sur dépense' },
          { label: 'Clics', value: fmt(t.totalClicks), sub: `CTR ${fmtPct(t.avgCtr)}` },
          { label: 'Conv.', value: fmt(t.totalConversions), sub: fmtCurrency(t.totalConvValue) },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 text-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-base font-bold text-gray-900 leading-tight">{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type SortKey = keyof Pick<GoogleAdsRow, 'cost' | 'clicks' | 'roas' | 'ctr' | 'conversions' | 'convValue'>;

function CampaignTable({ data }: { data: GoogleAdsRow[] }) {
  const [sort, setSort] = useState<SortKey>('cost');
  const [asc, setAsc] = useState(false);

  const sorted = [...data].sort((a, b) => {
    const diff = a[sort] - b[sort];
    return asc ? diff : -diff;
  });

  const th = (key: SortKey, label: string) => (
    <th
      className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
      onClick={() => { if (sort === key) setAsc(!asc); else { setSort(key); setAsc(false); } }}
    >
      {label}{sort === key ? (asc ? ' ↑' : ' ↓') : ''}
    </th>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">{sorted.length} groupes d'annonces actifs</p>
        <p className="text-xs text-gray-400">Cliquez sur un en-tête pour trier</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Campagne / Groupe</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Partenaire</th>
              {th('cost', 'Coût')}
              {th('clicks', 'Clics')}
              {th('ctr', 'CTR')}
              {th('conversions', 'Conv.')}
              {th('convValue', 'Valeur')}
              {th('roas', 'ROAS')}
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">IS %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 text-xs">{row.campaign}</p>
                  <p className="text-gray-400 text-[11px]">{row.adGroup}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${PARTNER_COLORS[row.partner] || 'bg-gray-100 text-gray-600'}`}>{row.partner}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-900">{fmtCurrency(row.cost)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmt(row.clicks)}</td>
                <td className="px-4 py-3 text-right">{ctrBadge(row.ctr)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmt(row.conversions)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmtCurrency(row.convValue)}</td>
                <td className="px-4 py-3 text-right">{roasBadge(row.roas)}</td>
                <td className="px-4 py-3 text-right">
                  {row.imprShare > 0 ? (
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${Math.min(row.imprShare * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-10 text-right">{fmtPct(row.imprShare * 100)}</span>
                    </div>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-200 bg-gray-50">
            <tr>
              <td className="px-4 py-3 text-xs font-bold text-gray-700" colSpan={2}>TOTAL</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmtCurrency(data.reduce((s, r) => s + r.cost, 0))}</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmt(data.reduce((s, r) => s + r.clicks, 0))}</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmt(data.reduce((s, r) => s + r.conversions, 0))}</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{fmtCurrency(data.reduce((s, r) => s + r.convValue, 0))}</td>
              <td className="px-4 py-3 text-right">{roasBadge(data.reduce((s, r) => s + r.convValue, 0) / data.reduce((s, r) => s + r.cost, 0))}</td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function GoogleAdsDashboard() {
  const [partner, setPartner] = useState<Partner>('Tous');

  const filtered = partner === 'Tous' ? googleAdsData : googleAdsData.filter((r) => r.partner === partner);
  const shownTotals = partner === 'Tous' ? googleAdsTotals : googleAdsTotals.filter((t) => t.partner === partner);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Google Ads Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Picta US · toutes périodes confondues · {googleAdsData.length} groupes actifs</p>
          </div>
          {/* Partner filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {PARTNERS.map((p) => (
              <button
                key={p}
                onClick={() => setPartner(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${partner === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Partner summary cards */}
        <div className={`grid gap-4 ${shownTotals.length === 1 ? 'grid-cols-1 max-w-sm' : shownTotals.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {shownTotals.map((t) => (
            <PartnerSummaryCard key={t.partner} partner={t.partner} />
          ))}
        </div>

        {/* Grand total KPIs when all partners */}
        {partner === 'Tous' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Dépenses totales', value: fmtCurrency(googleAdsTotals.reduce((s, t) => s + t.totalCost, 0)), icon: '💰' },
              { label: 'Clics totaux', value: fmt(googleAdsTotals.reduce((s, t) => s + t.totalClicks, 0)), icon: '👆' },
              { label: 'Conversions', value: fmt(googleAdsTotals.reduce((s, t) => s + t.totalConversions, 0)), icon: '✅' },
              { label: 'Valeur totale', value: fmtCurrency(googleAdsTotals.reduce((s, t) => s + t.totalConvValue, 0)), icon: '📈' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <span className="text-2xl">{kpi.icon}</span>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campaign table */}
        <CampaignTable data={filtered} />
      </div>
    </div>
  );
}
