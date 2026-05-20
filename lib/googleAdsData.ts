export interface GoogleAdsRow {
  campaign: string;
  adGroup: string;
  partner: string;
  cost: number;
  cpc: number;
  impressions: number;
  clicks: number;
  ctr: number;
  convValue: number;
  conversions: number;
  convRate: number;
  roas: number;
  imprShare: number;
}

export interface GoogleAdsTotal {
  partner: string;
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  totalConvValue: number;
  totalConversions: number;
  avgCtr: number;
  avgConvRate: number;
  avgRoas: number;
}

export const googleAdsData: GoogleAdsRow[] = [
  { campaign: 'CVS Android', adGroup: 'CVS', partner: 'CVS', cost: 5913.18, cpc: 2.33, impressions: 60741, clicks: 2541, ctr: 4.2, convValue: 15846.0, conversions: 2166.0, convRate: 39.7, roas: 2.64, imprShare: 0.0 },
  { campaign: 'CVS Android', adGroup: 'CVS v2', partner: 'CVS', cost: 12822.39, cpc: 1.82, impressions: 763194, clicks: 7042, ctr: 0.9, convValue: 38121.01, conversions: 5370.0, convRate: 72.0, roas: 2.96, imprShare: 0.0 },
  { campaign: 'CVS Android', adGroup: 'Back to School', partner: 'CVS', cost: 5117.92, cpc: 2.03, impressions: 141336, clicks: 2523, ctr: 1.8, convValue: 20585.92, conversions: 2528.0, convRate: 86.4, roas: 4.02, imprShare: 0.0 },
  { campaign: 'CVS Web Search', adGroup: 'CVS Brand', partner: 'CVS', cost: 9504.94, cpc: 1.40, impressions: 93339, clicks: 6789, ctr: 7.3, convValue: 70122.14, conversions: 1734.14, convRate: 25.5, roas: 3.65, imprShare: 10.0 },
  { campaign: 'CVS Web Search', adGroup: 'CVS Promotions', partner: 'CVS', cost: 5878.79, cpc: 1.79, impressions: 14996, clicks: 3278, ctr: 21.9, convValue: 37072.37, conversions: 903.21, convRate: 27.6, roas: 3.39, imprShare: 12.1 },
  { campaign: 'CVS Web Search', adGroup: 'CVS Photo Generic', partner: 'CVS', cost: 28804.82, cpc: 1.49, impressions: 154633, clicks: 19334, ctr: 12.5, convValue: 193524.21, conversions: 5145.68, convRate: 26.6, roas: 3.30, imprShare: 19.9 },
  { campaign: 'CVS Web Search', adGroup: 'CVS Photo Print', partner: 'CVS', cost: 171317.86, cpc: 1.73, impressions: 441391, clicks: 98936, ctr: 22.4, convValue: 1069670.43, conversions: 30027.22, convRate: 30.4, roas: 3.05, imprShare: 56.6 },
  { campaign: 'CVS Web Search', adGroup: 'CVS Photo Top', partner: 'CVS', cost: 143788.17, cpc: 1.56, impressions: 531854, clicks: 92041, ctr: 17.3, convValue: 920905.57, conversions: 25888.04, convRate: 28.1, roas: 3.16, imprShare: 60.5 },
  { campaign: 'PictaUS Web Search', adGroup: 'Photo Prints', partner: 'Picta', cost: 1343.67, cpc: 2.35, impressions: 7709, clicks: 571, ctr: 7.4, convValue: 4921.17, conversions: 119.31, convRate: 20.9, roas: 1.63, imprShare: 10.0 },
  { campaign: 'PictaUS Web Search', adGroup: 'Photo Prints – Near Me', partner: 'Picta', cost: 8820.83, cpc: 2.72, impressions: 44396, clicks: 3238, ctr: 7.3, convValue: 42259.41, conversions: 909.25, convRate: 28.1, roas: 2.23, imprShare: 13.2 },
  { campaign: 'PictaUS Web Search', adGroup: 'Photo Prints – Same Day', partner: 'Picta', cost: 24887.44, cpc: 2.66, impressions: 105972, clicks: 9354, ctr: 8.8, convValue: 116948.55, conversions: 2583.09, convRate: 27.6, roas: 2.25, imprShare: 23.4 },
  { campaign: 'PictaUS Web Search', adGroup: 'Poster', partner: 'Picta', cost: 337.20, cpc: 2.88, impressions: 2415, clicks: 117, ctr: 4.8, convValue: 1230.93, conversions: 15.51, convRate: 13.3, roas: 1.89, imprShare: 10.0 },
  { campaign: 'WG Web Search', adGroup: 'Poster', partner: 'WG', cost: 4075.34, cpc: 2.49, impressions: 18714, clicks: 1639, ctr: 8.8, convValue: 10583.79, conversions: 367.99, convRate: 22.5, roas: 2.46, imprShare: 10.0 },
  { campaign: 'WG Web Search', adGroup: 'Photo Prints – Same Day', partner: 'WG', cost: 23475.47, cpc: 2.49, impressions: 75336, clicks: 9444, ctr: 12.5, convValue: 57784.98, conversions: 2854.32, convRate: 30.2, roas: 2.41, imprShare: 20.9 },
  { campaign: 'WG Web Search', adGroup: 'Photo Prints – Generic', partner: 'WG', cost: 5319.95, cpc: 2.16, impressions: 48164, clicks: 2463, ctr: 5.1, convValue: 14369.44, conversions: 555.07, convRate: 22.5, roas: 2.49, imprShare: 10.0 },
  { campaign: 'WG Web Search', adGroup: 'Photo Prints – Near Me', partner: 'WG', cost: 81723.02, cpc: 1.82, impressions: 168380, clicks: 44830, ctr: 26.6, convValue: 241665.58, conversions: 13613.49, convRate: 30.4, roas: 2.90, imprShare: 28.4 },
];

export const googleAdsTotals: GoogleAdsTotal[] = [
  { partner: 'CVS', totalCost: 383148.07, totalImpressions: 2201484, totalClicks: 232484, totalConvValue: 2365847.65, totalConversions: 73762.29, avgCtr: 10.6, avgConvRate: 31.0, avgRoas: 6.17 },
  { partner: 'WG', totalCost: 114593.78, totalImpressions: 310594, totalClicks: 58376, totalConvValue: 324403.79, totalConversions: 17390.87, avgCtr: 18.8, avgConvRate: 29.8, avgRoas: 2.83 },
  { partner: 'Picta', totalCost: 35389.14, totalImpressions: 160492, totalClicks: 13280, totalConvValue: 165360.06, totalConversions: 3627.16, avgCtr: 8.3, avgConvRate: 27.3, avgRoas: 4.67 },
];
