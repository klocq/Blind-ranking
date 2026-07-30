export type Category = 'movies' | 'games' | 'music';

export type GamePhase = 'welcome' | 'blind' | 'official' | 'results' | 'leaderboard';

export interface Movie {
  id: number;
  title: string;
  originalTitle?: string;
  releaseYear: number;
  posterPath: string;
  backdropPath?: string;
  overview: string;
  voteAverage: number;
  genres: string[];
}

export interface BlindPlacement {
  position: number; // 1 to 10
  movie: Movie;
}

export interface OfficialPlacement {
  position: number; // 1 to 10
  movie: Movie;
}

export interface RankingComparisonItem {
  movie: Movie;
  blindRank: number;
  officialRank: number;
  difference: number;
  penalty: number;
}

export interface ScoreBreakdown {
  finalScore: number; // 0 - 100
  totalPenalty: number;
  maxPossiblePenalty: number;
  rankBadge: string;
  rankBadgeIcon: string;
  items: RankingComparisonItem[];
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  category: Category;
  score: number;
  rankBadge: string;
  createdAt: string;
  blindRanking: { position: number; movieId: number; title: string; posterPath: string }[];
  officialRanking: { position: number; movieId: number; title: string; posterPath: string }[];
}

export interface TMDBConfig {
  apiKey?: string;
  genreFilter?: string;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc';
}
