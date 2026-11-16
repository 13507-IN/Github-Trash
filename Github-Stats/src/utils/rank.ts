export interface RankResult {
  level: string;
  percentile: number;
  score: number;
}

export function calculateRank(params: {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  totalReviews: number;
  contributedTo: number;
}): RankResult {
  const { totalCommits, totalPRs, totalIssues, totalStars, totalReviews, contributedTo } = params;

  // Weighted score calculation
  const score = Math.round(
    totalCommits * 1.5 +
    totalPRs * 3.0 +
    totalReviews * 2.5 +
    totalIssues * 1.0 +
    totalStars * 4.0 +
    contributedTo * 2.0
  );

  let level = 'C';
  let percentile = 90;

  if (score >= 1200) {
    level = 'S+';
    percentile = 1;
  } else if (score >= 700) {
    level = 'S';
    percentile = 5;
  } else if (score >= 400) {
    level = 'A+';
    percentile = 12;
  } else if (score >= 250) {
    level = 'A';
    percentile = 25;
  } else if (score >= 150) {
    level = 'A-';
    percentile = 40;
  } else if (score >= 90) {
    level = 'B+';
    percentile = 55;
  } else if (score >= 50) {
    level = 'B';
    percentile = 70;
  } else if (score >= 20) {
    level = 'B-';
    percentile = 80;
  } else if (score >= 10) {
    level = 'C+';
    percentile = 88;
  } else {
    level = 'C';
    percentile = 95;
  }

  return {
    level,
    percentile,
    score
  };
}
