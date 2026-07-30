import { BlindPlacement, OfficialPlacement, ScoreBreakdown, RankingComparisonItem } from '../types';

export function calculateScoreBreakdown(
  blindPlacements: BlindPlacement[],
  officialPlacements: OfficialPlacement[]
): ScoreBreakdown {
  const items: RankingComparisonItem[] = [];
  let totalPenalty = 0;

  // Map official placements by movie ID
  const officialMap = new Map<number, number>();
  officialPlacements.forEach((item) => {
    officialMap.set(item.movie.id, item.position);
  });

  blindPlacements.forEach((blind) => {
    const officialRank = officialMap.get(blind.movie.id) || blind.position;
    const blindRank = blind.position;
    const diff = Math.abs(blindRank - officialRank);
    
    // Non-linear weighted penalty: (diff ^ 1.35)
    // Small slips (diff = 1) -> 1pt
    // Larger leaps (diff = 8) -> ~16.6pt
    const penalty = diff === 0 ? 0 : Math.pow(diff, 1.35);
    totalPenalty += penalty;

    items.push({
      movie: blind.movie,
      blindRank,
      officialRank,
      difference: diff,
      penalty: Number(penalty.toFixed(2))
    });
  });

  // Sort items by Official Rank for clear visual display
  items.sort((a, b) => a.officialRank - b.officialRank);

  // Maximum possible penalty for 10 items (reversing list completely)
  // Distances: [9, 7, 5, 3, 1, 1, 3, 5, 7, 9]
  const maxPossiblePenalty = 2 * (
    Math.pow(9, 1.35) +
    Math.pow(7, 1.35) +
    Math.pow(5, 1.35) +
    Math.pow(3, 1.35) +
    Math.pow(1, 1.35)
  );

  const rawScore = 100 * (1 - totalPenalty / maxPossiblePenalty);
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  let rankBadge = 'Chaotic Intuition 🌀';
  let rankBadgeIcon = '🌀';

  if (finalScore === 100) {
    rankBadge = 'Omniscient Cinephile 👑';
    rankBadgeIcon = '👑';
  } else if (finalScore >= 90) {
    rankBadge = 'Cinema Psychic 🔮';
    rankBadgeIcon = '🔮';
  } else if (finalScore >= 78) {
    rankBadge = 'Master Film Critic 🎬';
    rankBadgeIcon = '🎬';
  } else if (finalScore >= 60) {
    rankBadge = 'Avid Movie Buff 🍿';
    rankBadgeIcon = '🍿';
  } else if (finalScore >= 40) {
    rankBadge = 'Unpredictable Wildcard 🎲';
    rankBadgeIcon = '🎲';
  }

  return {
    finalScore,
    totalPenalty: Number(totalPenalty.toFixed(2)),
    maxPossiblePenalty: Number(maxPossiblePenalty.toFixed(2)),
    rankBadge,
    rankBadgeIcon,
    items
  };
}
