'use client';

import { useState, useMemo } from 'react';
import { klaviyoData, repeatRateData, incrementData, monthlyData, parseCampaignLabel, parseSegment, type KlaviyoCampaign, type RepeatRateRow, type IncrementRow, type MonthlyRow } from '@/lib/klaviyoData';

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconMail() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
function IconSend() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>; }
function IconEye() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>; }
function IconCart() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>; }
function IconDollar() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconRepeat() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;

// ─── Shared components ────────────────────────────────────────────────────────

function KpiCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ─── Tab 1: Vue globale ───────────────────────────────────────────────────────

interface ChannelMetrics { nb_sent: number; taux_open_pct: number; orders: number; ca: number; }

function ChannelBlock({ channel, metrics, accent }: { channel: string; metrics: ChannelMetrics; accent: string }) {
  const isEmail = channel === 'EMAIL';
  return (
    <div className={`rounded-2xl border-2 ${accent} bg-white shadow-sm overflow-hidden`}>
      <div className={`px-5 py-3 flex items-center gap-2 ${isEmail ? 'bg-violet-50' : 'bg-amber-50'}`}>
        <span className={isEmail ? 'text-violet-600' : 'text-amber-600'}>{isEmail ? <IconMail /> : <IconBell />}</span>
        <h2 className={`font-bold text-sm uppercase tracking-widest ${isEmail ? 'text-violet-700' : 'text-amber-700'}`}>
          Global {isEmail ? 'Email' : 'Push'}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
        <KpiCard label="Envois" value={fmt(metrics.nb_sent)} icon={<IconSend />} color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'} />
        <KpiCard label="Taux d'ouverture" value={fmtPct(metrics.taux_open_pct)} icon={<IconEye />} color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'} />
        <KpiCard label="Orders attribuées" value={fmt(metrics.orders)} icon={<IconCart />} color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'} />
        <KpiCard label="CA attribué" value={fmtCurrency(metrics.ca)} icon={<IconDollar />} color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'} />
      </div>
    </div>
  );
}

// ─── Tab 2: Détail campagnes ──────────────────────────────────────────────────

type SortKey = keyof KlaviyoCampaign;

