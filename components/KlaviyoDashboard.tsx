'use client';

import { useState, useMemo } from 'react';
import { klaviyoData, parseCampaignLabel, type KlaviyoCampaign } from '@/lib/klaviyoData';

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

function IconSend() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function IconDollar() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n));
}
function fmtCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ─── Channel block ────────────────────────────────────────────────────────────

interface ChannelMetrics {
  nb_sent: number;
  taux_open_pct: number;
  orders: number;
  ca: number;
}

function ChannelBlock({ channel, metrics, accent }: { channel: string; metrics: ChannelMetrics; accent: string }) {
  const isEmail = channel === 'EMAIL';
  const icon = isEmail ? <IconMail /> : <IconBell />;
  const label = isEmail ? 'Email' : 'Push';

  return (
    <div className={`rounded-2xl border-2 ${accent} bg-white shadow-sm overflow-hidden`}>
      <div className={`px-5 py-3 flex items-center gap-2 ${isEmail ? 'bg-violet-50' : 'bg-amber-50'}`}>
        <span className={isEmail ? 'text-violet-600' : 'text-amber-600'}>{icon}</span>
        <h2 className={`font-bold text-sm uppercase tracking-widest ${isEmail ? 'text-violet-700' : 'text-amber-700'}`}>
          Global {label}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
        <KpiCard
          label="Envois"
          value={fmt(metrics.nb_sent)}
          icon={<IconSend />}
          color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'}
        />
        <KpiCard
          label="Taux d'ouverture"
          value={fmtPct(metrics.taux_open_pct)}
          icon={<IconEye />}
          color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'}
        />
        <KpiCard
          label="Orders attribuées"
          value={fmt(metrics.orders)}
          icon={<IconCart />}
          color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'}
        />
        <KpiCard
          label="CA attribué"
          value={fmtCurrency(metrics.ca)}
          icon={<IconDollar />}
          color={isEmail ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'}
        />
      </div>
    </div>
  );
}

// ─── Campaign table ───────────────────────────────────────────────────────────

type SortKey = keyof KlaviyoCampaign;

function CampaignTable({ data }: { data: KlaviyoCampaign[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('campaign_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [data, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const Th = ({ k, label, align = 'left' }: { k: SortKey; label: string; align?: string }) => (
    <th
      className={`px-3 py-2.5 text-${align} text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none whitespace-nowrap`}
      onClick={() => handleSort(k)}
    >
      {label}
      {sortKey === k && <span className="ml-1 opacity-60">{sortDir === 'asc' ? '↑' : '↓'}</span>}
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
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    row.channel === 'EMAIL'
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {row.channel === 'EMAIL' ? '✉' : '🔔'} {row.channel}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-800 font-medium max-w-[220px] truncate" title={row.campaign_name}>
                  {parseCampaignLabel(row.campaign_name)}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 tabular-nums">{fmt(row.nb_sent)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  <span className={`font-semibold ${row.taux_open_pct > 50 ? 'text-green-600' : row.taux_open_pct > 1 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {fmtPct(row.taux_open_pct)}
                  </span>
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

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function KlaviyoDashboard() {
  const dates = useMemo(() => [...new Set(klaviyoData.map((d) => d.campaign_date))].sort(), []);
  const [dateFrom, setDateFrom] = useState(dates[0]);
  const [dateTo, setDateTo] = useState(dates[dates.length - 1]);
  const [activeTab, setActiveTab] = useState<'global' | 'detail'>('global');

  const filtered = useMemo(
    () => klaviyoData.filter((d) => d.campaign_date >= dateFrom && d.campaign_date <= dateTo),
    [dateFrom, dateTo]
  );

  const emailMetrics = useMemo((): ChannelMetrics => {
    const rows = filtered.filter((d) => d.channel === 'EMAIL');
    const totalSent = rows.reduce((s, r) => s + r.nb_sent, 0);
    const totalOpen = rows.reduce((s, r) => s + r.nb_open, 0);
    return {
      nb_sent: totalSent,
      taux_open_pct: totalSent > 0 ? (totalOpen / totalSent) * 100 : 0,
      orders: rows.reduce((s, r) => s + r.orders_attribuees, 0),
      ca: rows.reduce((s, r) => s + r.ca_attribue, 0),
    };
  }, [filtered]);

  const pushMetrics = useMemo((): ChannelMetrics => {
    const rows = filtered.filter((d) => d.channel === 'PUSH');
    const totalSent = rows.reduce((s, r) => s + r.nb_sent, 0);
    const totalOpen = rows.reduce((s, r) => s + r.nb_open, 0);
    return {
      nb_sent: totalSent,
      taux_open_pct: totalSent > 0 ? (totalOpen / totalSent) * 100 : 0,
      orders: rows.reduce((s, r) => s + r.orders_attribuees, 0),
      ca: rows.reduce((s, r) => s + r.ca_attribue, 0),
    };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Klaviyo CRM Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} campagne{filtered.length > 1 ? 's' : ''} sur la période</p>
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={dateFrom}
              min={dates[0]}
              max={dateTo}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none"
            />
            <span className="text-gray-300">→</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              max={dates[dates.length - 1]}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(['global', 'detail'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'global' ? 'Vue globale' : 'Détail par campagne'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {activeTab === 'global' ? (
          <>
            <ChannelBlock
              channel="EMAIL"
              metrics={emailMetrics}
              accent="border-violet-200"
            />
            <ChannelBlock
              channel="PUSH"
              metrics={pushMetrics}
              accent="border-amber-200"
            />
          </>
        ) : (
          <CampaignTable data={filtered} />
        )}
      </div>
    </div>
  );
}
