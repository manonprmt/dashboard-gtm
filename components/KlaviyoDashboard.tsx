'use client';

import { useState, useMemo } from 'react';
import { klaviyoData, repeatRateData, incrementData, monthlyData, parseCampaignLabel, type KlaviyoCampaign } from '@/lib/klaviyoData';

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconMail() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}
function IconBell() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
}
function IconSend() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>; }
function IconEye()  { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>; }
function IconCart() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>; }
function IconDollar() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconRepeat() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>; }

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));
const fmtCurrency = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const platformIcon = (p: string) => p === 'iOS' ? '🍎' : p === 'Android' ? '🤖' : '🌐';

// ─── Shared mini KPI ──────────────────────────────────────────────────────────
function MiniKpi({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: 'primary' | 'tertiary' }) {
  const bg  = accent === 'primary' ? 'bg-primary-100 text-primary-600' : 'bg-tertiary-100 text-tertiary-600';
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>{icon}</div>
      <div>
        <div className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">{label}</div>
        <div className="font-display num text-xl text-ink-900 leading-tight">{value}</div>
      </div>
    </div>
  );
}

// ─── Tab 1: Vue globale ───────────────────────────────────────────────────────
interface ChannelMetrics { nb_sent: number; taux_open_pct: number; orders: number; ca: number; }

