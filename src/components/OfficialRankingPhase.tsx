import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { Movie, BlindPlacement, OfficialPlacement } from '../types';
import { ArrowUp, ArrowDown, Sparkles, CheckCircle2, RotateCcw, GripVertical, AlertTriangle } from 'lucide-react';

interface OfficialRankingPhaseProps {
  blindPlacements: BlindPlacement[];
  nickname: string;
  onCompleteOfficialRanking: (officialPlacements: OfficialPlacement[]) => void;
  onRestart: () => void;
}

export const OfficialRankingPhase: React.FC<OfficialRankingPhaseProps> = ({
  blindPlacements,
  nickname,
  onCompleteOfficialRanking,
  onRestart,
}) => {
  // Initialize official list from the blind movies order (or sorted by movie id)
  const [orderedMovies, setOrderedMovies] = useState<Movie[]>(
    blindPlacements.map((bp) => bp.movie)
  );

  // Map to easily lookup blind position for each movie
  const blindMap = new Map<number, number>();
  blindPlacements.forEach((bp) => {
    blindMap.set(bp.movie.id, bp.position);
  });

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...orderedMovies];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setOrderedMovies(updated);
  };

  const moveDown = (index: number) => {
    if (index >= orderedMovies.length - 1) return;
    const updated = [...orderedMovies];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setOrderedMovies(updated);
  };

  const handleSubmit = () => {
    const officialPlacements: OfficialPlacement[] = orderedMovies.map((movie, idx) => ({
      position: idx + 1,
      movie
    }));
    onCompleteOfficialRanking(officialPlacements);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
            2
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Phase 2: Official Ranking
              <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Organize Your Real Top 10
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Drag or use ▲ ▼ buttons to reorder these 10 movies into your true personal preference!
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>Restart Game</span>
        </button>
      </div>

      {/* Interactive Reordering List */}
      <div className="bg-zinc-900/40 p-4 sm:p-6 rounded-3xl border border-zinc-800/80 backdrop-blur-md mb-8">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-4 px-2">
          <span>Official Position</span>
          <span>Movie Title & Details</span>
          <span className="hidden sm:inline">Blind Rank vs Official</span>
          <span>Controls</span>
        </div>

        <Reorder.Group
          axis="y"
          values={orderedMovies}
          onReorder={setOrderedMovies}
          className="space-y-3"
        >
          {orderedMovies.map((movie, index) => {
            const officialRank = index + 1;
            const blindRank = blindMap.get(movie.id) || 10;
            const diff = Math.abs(blindRank - officialRank);

            return (
              <Reorder.Item
                key={movie.id}
                value={movie}
                className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3 sm:gap-4 hover:border-indigo-500/40 transition-colors shadow-lg group"
              >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 p-1">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Official Rank Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                    officialRank === 1
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : officialRank === 2
                      ? 'bg-zinc-300/20 text-zinc-200 border-zinc-400/50'
                      : officialRank === 3
                      ? 'bg-amber-700/20 text-amber-400 border-amber-700/50'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  #{officialRank}
                </div>

                {/* Movie Image Thumbnail */}
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded-xl shrink-0 border border-zinc-800 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
                  }}
                />

                {/* Title & Metadata */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {movie.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium">
                    {movie.releaseYear} • ⭐ {movie.voteAverage}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 sm:hidden">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                      Blind: #{blindRank}
                    </span>
                    {diff > 0 && (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Δ {diff} {diff > 3 ? '⚠️' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Blind Badge on desktop */}
                <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    Blind: #{blindRank}
                  </span>
                  {diff === 0 ? (
                    <span className="text-[11px] text-emerald-400 font-medium mt-1">
                      Perfect Match ✨
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-medium mt-1">
                      Discrepancy: <span className="text-amber-400 font-bold">{diff} positions</span>
                    </span>
                  )}
                </div>

                {/* Quick Up/Down Controls */}
                <div className="flex flex-col gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded-lg bg-zinc-800 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === orderedMovies.length - 1}
                    className="p-1 rounded-lg bg-zinc-800 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      {/* Lock In Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-base shadow-xl shadow-purple-950/50 flex items-center justify-center gap-3 mx-auto hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>Lock In Official Ranking & Calculate Score</span>
        </button>
        <p className="text-xs text-zinc-500 mt-2">
          Your blind list will be mathematically compared against this official list.
        </p>
      </div>
    </div>
  );
};
