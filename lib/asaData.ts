export interface AsaKpis {
  totalSpend: number;
  totalImpressions: number;
  totalTaps: number;
  totalInstalls: number;
  totalNewDownloads: number;
  totalRedownloads: number;
  avgTtr: number;
  avgCpt: number;
  avgCr: number;
  avgCpa: number;
}

export interface AsaKeyword {
  searchTerm: string;
  spend: number;
  impressions: number;
  taps: number;
  installs: number;
  newDownloads: number;
  avgTtr: number;
  avgCpt: number;
  avgCr: number;
  avgCpa: number;
}

export interface AsaDailyTrend {
  day: string;
  spend: number;
  installs: number;
  taps: number;
}

export const asaKpis: AsaKpis = {
  totalSpend: 102835.55,
  totalImpressions: 519842,
  totalTaps: 45189,
  totalInstalls: 40571,
  totalNewDownloads: 30972,
  totalRedownloads: 9599,
  avgTtr: 10.2,
  avgCpt: 2.28,
  avgCr: 89.8,
  avgCpa: 2.53,
};

export const asaByKeyword: AsaKeyword[] = [
  { searchTerm: 'cvs photo', spend: 42089.25, impressions: 37203, taps: 7539, installs: 17032, newDownloads: 11595, avgTtr: 20.4, avgCpt: 5.58, avgCr: 225.9, avgCpa: 2.47 },
  { searchTerm: 'cvs', spend: 38452.85, impressions: 294756, taps: 22817, installs: 15442, newDownloads: 12621, avgTtr: 8.0, avgCpt: 1.69, avgCr: 67.7, avgCpa: 2.49 },
  { searchTerm: 'cvs pharmacy', spend: 19831.01, impressions: 180923, taps: 13934, installs: 7441, newDownloads: 6345, avgTtr: 7.7, avgCpt: 1.42, avgCr: 53.3, avgCpa: 2.67 },
  { searchTerm: 'cvs print photos', spend: 839.95, impressions: 504, taps: 170, installs: 160, newDownloads: 59, avgTtr: 38.7, avgCpt: 4.94, avgCr: 94.2, avgCpa: 5.25 },
  { searchTerm: 'cvs app', spend: 751.82, impressions: 5436, taps: 561, installs: 321, newDownloads: 278, avgTtr: 11.3, avgCpt: 1.34, avgCr: 57.3, avgCpa: 2.34 },
  { searchTerm: 'the cvs photo & print', spend: 655.38, impressions: 380, taps: 105, installs: 93, newDownloads: 45, avgTtr: 29.1, avgCpt: 6.24, avgCr: 88.6, avgCpa: 7.05 },
  { searchTerm: 'cvs pictures', spend: 117.37, impressions: 56, taps: 17, installs: 32, newDownloads: 11, avgTtr: 43.4, avgCpt: 6.90, avgCr: 188.2, avgCpa: 3.67 },
  { searchTerm: 'cvs health', spend: 45.48, impressions: 477, taps: 23, installs: 12, newDownloads: 6, avgTtr: 5.8, avgCpt: 1.98, avgCr: 52.3, avgCpa: 3.79 },
  { searchTerm: 'cvs minute photo', spend: 30.45, impressions: 47, taps: 13, installs: 32, newDownloads: 6, avgTtr: 28.4, avgCpt: 2.34, avgCr: 246.2, avgCpa: 0.95 },
  { searchTerm: 'cvs otchs app', spend: 8.10, impressions: 11, taps: 4, installs: 2, newDownloads: 2, avgTtr: 36.0, avgCpt: 2.02, avgCr: 50.0, avgCpa: 4.05 },
];

export const asaDailyTrend: AsaDailyTrend[] = [
  { day: '2026-04-20', spend: 3423.75, installs: 1241, taps: 1768 },
  { day: '2026-04-21', spend: 3554.09, installs: 1422, taps: 1794 },
  { day: '2026-04-22', spend: 3501.66, installs: 1437, taps: 1861 },
  { day: '2026-04-23', spend: 2770.46, installs: 1007, taps: 1118 },
  { day: '2026-04-24', spend: 2272.94, installs: 968, taps: 1228 },
  { day: '2026-04-25', spend: 2160.97, installs: 969, taps: 1017 },
  { day: '2026-04-26', spend: 2623.13, installs: 1152, taps: 1156 },
  { day: '2026-04-27', spend: 3264.18, installs: 1389, taps: 1480 },
  { day: '2026-04-28', spend: 3440.12, installs: 1392, taps: 1568 },
  { day: '2026-04-29', spend: 2876.14, installs: 1217, taps: 1173 },
  { day: '2026-04-30', spend: 2668.57, installs: 1298, taps: 1421 },
  { day: '2026-05-01', spend: 2586.91, installs: 1152, taps: 1209 },
  { day: '2026-05-02', spend: 2495.37, installs: 1117, taps: 1126 },
  { day: '2026-05-03', spend: 3313.21, installs: 1222, taps: 1262 },
  { day: '2026-05-04', spend: 3336.81, installs: 1349, taps: 1225 },
  { day: '2026-05-05', spend: 3073.07, installs: 1355, taps: 1285 },
  { day: '2026-05-06', spend: 2901.04, installs: 1608, taps: 1523 },
  { day: '2026-05-07', spend: 3764.72, installs: 1826, taps: 1666 },
  { day: '2026-05-08', spend: 3419.35, installs: 1620, taps: 1521 },
  { day: '2026-05-09', spend: 3538.69, installs: 1862, taps: 1670 },
  { day: '2026-05-10', spend: 3527.36, installs: 1643, taps: 1607 },
  { day: '2026-05-11', spend: 3239.12, installs: 1178, taps: 1315 },
  { day: '2026-05-12', spend: 3508.38, installs: 1158, taps: 1349 },
  { day: '2026-05-13', spend: 4371.62, installs: 1453, taps: 2096 },
  { day: '2026-05-14', spend: 4765.35, installs: 1498, taps: 2072 },
  { day: '2026-05-15', spend: 4169.60, installs: 1307, taps: 1486 },
  { day: '2026-05-16', spend: 4435.04, installs: 1387, taps: 1654 },
  { day: '2026-05-17', spend: 4085.31, installs: 1401, taps: 1767 },
  { day: '2026-05-18', spend: 4764.60, installs: 1630, taps: 2019 },
  { day: '2026-05-19', spend: 4983.99, installs: 1313, taps: 1753 },
];