function GlobalView({ email, push }: { email: ChannelMetrics; push: ChannelMetrics }) {
  return (
    <div className="space-y-6">
      {/* Email hero */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
        {/* Dark hero card */}
        <div className="rounded-2xl bg-primary-800 p-7 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-primary-300">
            <IconMail />
            <span className="text-[11px] font-medium uppercase tracking-wider">Email</span>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium mt-6">CA attribué</div>
            <div className="font-display num text-5xl text-white leading-none mt-2">{fmtCurrency(email.ca)}</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-primary-700 pt-4">
            <div>
              <div className="text-[10px] text-primary-300 uppercase tracking-wider">Envois</div>
              <div className="font-display num text-xl text-white">{fmt(email.nb_sent)}</div>
            </div>
            <div>
              <div className="text-[10px] text-primary-300 uppercase tracking-wider">Open rate</div>
              <div className="font-display num text-xl text-tertiary-300">{fmtPct(email.taux_open_pct)}</div>
            </div>
          </div>
        </div>

        {/* Secondary metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-ink-200/70 p-5 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Orders Email</div>
            <div className="font-display num text-4xl text-primary-800 leading-none mt-3">{fmt(email.orders)}</div>
            <div className="mt-2 text-xs text-ink-400">attribuées Klaviyo</div>
          </div>
          <div className="rounded-2xl bg-white border border-ink-200/70 p-5 card">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">CA Push</div>
            <div className="font-display num text-4xl text-tertiary-500 leading-none mt-3">{fmtCurrency(push.ca)}</div>
            <div className="mt-2 text-xs text-ink-400">notifications push</div>
          </div>
          <div className="rounded-2xl bg-white border border-ink-200/70 p-5 card flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-tertiary-100 flex items-center justify-center text-tertiary-600 flex-shrink-0"><IconBell /></div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Push envois</div>
              <div className="font-display num text-2xl text-ink-900">{fmt(push.nb_sent)}</div>
              <div className="text-[11px] text-ink-400 mt-0.5">Open {fmtPct(push.taux_open_pct)}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-ink-200/70 p-5 card flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0"><IconCart /></div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Push orders</div>
              <div className="font-display num text-2xl text-ink-900">{fmt(push.orders)}</div>
              <div className="text-[11px] text-ink-400 mt-0.5">{fmtCurrency(push.ca)} CA</div>
            </div>
          </div>
        </div>
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
    <th className={`px-3 py-2.5 text-${align} text-[11px] font-medium text-ink-500 uppercase tracking-wider cursor-pointer hover:text-primary-700 select-none whitespace-nowrap`}
      onClick={() => handleSort(k)}>
      {label}{sortKey === k && <span className="ml-1 opacity-60">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );

  return (
    <div className="rounded-2xl bg-white border border-ink-200/70 card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-ink-100">
            <tr>
              <Th k="campaign_date" label="Date" />
              <Th k="channel" label="Canal" />
              <th className="px-3 py-2.5 text-left text-[11px] font-medium text-ink-500 uppercase tracking-wider">Campagne</th>
              <Th k="nb_sent" label="Envois" align="right" />
              <Th k="taux_open_pct" label="Open" align="right" />
              <Th k="orders_attribuees" label="Orders" align="right" />
              <Th k="ca_attribue" label="CA" align="right" />
              <Th k="panier_moyen" label="Panier" align="right" />
              <Th k="revenu_par_envoi" label="Rev/envoi" align="right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {sorted.map((row) => (
              <tr key={row.id} className="hover:bg-primary-50/40 transition-colors">
                <td className="px-3 py-2.5 text-ink-500 text-xs whitespace-nowrap">{row.campaign_date}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${row.channel === 'EMAIL' ? 'bg-primary-100 text-primary-700' : 'bg-tertiary-100 text-tertiary-700'}`}>
                    {row.channel === 'EMAIL' ? '✉' : '🔔'} {row.channel}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-ink-800 font-medium max-w-[220px] truncate text-xs" title={row.campaign_name}>{parseCampaignLabel(row.campaign_name)}</td>
                <td className="px-3 py-2.5 text-right text-ink-700 num text-xs">{fmt(row.nb_sent)}</td>
                <td className="px-3 py-2.5 text-right num text-xs">
                  <span className={`font-semibold ${row.taux_open_pct > 50 ? 'text-success-600' : row.taux_open_pct > 1 ? 'text-tertiary-600' : 'text-ink-400'}`}>{fmtPct(row.taux_open_pct)}</span>
                </td>
                <td className="px-3 py-2.5 text-right text-ink-700 num text-xs font-medium">{fmt(row.orders_attribuees)}</td>
                <td className="px-3 py-2.5 text-right text-primary-800 num text-xs font-semibold">{fmtCurrency(row.ca_attribue)}</td>
                <td className="px-3 py-2.5 text-right text-ink-500 num text-xs">{fmtCurrency(row.panier_moyen)}</td>
                <td className="px-3 py-2.5 text-right text-ink-500 num text-xs">${row.revenu_par_envoi.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 3: Incrément ────────────────────────────────────────────────────────
function IncrementView() {
  const totalIncrement = incrementData.reduce((s, r) => s + r.nb_orders_increment, 0);
  const avgUplift = (incrementData.reduce((s, r) => s + r.increment_pts, 0) / incrementData.length).toFixed(1);

  const visualData = useMemo(() => ['CVS', 'Walgreens'].map((partner) => {
    const rows = incrementData.filter((r) => r.partner === partner);
    const maxRate = Math.max(...rows.map((r) => r.repeat_rate_exposed));
    return { partner, rows, maxRate };
  }), []);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
        <div className="rounded-2xl bg-primary-800 p-7">
          <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium">Orders incrémentales</div>
          <div className="font-display num text-5xl text-white leading-none mt-3">{fmt(totalIncrement)}</div>
          <div className="mt-4 border-t border-primary-700 pt-4">
            <div className="text-[11px] text-primary-300 uppercase tracking-wider">Uplift moyen</div>
            <div className="font-display num text-2xl text-tertiary-300 mt-1">+{avgUplift} pts</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visualData.map(({ partner, rows, maxRate }) => (
            <div key={partner} className="rounded-2xl bg-white border border-ink-200/70 card overflow-hidden">
              <div className="px-5 py-3 border-b border-ink-100">
                <span className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">{partner} — Repeat Rate</span>
              </div>
              <div className="p-5 space-y-4">
                {rows.map((row) => {
                  const exposedPct = Math.round((row.repeat_rate_exposed / (maxRate + 5)) * 100);
                  const controlPct = Math.round((row.repeat_rate_control / (maxRate + 5)) * 100);
                  return (
                    <div key={row.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-ink-700">{platformIcon(row.platform)} {row.platform}</span>
                        <span className="text-xs font-bold text-primary-600">+{row.increment_pts} pts</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-ink-400 w-20 text-right">Avec Klaviyo</span>
                        <div className="flex-1 bg-ink-100 rounded-full h-4 overflow-hidden relative">
                          <div className="h-full rounded-full bg-primary-500" style={{ width: `${exposedPct}%` }} />
                          <span className="absolute inset-0 flex items-center justify-end pr-2 text-[10px] font-bold text-white">{row.repeat_rate_exposed}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-ink-400 w-20 text-right">Sans Klaviyo</span>
                        <div className="flex-1 bg-ink-100 rounded-full h-4 overflow-hidden relative">
                          <div className="h-full rounded-full bg-ink-300" style={{ width: `${controlPct}%` }} />
                          <span className="absolute inset-0 flex items-center justify-end pr-2 text-[10px] font-bold text-ink-600">{row.repeat_rate_control}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Repeat Rate ───────────────────────────────────────────────────────
const RATE_TEXT = (v: number) =>
  v >= 30 ? 'text-success-600' : v >= 20 ? 'text-primary-700' : v >= 10 ? 'text-tertiary-600' : 'text-ink-400';
const RATE_BG = (v: number) =>
  v >= 30 ? 'bg-success-500' : v >= 20 ? 'bg-primary-500' : v >= 10 ? 'bg-tertiary-400' : 'bg-ink-200';

function RepeatRateView() {
  const platforms = ['iOS', 'Android', 'Web'] as const;
  const grid = useMemo(() => {
    const cvs = repeatRateData.filter((r) => r.partner === 'CVS');
    const wg  = repeatRateData.filter((r) => r.partner === 'Walgreens');
    const maxRate = Math.max(...[...cvs, ...wg].map((r) => r.repeat_rate_m9 ?? r.repeat_rate_m6));
    return { cvs, wg, maxRate };
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5 text-xs text-ink-500">
        {[['bg-success-500','≥ 30%'],['bg-primary-500','20–30%'],['bg-tertiary-400','10–20%'],['bg-ink-200','< 10%']].map(([bg, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${bg}`} />{label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['cvs','wg'] as const).map((key) => {
          const partnerName = key === 'cvs' ? 'CVS' : 'Walgreens';
          const rows = key === 'cvs' ? grid.cvs : grid.wg;
          return (
            <div key={key} className="rounded-2xl bg-white border border-ink-200/70 card overflow-hidden">
              <div className={`px-5 py-3 border-b border-ink-100 ${key === 'cvs' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                <span className={`font-display text-sm uppercase tracking-widest ${key === 'cvs' ? 'text-blue-700' : 'text-emerald-700'}`}>{partnerName}</span>
              </div>
              <div className="divide-y divide-ink-50">
                {platforms.map((platform) => {
                  const row = rows.find((r) => r.platform === platform);
                  if (!row) return null;
                  return (
                    <div key={platform} className="px-5 py-4">
                      <div className="flex items-center gap-1.5 mb-4">
                        <span>{platformIcon(platform)}</span>
                        <span className="text-xs font-bold text-ink-700 uppercase tracking-wide">{platform}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[{ label: 'M3', value: row.repeat_rate_m3 },{ label: 'M6', value: row.repeat_rate_m6 },{ label: 'M9', value: row.repeat_rate_m9 }].map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <p className="text-[10px] font-medium text-ink-400 uppercase mb-1">{label}</p>
                            {value !== null ? (
                              <>
                                <p className={`font-display num text-xl leading-none ${RATE_TEXT(value)}`}>{value}%</p>
                                <div className="w-full bg-ink-100 rounded-full h-1.5 mt-1.5">
                                  <div className={`h-1.5 rounded-full ${RATE_BG(value)}`} style={{ width: `${Math.min((value / (grid.maxRate + 5)) * 100, 100)}%` }} />
                                </div>
                              </>
                            ) : <p className="text-ink-300">—</p>}
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
function MonthlyView() {
  const [partner, setPartner] = useState<'CVS' | 'Walgreens'>('CVS');
  const [platform, setPlatform] = useState<'iOS' | 'Android' | 'Web'>('iOS');

  const filtered = useMemo(() =>
    monthlyData.filter((r) => r.partner === partner && r.platform === platform),
    [partner, platform]
  );
  const maxVal = useMemo(() => Math.max(...filtered.map((r) => r.nb_new + r.nb_returning), 1), [filtered]);
  const totalNew       = filtered.reduce((s, r) => s + r.nb_new, 0);
  const totalReturning = filtered.reduce((s, r) => s + r.nb_returning, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
          {(['CVS','Walgreens'] as const).map((p) => (
            <button key={p} onClick={() => setPartner(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${partner === p ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-600 hover:text-ink-800'}`}>{p}</button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
          {(['iOS','Android','Web'] as const).map((pl) => (
            <button key={pl} onClick={() => setPlatform(pl)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${platform === pl ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-600 hover:text-ink-800'}`}>{platformIcon(pl)} {pl}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-primary-800 p-5">
          <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium">Nouveaux clients YTD</div>
          <div className="font-display num text-4xl text-white leading-none mt-2">{fmt(totalNew)}</div>
        </div>
        <div className="rounded-2xl bg-white border border-ink-200/70 p-5 card">
          <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">Récurrents YTD</div>
          <div className="font-display num text-4xl text-tertiary-500 leading-none mt-2">{fmt(totalReturning)}</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl bg-white border border-ink-200/70 card p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">New vs Returning — {partner} · {platform}</span>
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-primary-500" />Nouveaux</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-tertiary-400" />Récurrents</span>
          </div>
        </div>
        <div className="flex items-end justify-around gap-3 h-48">
          {filtered.map((row) => {
            const newH = (row.nb_new / maxVal) * 100;
            const retH = (row.nb_returning / maxVal) * 100;
            const total = row.nb_new + row.nb_returning;
            return (
              <div key={row.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex flex-col justify-end h-40 gap-0.5 relative">
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[10px] rounded-xl px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none text-center">
                    <p className="font-semibold">{row.month}</p>
                    <p>Nvx : {fmt(row.nb_new)} · Ret : {fmt(row.nb_returning)}</p>
                  </div>
                  <div className="w-full rounded-t bg-primary-500 transition-all" style={{ height: `${newH}%` }} />
                  <div className="w-full rounded-t bg-tertiary-400 transition-all" style={{ height: `${retH}%` }} />
                </div>
                <span className="text-xs font-medium text-ink-500">{row.month}</span>
                <span className="text-[10px] text-ink-400">{fmt(total)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type Tab = 'global' | 'detail' | 'increment' | 'repeat' | 'monthly';
const TABS: { id: Tab; label: string }[] = [
  { id: 'global',    label: 'Vue globale' },
  { id: 'detail',    label: 'Campagnes' },
  { id: 'increment', label: 'Incrément' },
  { id: 'repeat',    label: 'Repeat Rate' },
  { id: 'monthly',   label: 'Évolution' },
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
    const sent = rows.reduce((s, r) => s + r.nb_sent, 0);
    const open = rows.reduce((s, r) => s + r.nb_open, 0);
    return { nb_sent: sent, taux_open_pct: sent > 0 ? (open / sent) * 100 : 0, orders: rows.reduce((s, r) => s + r.orders_attribuees, 0), ca: rows.reduce((s, r) => s + r.ca_attribue, 0) };
  }, [filtered]);

  const pushMetrics = useMemo((): ChannelMetrics => {
    const rows = filtered.filter((d) => d.channel === 'PUSH');
    const sent = rows.reduce((s, r) => s + r.nb_sent, 0);
    const open = rows.reduce((s, r) => s + r.nb_open, 0);
    return { nb_sent: sent, taux_open_pct: sent > 0 ? (open / sent) * 100 : 0, orders: rows.reduce((s, r) => s + r.orders_attribuees, 0), ca: rows.reduce((s, r) => s + r.ca_attribue, 0) };
  }, [filtered]);

  const showDateFilter = activeTab === 'global' || activeTab === 'detail';

  return (
    <div className="bg-ink-50 min-h-full">
      {/* Sub-header */}
      <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-primary-800 leading-none">Picta</span>
            <span className="font-script text-lg text-tertiary-500 leading-none">CRM</span>
          </div>

          {/* Tabs - pill style */}
          <div className="flex items-center gap-0.5 bg-ink-100 p-1 rounded-full">
            {TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeTab === id ? 'bg-white text-primary-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Date filter */}
          {showDateFilter && (
            <div className="flex items-center gap-2 bg-white border border-ink-200 rounded-full px-3 py-1.5 ml-auto">
              <svg className="w-3.5 h-3.5 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <input type="date" value={dateFrom} min={dates[0]} max={dateTo} onChange={(e) => setDateFrom(e.target.value)} className="bg-transparent text-xs text-ink-700 outline-none" />
              <span className="text-ink-300 text-xs">→</span>
              <input type="date" value={dateTo} min={dateFrom} max={dates[dates.length - 1]} onChange={(e) => setDateTo(e.target.value)} className="bg-transparent text-xs text-ink-700 outline-none" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wider text-ink-500 font-medium">CRM & Rétention</div>
          <h1 className="font-display text-5xl text-primary-800 leading-none mt-1">Klaviyo</h1>
          <p className="mt-2 text-xs text-ink-500">
            {filtered.length} campagne{filtered.length !== 1 ? 's' : ''} · {dateFrom} → {dateTo}
          </p>
        </div>

        {activeTab === 'global'    && <GlobalView email={emailMetrics} push={pushMetrics} />}
        {activeTab === 'detail'    && <CampaignTable data={filtered} />}
        {activeTab === 'increment' && <IncrementView />}
        {activeTab === 'repeat'    && <RepeatRateView />}
        {activeTab === 'monthly'   && <MonthlyView />}
      </div>

      <footer className="max-w-[1280px] mx-auto px-6 py-8 text-xs text-ink-400">
        Klaviyo CRM · Email & Push · données attribuées
      </footer>
    </div>
  );
}
