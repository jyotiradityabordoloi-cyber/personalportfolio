// ─────────────────────────────────────────────────────────────
// Analytics case studies. All chart data below is SYNTHETIC
// sample data, labelled as such on the site. Swap in your real
// dataset (or keep it synthetic and say so).
// ─────────────────────────────────────────────────────────────

export type AnalyticsKind = "funnel" | "cohort" | "abtest";

export type AnalyticsStudy = {
  slug: string;
  kind: AnalyticsKind;
  title: string;
  short: string;
  problem: string;
  hypothesis: string;
  dataset: { name: string; rows: string; fields: string[]; note: string };
  methodology: string[];
  sql: { title: string; code: string }[];
  kpis: { name: string; definition: string }[];
  insights: string[];
  recommendations: string[];
  impact: string;
};

// ── Synthetic chart data ────────────────────────────────────

export const funnelData = [
  { step: "Landing visit", users: 48200 },
  { step: "Sign-up started", users: 15900 },
  { step: "Account created", users: 11300 },
  { step: "Onboarding done", users: 6100 },
  { step: "First project", users: 3900 },
  { step: "Paid plan", users: 870 },
];

export const funnelByDevice = [
  { step: "Visit", desktop: 100, mobile: 100 },
  { step: "Start", desktop: 38, mobile: 29 },
  { step: "Created", desktop: 28, mobile: 19 },
  { step: "Onboarded", desktop: 16, mobile: 9 },
  { step: "Project", desktop: 10.5, mobile: 5.6 },
  { step: "Paid", desktop: 2.4, mobile: 1.2 },
];

export const cohortWeeks = ["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7"];
export const cohorts: { cohort: string; size: number; retention: (number | null)[] }[] = [
  { cohort: "Jan 06", size: 1240, retention: [100, 46, 34, 29, 26, 24, 23, 22] },
  { cohort: "Jan 13", size: 1310, retention: [100, 44, 33, 28, 25, 23, 22, null] },
  { cohort: "Jan 20", size: 1185, retention: [100, 48, 37, 31, 28, 26, null, null] },
  { cohort: "Jan 27", size: 1402, retention: [100, 52, 41, 35, 32, null, null, null] },
  { cohort: "Feb 03", size: 1356, retention: [100, 55, 44, 38, null, null, null, null] },
  { cohort: "Feb 10", size: 1290, retention: [100, 57, 46, null, null, null, null, null] },
  { cohort: "Feb 17", size: 1421, retention: [100, 58, null, null, null, null, null, null] },
  { cohort: "Feb 24", size: 1378, retention: [100, null, null, null, null, null, null, null] },
];

export const retentionCurves = cohortWeeks.map((w, i) => ({
  week: w,
  "Before onboarding change": [100, 45, 34, 29, 26, 24, 23, 22][i],
  "After onboarding change": i <= 3 ? [100, 56, 44, 38][i] : null,
}));

export const abDaily = Array.from({ length: 14 }, (_, i) => {
  const day = i + 1;
  // deterministic synthetic noise
  const n1 = Math.sin(day * 1.7) * 0.25;
  const n2 = Math.cos(day * 1.3) * 0.25;
  return {
    day: `D${day}`,
    control: +(4.1 + n1).toFixed(2),
    variant: +(4.6 + n2).toFixed(2),
  };
});

export const abSummary = {
  control: { users: 21480, conversions: 881, rate: 4.1 },
  variant: { users: 21512, conversions: 990, rate: 4.6 },
  liftPct: 12.2,
  ci: [2.8, 21.6] as [number, number],
  pValue: 0.011,
  power: 0.8,
  mde: 8,
};

// ── Studies ─────────────────────────────────────────────────

