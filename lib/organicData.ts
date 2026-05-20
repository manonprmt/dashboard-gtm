// ─── Organic Instagram — static data ────────────────────────────────────────
// Update these numbers each month from Meta Business Suite / picta-ig-dashboard

export const organicCurrentMonth = "May 2026";

export const organicKpis = {
  followers_end: 5638,
  followers_delta: +35,
  organic_reach: 869,
  total_views: 1446,
  engagement_rate: 0.0221, // 2.21%
  reels_posted: 0,
  static_posted: 7,
  page_visits: 212,
  reel_views: 0,
  story_views: 398,
  saves: 0,
  shares: 2,
  comments: 6,
  likes: 24,
  replies: 0,
  profile_visits: 7,
};

// YTD — Views & Reach by month (Jan → current)
export const organicMonthlyBars = [
  { month: "2026-01", label: "Jan", views: 13500, reach: 3500 },
  { month: "2026-02", label: "Feb", views: 12000, reach: 4200 },
  { month: "2026-03", label: "Mar", views: 6500,  reach: 4100 },
  { month: "2026-04", label: "Apr", views: 5100,  reach: 3700 },
  { month: "2026-05", label: "May", views: 1446,  reach: 869  },
];

// Top static posts (add permalink to make them clickable)
export type StaticTopPost = {
  id: string;
  caption: string;
  permalink: string | null;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement_rate: number;
};

export const organicTopStatics: StaticTopPost[] = [
  {
    id: "1",
    caption: "We're just here for the main character energy 🌟✨",
    permalink: null,
    views: 0,
    reach: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    engagement_rate: 0,
  },
  {
    id: "2",
    caption: "Graduation season is officially here 🎓 From pre-k to college, every milestone deserves to be printed.",
    permalink: null,
    views: 0,
    reach: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    engagement_rate: 0,
  },
];

// Top reels (empty for May — 0 reels posted)
export const organicTopReels: StaticTopPost[] = [];