function CampaignTable({ data }: { data: KlaviyoCampaign[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('campaign_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => [...data].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  }), [data, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const Th = ({ k, label, align = 'left' }: { k: SortKey; label: string; align?: string }) => (
    <th className={`px-3 py-2.5 text-${align} text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none whitespace-nowrap`} onClick={() => handleSort(k)}>
      {label}{sortKey === k && <span className="ml-1 opacity-60">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th k="campaign_date" label="Date" />
              <Th k="channel" label="Canal" />
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Campagne</th>
              <Th k="nb_sent" label="Envois" align="right" />
              <Th k="taux_open_pct" label="Taux open" align="right" />
              <Th k="orders_attribuees" label="Orders" align="right" />
              <Th k="ca_attribue" label="CA attribué" align="right" />
              <Th k="panier_moyen" label="Panier moy." align="right" />
              <Th k="revenu_par_envoi" label="Rev/envoi" align="right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 text-gray-500 text-xs whitespace-nowrap">{row.campaign_date}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${row.channel === 'EMAIL' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}`}>
                    {row.channel === 'EMAIL' ? '✉' : '🔔'} {row.channel}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-800 font-medium max-w-[220px] truncate" title={row.campaign_name}>{parseCampaignLabel(row.campaign_name)}</td>
                <td className="px-3 py-2.5 text-right text-gray-700 tabular-nums">{fmt(row.nb_sent)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  <span className={`font-semibold ${row.taux_open_pct > 50 ? 'text-green-600' : row.taux_open_pct > 1 ? 'text-amber-600' : 'text-gray-500'}`}>{fmtPct(row.taux_open_pct)}</span>
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 tabular-nums font-medium">{fmt(row.orders_attribuees)}</td>
                <td className="px-3 py-2.5 text-right text-gray-800 tabular-nums font-semibold">{fmtCurrency(row.ca_attribue)}</td>
                <td className="px-3 py-2.5 text-right text-gray-500 tabular-nums">{fmtCurrency(row.panier_moyen)}</td>
                <td className="px-3 py-2.5 text-right text-gray-500 tabular-nums">${row.revenu_par_envoi.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 3: Incrément Klaviyo ─────────────────────────────────────────────────

const platformIcon = (p: string) => p === 'iOS' ? '🍎' : p === 'Android' ? '🤖' : '🌐';

function RateBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-24 shrink-0 text-right">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-bold text-white mix-blend-difference">{value}%</span>
      </div>
    </div>
  );
}

function IncrementView() {
  const totalIncrement = incrementData.reduce((s, r) => s + r.nb_orders_increment, 0);

  const visualPartners = ['CVS', 'Walgreens'];
  const visualData = useMemo(() => {
    return visualPartners.map((partner) => {
      const rows = incrementData.filter((r) => r.partner === partner);
      const maxRate = Math.max(...rows.map((r) => r.repeat_rate_exposed));
      return { partner, rows, maxRate };
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Global KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard label="Orders incrémentales Klaviyo" value={fmt(totalIncrement)} icon={<IconCart />} color="bg-violet-100 text-violet-600" />
        <KpiCard label="Uplift moyen taux de repeat" value={`+${(incrementData.reduce((s,r)=>s+r.increment_pts,0)/incrementData.length).toFixed(1)} pts`} icon={<IconRepeat />} color="bg-violet-100 text-violet-600" />
      </div>

      {/* Visual: repeat rate avec vs sans Klaviyo — CVS & Walgreens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visualData.map(({ partner, rows, maxRate }) => (
          <div key={partner} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-800">{partner}</h3>
              <span className="text-xs text-gray-400">Taux de repeat</span>
            </div>
            <div className="p-5 space-y-4">
              {rows.map((row) => (
                <div key={row.id} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{platformIcon(row.platform)}</span>
                    <span className="text-xs font-semibold text-gray-700">{row.platform}</span>
                    <span className="ml-auto text-xs font-bold text-violet-600">+{row.increment_pts} pts</span>
                  </div>
                  <RateBar label="Avec Klaviyo" value={row.repeat_rate_exposed} max={maxRate + 5} color="bg-violet-500" />
                  <RateBar label="Sans Klaviyo" value={row.repeat_rate_control} max={maxRate + 5} color="bg-gray-300" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-bold text-sm text-gray-800">Détail par brand · partenaire · plateforme</h3>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Partenaire</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Plateforme</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-violet-600 uppercase tracking-wide whitespace-nowrap">Avec Klaviyo</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Sans Klaviyo</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-green-600 uppercase tracking-wide whitespace-nowrap">Uplift</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Orders incrémentales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incrementData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 text-xs font-medium text-gray-500">{row.brand}</td>
                  <td className="px-3 py-2.5 font-semibold text-gray-800">{row.partner}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs">{platformIcon(row.platform)} {row.platform}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="font-bold text-violet-700">{row.repeat_rate_exposed}%</span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-gray-500">{row.repeat_rate_control}%</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${row.increment_pts >= 8 ? 'bg-green-100 text-green-700' : row.increment_pts >= 4 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      +{row.increment_pts} pts
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-gray-800 tabular-nums">{fmt(row.nb_orders_increment)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td colSpan={6} className="px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Total</td>
                <td className="px-3 py-2.5 text-right font-bold text-violet-700 tabular-nums">{fmt(totalIncrement)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Repeat Rate (CVS & Walgreens only, visual) ───────────────────────

const RATE_COLOR = (v: number) =>
  v >= 30 ? 'bg-green-500' : v >= 20 ? 'bg-violet-500' : v >= 10 ? 'bg-amber-400' : 'bg-gray-300';
const RATE_TEXT = (v: number) =>
  v >= 30 ? 'text-green-700' : v >= 20 ? 'text-violet-700' : v >= 10 ? 'text-amber-700' : 'text-gray-500';

function MiniBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-0.5">
      <div className={`h-1.5 rounded-full ${RATE_COLOR(value)}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function RepeatRateView() {
  const partners = ['CVS', 'Walgreens'] as const;
  const platforms = ['iOS', 'Android', 'Web'] as const;

  const grid = useMemo(() => {
    const cvs = repeatRateData.filter((r) => r.partner === 'CVS');
    const wg  = repeatRateData.filter((r) => r.partner === 'Walgreens');
    const maxRate = Math.max(...[...cvs, ...wg].map((r) => r.repeat_rate_m9 ?? r.repeat_rate_m6));
    return { cvs, wg, maxRate };
  }, []);

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" /> ≥ 30%</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-violet-500" /> 20–30%</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" /> 10–20%</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300" /> &lt; 10%</span>
      </div>

      {/* Grid: platform rows × partner columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['cvs', 'wg'] as const).map((key) => {
          const partnerName = key === 'cvs' ? 'CVS' : 'Walgreens';
          const rows = key === 'cvs' ? grid.cvs : grid.wg;
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`px-5 py-3 border-b ${key === 'cvs' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <h3 className={`font-bold text-sm uppercase tracking-widest ${key === 'cvs' ? 'text-blue-700' : 'text-emerald-700'}`}>{partnerName}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {platforms.map((platform) => {
                  const row = rows.find((r) => r.platform === platform);
                  if (!row) return null;
                  return (
                    <div key={platform} className="px-5 py-4">
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-sm">{platformIcon(platform)}</span>
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{platform}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'M3', value: row.repeat_rate_m3 },
                          { label: 'M6', value: row.repeat_rate_m6 },
                          { label: 'M9', value: row.repeat_rate_m9 },
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{label}</p>
                            {value !== null ? (
                              <>
                                <p className={`text-xl font-bold leading-none ${RATE_TEXT(value)}`}>{value}%</p>
                                <MiniBar value={value} max={grid.maxRate + 5} />
                              </>
                            ) : (
                              <p className="text-gray-300 text-sm">—</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 5: Évolution mensuelle ───────────────────────────────────────────────

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'];

function MonthlyView() {
  const [partner, setPartner] = useState<'CVS' | 'Walgreens'>('CVS');
  const [platform, setPlatform] = useState<'iOS' | 'Android' | 'Web'>('iOS');

  const filtered = useMemo(() =>
    monthlyData.filter((r) => r.partner === partner && r.platform === platform),
    [partner, platform]
  );

  const maxVal = useMemo(() =>
    Math.max(...filtered.map((r) => r.nb_new + r.nb_returning)),
    [filtered]
  );

  const totalNew      = filtered.reduce((s, r) => s + r.nb_new, 0);
  const totalReturning = filtered.reduce((s, r) => s + r.nb_returning, 0);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Partenaire :</span>
          {(['CVS', 'Walgreens'] as const).map((p) => (
            <button key={p} onClick={() => setPartner(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${partner === p ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Plateforme :</span>
          {(['iOS', 'Android', 'Web'] as const).map((pl) => (
            <button key={pl} onClick={() => setPlatform(pl)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${platform === pl ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {platformIcon(pl)} {pl}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <KpiCard label="Nouveaux clients YTD" value={fmt(totalNew)} icon={<IconSend />} color="bg-violet-100 text-violet-600" />
        <KpiCard label="Clients récurrents YTD" value={fmt(totalReturning)} icon={<IconRepeat />} color="bg-emerald-100 text-emerald-600" />
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-800">New vs Returning — {partner} · {platform}</h3>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-violet-500" /> Nouveaux</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-emerald-400" /> Récurrents</span>
          </div>
        </div>
        <div className="flex items-end justify-around gap-3 h-48">
          {filtered.map((row) => {
            const newH  = maxVal > 0 ? (row.nb_new / maxVal) * 100 : 0;
            const retH  = maxVal > 0 ? (row.nb_returning / maxVal) * 100 : 0;
            const total = row.nb_new + row.nb_returning;
            return (
              <div key={row.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex flex-col justify-end h-40 gap-0.5 relative">
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded-lg px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none text-center">
                    <p className="font-semibold">{row.month}</p>
                    <p>Nvx : {fmt(row.nb_new)}</p>
                    <p>Ret : {fmt(row.nb_returning)}</p>
                    <p className="text-gray-300">Total : {fmt(total)}</p>
                  </div>
                  <div className="w-full rounded-t-sm bg-violet-500 transition-all" style={{ height: `${newH}%` }} />
                  <div className="w-full rounded-t-sm bg-emerald-400 transition-all" style={{ height: `${retH}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500">{row.month}</span>
                <span className="text-[10px] text-gray-400">{fmt(total)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

type Tab = 'global' | 'detail' | 'increment' | 'repeat' | 'monthly';

const TABS: { id: Tab; label: string }[] = [
  { id: 'global',    label: 'Vue globale' },
  { id: 'detail',    label: 'Détail campagnes' },
  { id: 'increment', label: 'Incrément Klaviyo' },
  { id: 'repeat',    label: 'Repeat Rate' },
  { id: 'monthly',   label: 'Évolution mensuelle' },
];

export default function KlaviyoDashboard() {
  const dates = useMemo(() => [...new Set(klaviyoData.map((d) => d.campaign_date))].sort(), []);
  const [dateFrom, setDateFrom] = useState(dates[0]);
  const [dateTo, setDateTo] = useState(dates[dates.length - 1]);
  const [activeTab, setActiveTab] = useState<Tab>('global');

  const filtered = useMemo(
    () => klaviyoData.filter((d) => d.campaign_date >= dateFrom && d.campaign_date <= dateTo),
    [dateFrom, dateTo]
  );

  const emailMetrics = useMemo((): ChannelMetrics => {
    const rows = filtered.filter((d) => d.channel === 'EMAIL');
    const totalSent = rows.reduce((s, r) => s + r.nb_sent, 0);
    const totalOpen = rows.reduce((s, r) => s + r.nb_open, 0);
    return { nb_sent: totalSent, taux_open_pct: totalSent > 0 ? (totalOpen / totalSent) * 100 : 0, orders: rows.reduce((s, r) => s + r.orders_attribuees, 0), ca: rows.reduce((s, r) => s + r.ca_attribue, 0) };
  }, [filtered]);

  const pushMetrics = useMemo((): ChannelMetrics => {
    const rows = filtered.filter((d) => d.channel === 'PUSH');
    const totalSent = rows.reduce((s, r) => s + r.nb_sent, 0);
    const totalOpen = rows.reduce((s, r) => s + r.nb_open, 0);
    return { nb_sent: totalSent, taux_open_pct: totalSent > 0 ? (totalOpen / totalSent) * 100 : 0, orders: rows.reduce((s, r) => s + r.orders_attribuees, 0), ca: rows.reduce((s, r) => s + r.ca_attribue, 0) };
  }, [filtered]);

  const showDateFilter = activeTab === 'global' || activeTab === 'detail' || activeTab === 'increment';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Klaviyo CRM Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} campagne{filtered.length > 1 ? 's' : ''} sur la période</p>
          </div>
          {showDateFilter && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <input type="date" value={dateFrom} min={dates[0]} max={dateTo} onChange={(e) => setDateFrom(e.target.value)} className="bg-transparent text-sm text-gray-700 outline-none" />
              <span className="text-gray-300">→</span>
              <input type="date" value={dateTo} min={dateFrom} max={dates[dates.length - 1]} onChange={(e) => setDateTo(e.target.value)} className="bg-transparent text-sm text-gray-700 outline-none" />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === id ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {activeTab === 'global' && (
          <>
            <ChannelBlock channel="EMAIL" metrics={emailMetrics} accent="border-violet-200" />
            <ChannelBlock channel="PUSH" metrics={pushMetrics} accent="border-amber-200" />
          </>
        )}
        {activeTab === 'detail' && <CampaignTable data={filtered} />}
        {activeTab === 'increment' && <IncrementView />}
        {activeTab === 'repeat' && <RepeatRateView />}
        {activeTab === 'monthly' && <MonthlyView />}
      </div>
    </div>
  );
}
