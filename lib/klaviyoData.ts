export interface KlaviyoCampaign {
  id: string;
  channel: 'EMAIL' | 'PUSH';
  campaign_name: string;
  campaign_date: string;
  nb_sent: number;
  nb_open: number;
  nb_click: number;
  taux_open_pct: number;
  taux_click_pct: number;
  orders_attribuees: number;
  ca_attribue: number;
  panier_moyen: number;
  revenu_par_envoi: number;
}

export const klaviyoData: KlaviyoCampaign[] = [
  { id: '01KPZP0MX3G20A9Q1GK97K8F2T', channel: 'EMAIL', campaign_name: '20260501_email_mday-exclusive-offer_cvs', campaign_date: '2026-05-01', nb_sent: 136674, nb_open: 109748, nb_click: 795, taux_open_pct: 80.3, taux_click_pct: 0.58, orders_attribuees: 2529, ca_attribue: 46325.12, panier_moyen: 18.32, revenu_par_envoi: 0.34 },
  { id: '01KPZQ9GJ40JQK4VF3W3MWDQW2', channel: 'EMAIL', campaign_name: '20260501_email_mday-exclusive-offer_us', campaign_date: '2026-05-01', nb_sent: 23960, nb_open: 20147, nb_click: 124, taux_open_pct: 84.09, taux_click_pct: 0.52, orders_attribuees: 71, ca_attribue: 1815.42, panier_moyen: 25.57, revenu_par_envoi: 0.08 },
  { id: '01KPZPK5JNPSBE1HQTS2XCQCH8', channel: 'EMAIL', campaign_name: '20260501_email_mday-exclusive-offer_wg', campaign_date: '2026-05-01', nb_sent: 77170, nb_open: 64061, nb_click: 468, taux_open_pct: 83.01, taux_click_pct: 0.61, orders_attribuees: 2143, ca_attribue: 37499.10, panier_moyen: 17.50, revenu_par_envoi: 0.49 },
  { id: '01KQC8EFD4XHDV7M9RM6DMAS0Z', channel: 'PUSH', campaign_name: '20260501_push_mday-exclusive-offer_cvs', campaign_date: '2026-05-01', nb_sent: 605379, nb_open: 2980, nb_click: 0, taux_open_pct: 0.49, taux_click_pct: 0, orders_attribuees: 535, ca_attribue: 11017.66, panier_moyen: 20.59, revenu_par_envoi: 0.02 },
  { id: '01KQC95Y4PKH90TB5AMY9MXXPV', channel: 'PUSH', campaign_name: '20260501_push_mday-exclusive-offer_wg', campaign_date: '2026-05-01', nb_sent: 460205, nb_open: 2930, nb_click: 0, taux_open_pct: 0.64, taux_click_pct: 0, orders_attribuees: 550, ca_attribue: 10673.62, panier_moyen: 19.41, revenu_par_envoi: 0.02 },
  { id: '01KQW3RB1NYCBPKD80RYTD0PJS', channel: 'EMAIL', campaign_name: '20260501_email_mday-last-minute_us', campaign_date: '2026-05-05', nb_sent: 24008, nb_open: 17292, nb_click: 40, taux_open_pct: 72.03, taux_click_pct: 0.17, orders_attribuees: 112, ca_attribue: 1870.83, panier_moyen: 16.70, revenu_par_envoi: 0.08 },
  { id: '01KQYQKY6A47HA6YS0RKPREG61', channel: 'PUSH', campaign_name: '20260506_push_mday-last-minute_cvs', campaign_date: '2026-05-06', nb_sent: 288717, nb_open: 1976, nb_click: 0, taux_open_pct: 0.68, taux_click_pct: 0, orders_attribuees: 670, ca_attribue: 12272.05, panier_moyen: 18.32, revenu_par_envoi: 0.04 },
  { id: '01KQYR8WEQ3WMXVX4X6J4HS2RQ', channel: 'PUSH', campaign_name: '20260506_push_mday-last-minute_wg', campaign_date: '2026-05-06', nb_sent: 294150, nb_open: 2261, nb_click: 0, taux_open_pct: 0.77, taux_click_pct: 0, orders_attribuees: 685, ca_attribue: 12363.01, panier_moyen: 18.05, revenu_par_envoi: 0.04 },
  { id: '01KQW2CJRMPT19GBRWAWWHVAZP', channel: 'EMAIL', campaign_name: '20260509_email_mday-last-minute_cvs', campaign_date: '2026-05-09', nb_sent: 137318, nb_open: 110180, nb_click: 638, taux_open_pct: 80.24, taux_click_pct: 0.46, orders_attribuees: 1439, ca_attribue: 24230.25, panier_moyen: 16.84, revenu_par_envoi: 0.18 },
  { id: '01KQW3BM3F578Y45Z4QFA3Z8ET', channel: 'EMAIL', campaign_name: '20260509_email_mday-last-minute_wg', campaign_date: '2026-05-09', nb_sent: 76763, nb_open: 63031, nb_click: 242, taux_open_pct: 82.11, taux_click_pct: 0.32, orders_attribuees: 1257, ca_attribue: 23338.92, panier_moyen: 18.57, revenu_par_envoi: 0.30 },
  { id: '01KR17JH0WS889JXDKFMAKA849', channel: 'PUSH', campaign_name: '20260506_push_mday-last-minute2_wg', campaign_date: '2026-05-09', nb_sent: 422157, nb_open: 2631, nb_click: 0, taux_open_pct: 0.62, taux_click_pct: 0, orders_attribuees: 958, ca_attribue: 16252.18, panier_moyen: 16.96, revenu_par_envoi: 0.04 },
  { id: '01KR172T6PX3N57CEBYN5F7YGK', channel: 'PUSH', campaign_name: '20260509_push_mday-last-minute2_cvs', campaign_date: '2026-05-09', nb_sent: 614080, nb_open: 3136, nb_click: 0, taux_open_pct: 0.51, taux_click_pct: 0, orders_attribuees: 1348, ca_attribue: 23236.30, panier_moyen: 17.24, revenu_par_envoi: 0.04 },
  { id: '01KRDJXN9RQKP33WD7HM30B6B8', channel: 'EMAIL', campaign_name: '20260513_email_graduation_cvs', campaign_date: '2026-05-13', nb_sent: 136546, nb_open: 106491, nb_click: 557, taux_open_pct: 77.99, taux_click_pct: 0.41, orders_attribuees: 1254, ca_attribue: 24790.54, panier_moyen: 19.77, revenu_par_envoi: 0.18 },
  { id: '01KRDKSMCFV8YJXJD0TPRK2JDE', channel: 'EMAIL', campaign_name: '20260513_email_graduation_us', campaign_date: '2026-05-13', nb_sent: 23912, nb_open: 19516, nb_click: 53, taux_open_pct: 81.62, taux_click_pct: 0.22, orders_attribuees: 64, ca_attribue: 1069.78, panier_moyen: 16.72, revenu_par_envoi: 0.04 },
  { id: '01KRDKDRRVEV3MXK3TDVZFMVAT', channel: 'EMAIL', campaign_name: '20260513_email_graduation_wg', campaign_date: '2026-05-13', nb_sent: 74418, nb_open: 60331, nb_click: 341, taux_open_pct: 81.07, taux_click_pct: 0.46, orders_attribuees: 1257, ca_attribue: 25470.22, panier_moyen: 20.26, revenu_par_envoi: 0.34 },
  { id: '01KRE31XJG29H7TTJ53Q161CM0', channel: 'PUSH', campaign_name: '20260513_push_graduation_cvs', campaign_date: '2026-05-13', nb_sent: 289861, nb_open: 2169, nb_click: 0, taux_open_pct: 0.75, taux_click_pct: 0, orders_attribuees: 369, ca_attribue: 6924.53, panier_moyen: 18.77, revenu_par_envoi: 0.02 },
  { id: '01KRE42KC75EA1WMVBZH15AYB6', channel: 'PUSH', campaign_name: '20260513_push_graduation_wg', campaign_date: '2026-05-13', nb_sent: 252642, nb_open: 2465, nb_click: 0, taux_open_pct: 0.98, taux_click_pct: 0, orders_attribuees: 336, ca_attribue: 6008.19, panier_moyen: 17.88, revenu_par_envoi: 0.02 },
];

export function parseCampaignLabel(name: string): string {
  // e.g. "20260501_email_mday-exclusive-offer_cvs" → "Mday Exclusive Offer · CVS"
  const parts = name.split('_');
  // Remove date prefix and channel
  const meaningful = parts.slice(2).join('_');
  return meaningful
    .replace(/-/g, ' ')
    .replace(/_/g, ' · ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
