'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { adjustWG, adjustCVS, CHANNEL_COLORS, channelLabel, type AdjustRow } from '@/lib/adjustData';

const fmt  = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : fmt(n);
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

type Partner = 'CVS' | 'WG';

function DonutChart({ data, partner }: { data: AdjustRow[]; partner: Partner }) {
  const withInstalls = data.filter((r) => r.installs > 0);
  const total = withInstalls.reduce((s, r) => s + r.installs, 0);

  const pieData = withInstalls.map((r) => ({
    name:  channelLabel(r.channel),
    value: r.installs,
    pct:   ((r.installs / total) * 100).toFixed(1),
    color: CHANNEL_COLORS[r.channel] ?? '#A8A29E',
  }));

  const accentTop = partner === 'CVS' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100';
  const accentText = partner === 'CVS' ? 'text-blue-700' : 'text-emerald-700';

  return (
    <div className="rounded-2xl bg-white border border-ink-200/70 card overflow-hidden">
      <div className={`px-6 py-4 border-b ${accentTop}`}>
        <span className={`font-display text-sm uppercase tracking-widest ${accentText}`}>{partner}</span>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="font-display num text-3xl text-primary-800">{fmtK(total)}</span>
          <span className="text-xs text-ink-500">installs totaux</span>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              strokeWidth={0}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${fmt(value)} installs`,
                name,
              ]}
              contentStyle={{
                background: '#1C1917',
                border: 'none',
                borderRadius: '12px',
                color: '#FAFAF9',
                fontSize: '12px',
                padding: '8px 12px',
              }}
              itemStyle={{ color: '#FAFAF9' }}
              labelStyle={{ color: '#A8A29E', fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-2 space-y-2">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                <span className="text-xs text-ink-700">{entry.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-400">{entry.pct}%</span>
                <span className="num text-xs font-semibold text-ink-900 min-w-[52px] text-right">{fmtK(entry.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueTable({ data, partner }: { data: AdjustRow[]; partner: Partner }) {
  const withData = data.filter((r) => r.installs > 0 || r.all_revenue > 0);
  const totalInstalls = withData.reduce((s, r) => s + r.installs, 0);
  const totalRevenue  = withData.reduce((s, r) => s + r.all_revenue, 0);

  return (
    <div className="rounded-2xl bg-white border border-ink-200/70 card overflow-hidden">
      <div className="px-6 py-4 border-b border-ink-100">
        <span className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Détail par canal — {partner}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-ink-100">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-ink-500 uppercase tracking-wider">Canal</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-500 uppercase tracking-wider">Installs</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-500 uppercase tracking-wider">Part</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-500 uppercase tracking-wider">Revenus</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-500 uppercase tracking-wider">Rev/Install</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium text-ink-500 uppercase tracking-wider">DAUs moy.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {withData.sort((a, b) => b.installs - a.installs).map((row) => {
              const pct  = totalInstalls > 0 ? ((row.installs / totalInstalls) * 100).toFixed(1) : '0.0';
              const rpi  = row.installs > 0 ? row.all_revenue / row.installs : 0;
              return (
                <tr key={row.channel} className="hover:bg-primary-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: CHANNEL_COLORS[row.channel] ?? '#A8A29E' }} />
                      <span className="text-xs font-medium text-ink-800">{channelLabel(row.channel)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right num text-xs font-semibold text-primary-800">{fmt(row.installs)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary-400"
                          style={{ width: `${pct}%`, background: CHANNEL_COLORS[row.channel] ?? '#9843FE' }} />
                      </div>
                      <span className="num text-xs text-ink-500 w-9 text-right">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right num text-xs text-ink-700">{row.all_revenue > 0 ? fmtCurrency(row.all_revenue) : '—'}</td>
                  <td className="px-4 py-3 text-right num text-xs text-ink-700">{row.installs > 0 && row.all_revenue > 0 ? fmtCurrency(rpi) : '—'}</td>
                  <td className="px-4 py-3 text-right num text-xs text-ink-500">{row.daus > 0 ? fmt(row.daus) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-ink-200 bg-ink-50">
            <tr>
              <td className="px-4 py-3 text-[11px] font-display text-ink-700 uppercase tracking-wider">Total</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-primary-800">{fmt(totalInstalls)}</td>
              <td className="px-4 py-3 text-right num text-xs text-ink-400">100%</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{fmtCurrency(totalRevenue)}</td>
              <td className="px-4 py-3 text-right num text-xs font-bold text-ink-800">{totalInstalls > 0 ? fmtCurrency(totalRevenue / totalInstalls) : '—'}</td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function AdjustTab() {
  const [partner, setPartner] = useState<Partner>('CVS');

  const cvsInstalls = adjustCVS.reduce((s, r) => s + r.installs, 0);
  const wgInstalls  = adjustWG.reduce((s, r) => s + r.installs, 0);
  const cvsRevenue  = adjustCVS.reduce((s, r) => s + r.all_revenue, 0);
  const wgRevenue   = adjustWG.reduce((s, r) => s + r.all_revenue, 0);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 w-full">
      {/* Page header */}
      <div className="mb-10">
        <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">Attribution mobile</div>
        <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">Origines des installs</h1>
        <p className="mt-2 text-xs text-ink-500">Source : Adjust export — 20 mai 2026</p>
      </div>

      {/* Summary KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="rounded-2xl bg-primary-800 p-6">
          <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium">CVS — Installs</div>
          <div className="font-display num text-4xl text-white leading-none mt-3">{fmtK(cvsInstalls)}</div>
          <div className="mt-3 text-primary-300 text-xs">tous canaux confondus</div>
        </div>
        <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
          <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">CVS — Revenus</div>
          <div className="font-display num text-4xl text-tertiary-500 leading-none mt-3">{fmtCurrency(cvsRevenue)}</div>
          <div className="mt-3 text-xs text-ink-400">{fmtCurrency(cvsRevenue / cvsInstalls)}/install</div>
        </div>
        <div className="rounded-2xl bg-primary-800 p-6">
          <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium">WG — Installs</div>
          <div className="font-display num text-4xl text-white leading-none mt-3">{fmtK(wgInstalls)}</div>
          <div className="mt-3 text-primary-300 text-xs">tous canaux confondus</div>
        </div>
        <div className="rounded-2xl bg-white border border-ink-200/70 p-6 card">
          <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">WG — Revenus</div>
          <div className="font-display num text-4xl text-tertiary-500 leading-none mt-3">{fmtCurrency(wgRevenue)}</div>
          <div className="mt-3 text-xs text-ink-400">{fmtCurrency(wgRevenue / wgInstalls)}/install</div>
        </div>
      </section>

      {/* Donut charts side by side */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <DonutChart data={adjustCVS} partner="CVS" />
        <DonutChart data={adjustWG} partner="WG" />
      </section>

      {/* Partner toggle + detail table */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Détail</span>
          <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
            {(['CVS', 'WG'] as Partner[]).map((p) => (
              <button key={p} onClick={() => setPartner(p)}
                className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${partner === p ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <RevenueTable data={partner === 'CVS' ? adjustCVS : adjustWG} partner={partner} />
      </section>

      <footer className="mt-10 text-xs text-ink-400">
        Source : Adjust report export · 2026-05-20 · période cumulée depuis le lancement
      </footer>
    </div>
  );
}