export const analytics: AnalyticsStudy[] = [
  {
    slug: "funnel-analysis",
    kind: "funnel",
    title: "Funnel Analysis & Conversion Optimization",
    short: "Finding where a SaaS sign-up funnel leaks, and which fix to ship first.",
    problem:
      "Traffic to a SaaS product's landing page is healthy, but very few visitors become paying customers. The team doesn't know which step loses the most users or why.",
    hypothesis:
      "The biggest drop happens between account creation and finishing onboarding, and it is worse on mobile because onboarding asks for setup that's hard on a small screen.",
    dataset: {
      name: "Synthetic product event log",
      rows: "~48k visitors, 6 funnel events",
      fields: ["user_id", "event_name", "event_time", "device", "channel", "plan"],
      note: "Synthetic sample data created for this case study",
    },
    methodology: [
      "Defined funnel steps and a 7-day conversion window",
      "Built step-by-step conversion with SQL window functions",
      "Segmented by device and acquisition channel",
      "Looked at time-to-next-step to separate friction from drop-off",
      "Sized the opportunity for each step before proposing fixes",
    ],
    sql: [
      {
        title: "Ordered funnel with a 7-day window",
        code: `WITH steps AS (
  SELECT
    user_id,
    MIN(CASE WHEN event_name = 'landing_visit'   THEN event_time END) AS t_visit,
    MIN(CASE WHEN event_name = 'signup_started'  THEN event_time END) AS t_start,
    MIN(CASE WHEN event_name = 'account_created' THEN event_time END) AS t_created,
    MIN(CASE WHEN event_name = 'onboarding_done' THEN event_time END) AS t_onboarded,
    MIN(CASE WHEN event_name = 'first_project'   THEN event_time END) AS t_project,
    MIN(CASE WHEN event_name = 'plan_purchased'  THEN event_time END) AS t_paid
  FROM events
  GROUP BY user_id
)
SELECT
  COUNT(t_visit)                                                         AS visit,
  COUNT(CASE WHEN t_start     <= t_visit + INTERVAL '7 day' THEN 1 END) AS started,
  COUNT(CASE WHEN t_created   <= t_visit + INTERVAL '7 day' THEN 1 END) AS created,
  COUNT(CASE WHEN t_onboarded <= t_visit + INTERVAL '7 day' THEN 1 END) AS onboarded,
  COUNT(CASE WHEN t_project   <= t_visit + INTERVAL '7 day' THEN 1 END) AS project,
  COUNT(CASE WHEN t_paid      <= t_visit + INTERVAL '7 day' THEN 1 END) AS paid
FROM steps;`,
      },
      {
        title: "Step conversion by device",
        code: `SELECT
  device,
  ROUND(100.0 * COUNT(t_onboarded) / NULLIF(COUNT(t_created), 0), 1) AS created_to_onboarded_pct
FROM steps
JOIN users USING (user_id)
GROUP BY device
ORDER BY created_to_onboarded_pct;`,
      },
    ],
    kpis: [
      { name: "Step conversion rate", definition: "Users reaching step n+1 ÷ users reaching step n, within 7 days" },
      { name: "Visit → paid conversion", definition: "Paid users ÷ landing visitors in the window" },
      { name: "Median time to onboard", definition: "Median minutes from account_created to onboarding_done" },
    ],
    insights: [
      "In the sample, account created → onboarding done is the largest relative drop (~46%).",
      "Mobile converts at roughly half the desktop rate from the onboarding step onward.",
      "Users who finish onboarding within one session are far more likely to create a first project.",
    ],
    recommendations: [
      "Cut onboarding to the minimum needed for a first project; defer integrations",
      "Ship a mobile-specific onboarding path with 'continue on desktop' email",
      "Add a pre-filled sample project so users reach value before setup",
    ],
    impact:
      "Expected: higher onboarding completion and visit → paid conversion. Size to be validated with an A/B test before claiming impact.",
  },
  {
    slug: "cohort-retention",
    kind: "cohort",
    title: "Cohort Analysis & User Retention",
    short: "Did the new onboarding actually make users stick? Reading weekly cohorts.",
    problem:
      "A consumer app changed its onboarding in late January. Overall active users rose, but it was unclear whether retention improved or whether it was just more sign-ups.",
    hypothesis:
      "Cohorts that signed up after the onboarding change will show higher week-1 and week-4 retention than earlier cohorts.",
    dataset: {
      name: "Synthetic sign-up and activity tables",
      rows: "8 weekly cohorts, ~10.6k users",
      fields: ["user_id", "signup_date", "activity_date", "platform", "acquisition_channel"],
      note: "Synthetic sample data created for this case study",
    },
    methodology: [
      "Grouped users into weekly sign-up cohorts",
      "Computed week-N retention as active in week N ÷ cohort size",
      "Compared pre- and post-change cohorts on W1 and W4",
      "Checked channel mix to rule out acquisition-driven bias",
    ],
    sql: [
      {
        title: "Weekly retention matrix",
        code: `WITH cohort AS (
  SELECT user_id, DATE_TRUNC('week', signup_date) AS cohort_week
  FROM users
),
activity AS (
  SELECT DISTINCT
    a.user_id,
    c.cohort_week,
    FLOOR(EXTRACT(EPOCH FROM (a.activity_date - c.cohort_week)) / 604800) AS week_n
  FROM activity a
  JOIN cohort c USING (user_id)
)
SELECT
  cohort_week,
  week_n,
  COUNT(DISTINCT user_id) AS active_users,
  ROUND(100.0 * COUNT(DISTINCT user_id)
        / FIRST_VALUE(COUNT(DISTINCT user_id)) OVER (
            PARTITION BY cohort_week ORDER BY week_n), 1) AS retention_pct
FROM activity
GROUP BY cohort_week, week_n
ORDER BY cohort_week, week_n;`,
      },
    ],
    kpis: [
      { name: "Week-N retention", definition: "Users active in week N ÷ users in the cohort" },
      { name: "W1 retention", definition: "Share of a cohort active in their second week" },
      { name: "Retention curve flattening", definition: "Week at which week-over-week loss falls below 2 points" },
    ],
    insights: [
      "In the sample, post-change cohorts show higher W1 retention (≈55–58% vs ≈44–48%).",
      "The improvement carries into W3, which suggests the change is not just a novelty effect.",
      "Channel mix was similar before and after, so the lift is unlikely to come from acquisition.",
    ],
    recommendations: [
      "Keep the new onboarding and make the W1 'return trigger' a tracked KPI",
      "Extend analysis to W8 once data matures before reporting long-term impact",
      "Segment by platform to find where retention still lags",
    ],
    impact: "Expected: a higher retention floor and better LTV. Confirm with matured cohorts and a holdout group.",
  },
  {
    slug: "ab-testing",
    kind: "abtest",
    title: "A/B Testing & Experimentation",
    short: "Designing, running and reading a pricing-page experiment without fooling ourselves.",
    problem:
      "The pricing page has a high exit rate. The team wants to test a redesigned plan comparison with a highlighted recommended plan.",
    hypothesis:
      "Highlighting a recommended plan and simplifying the comparison table will increase pricing-page → checkout conversion by at least 8% (relative).",
    dataset: {
      name: "Synthetic experiment assignment and conversion log",
      rows: "~43k users, 50/50 split, 14 days",
      fields: ["user_id", "variant", "assigned_at", "converted", "device", "country"],
      note: "Synthetic sample data created for this case study",
    },
    methodology: [
      "Pre-registered the primary metric, MDE (8%), α = 0.05 and power = 0.8",
      "Calculated sample size, then ran for two full weekly cycles",
      "Checked sample ratio mismatch before reading results",
      "Two-proportion z-test with 95% confidence interval on relative lift",
      "Guardrails: refund rate and support tickets",
    ],
    sql: [
      {
        title: "Results by variant + SRM check input",
        code: `SELECT
  variant,
  COUNT(*)                           AS users,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) AS conversions,
  ROUND(100.0 * AVG(CASE WHEN converted THEN 1 ELSE 0 END), 2) AS conv_rate_pct
FROM experiment_users
WHERE experiment_id = 'pricing_page_v2'
  AND assigned_at BETWEEN '2025-03-03' AND '2025-03-16'
GROUP BY variant;`,
      },
      {
        title: "Daily conversion for novelty-effect check",
        code: `SELECT
  DATE(assigned_at) AS day,
  variant,
  ROUND(100.0 * AVG(CASE WHEN converted THEN 1 ELSE 0 END), 2) AS conv_rate_pct
FROM experiment_users
WHERE experiment_id = 'pricing_page_v2'
GROUP BY 1, 2
ORDER BY 1, 2;`,
      },
    ],
    kpis: [
      { name: "Conversion rate", definition: "Users who started checkout ÷ users assigned" },
      { name: "Relative lift", definition: "(Variant rate − control rate) ÷ control rate" },
      { name: "Guardrail: refund rate", definition: "Refunds within 14 days ÷ purchases" },
    ],
    insights: [
      "In the sample, the variant converts at 4.6% vs 4.1% (≈12% relative lift, p ≈ 0.01).",
      "The 95% CI on lift stays above zero, and the daily trend shows no fading novelty effect.",
      "No sample ratio mismatch; guardrail metrics stayed flat.",
    ],
    recommendations: [
      "Ship the variant to 100% and keep a 5% holdout for a month",
      "Follow up with a test on annual-plan default",
      "Add the experiment to the team's learning log",
    ],
    impact: "Expected: more pricing-page → checkout conversions. Real impact to be measured on a holdout after rollout.",
  },
];

export const getAnalytics = (slug: string) => analytics.find((a) => a.slug === slug);
