// ─── Adjust export data — static ────────────────────────────────────────────
// Source: Adjust report export — 2026-05-20

export type AdjustRow = {
  channel: string;
  installs: number;
  clicks: number;
  all_revenue: number;
  daus: number;
  reattributions: number;
};

// ─── WG (Walgreens) ───────────────────────────────────────────────────────────
export const adjustWG: AdjustRow[] = [
  { channel: 'Organic',              installs: 36539, clicks: 0,     all_revenue: 1732276.65, daus: 6761.28, reattributions: 37 },
  { channel: 'WEB_TO_APP',           installs: 2159,  clicks: 6500,  all_revenue: 81186.09,   daus: 177.21,  reattributions: 4  },
  { channel: 'Google Organic Search',installs: 163,   clicks: 0,     all_revenue: 0,          daus: 15.62,   reattributions: 2  },
  { channel: 'Google Ads',           installs: 75,    clicks: 0,     all_revenue: 515.99,     daus: 226.62,  reattributions: 10 },
  { channel: 'Newsletters',          installs: 17,    clicks: 13778, all_revenue: 598.33,     daus: 2.52,    reattributions: 0  },
  { channel: 'transac_web',          installs: 3,     clicks: 13,    all_revenue: 312.42,     daus: 0.48,    reattributions: 0  },
  { channel: 'Email_Retention',      installs: 2,     clicks: 205,   all_revenue: 147.71,     daus: 1.24,    reattributions: 0  },
];

// ─── CVS ──────────────────────────────────────────────────────────────────────
export const adjustCVS: AdjustRow[] = [
  { channel: 'Apple (ASA)',   installs: 35027, clicks: 0,     all_revenue: 659012.99,  daus: 2357.17, reattributions: 126 },
  { channel: 'Organic',       installs: 33860, clicks: 0,     all_revenue: 1436854.13, daus: 5443.21, reattributions: 225 },
  { channel: 'WEB_TO_APP',    installs: 6620,  clicks: 20459, all_revenue: 238052.16,  daus: 616.86,  reattributions: 25  },
  { channel: 'Google Ads',    installs: 2250,  clicks: 11499, all_revenue: 61702.11,   daus: 113.0,   reattributions: 8   },
  { channel: 'Smart Banners', installs: 872,   clicks: 4678,  all_revenue: 19319.26,   daus: 39.03,   reattributions: 0   },
  { channel: 'Newsletters',   installs: 73,    clicks: 11663, all_revenue: 2404.75,    daus: 6.48,    reattributions: 0   },
  { channel: 'FLYER',         installs: 53,    clicks: 162,   all_revenue: 1027.05,    daus: 2.79,    reattributions: 0   },
  { channel: 'transac_web',   installs: 5,     clicks: 48,    all_revenue: 300.25,     daus: 0.83,    reattributions: 0   },
];

// ─── Channel color map ────────────────────────────────────────────────────────
export const CHANNEL_COLORS: Record<string, string> = {
  'Organic':               '#9843FE', // primary-500
  'Apple (ASA)':           '#292524', // ink-800
  'WEB_TO_APP':            '#FF680F', // tertiary-500
  'Google Ads':            '#4285F4', // google blue
  'Smart Banners':         '#10B981', // emerald
  'Newsletters':           '#B87AFF', // primary-300
  'FLYER':                 '#FF9360', // tertiary-300
  'Google Organic Search': '#34A853', // google green
  'Email_Retention':       '#D3ACFF', // primary-200
  'transac_web':           '#E7E5E4', // ink-200
};

export const CHANNEL_LABEL: Record<string, string> = {
  'WEB_TO_APP':            'Web → App',
  'Google Organic Search': 'Google Organic',
  'Email_Retention':       'Email Rétention',
  'transac_web':           'Transac Web',
  'Apple (ASA)':           'Apple Search Ads',
  'Smart Banners':         'Smart Banners',
};

export function channelLabel(ch: string) {
  return CHANNEL_LABEL[ch] ?? ch;
}
