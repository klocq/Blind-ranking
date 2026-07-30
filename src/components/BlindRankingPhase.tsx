import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie, BlindPlacement } from '../types';
import { Lock, Star, Sparkles, AlertCircle, Info, ChevronRight, RotateCcw } from 'lucide-react';

interface BlindRankingPhaseProps {
  movies: Movie[];
  nickname: string;
  onCompleteBlindRanking: (placements: BlindPlacement[]) => void;
  onRestart: () => void;
}

export const BlindRankingPhase: React.FC<BlindRankingPhaseProps> = ({
  movies,
  nickname,
  onCompleteBlindRanking,
  onRestart,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slots, setSlots] = useState<(Movie | null)[]>(Array(10).fill(null));
  const [showSynopsis, setShowSynopsis] = useState<boolean>(false);

  const currentMovie = movies[currentIndex];
  const isComplete = currentIndex >= 10;

  const handlePlaceMovie = (positionIndex: number) => {
    if (slots[positionIndex] !== null || isComplete) return;

    const updatedSlots = [...slots];
    updatedSlots[positionIndex] = currentMovie;
    setSlots(updatedSlots);

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    if (nextIndex >= 10) {
      // Build placement array (1-indexed)
      const placements: BlindPlacement[] = updatedSlots.map((m, idx) => ({
        position: idx + 1,
        movie: m!
      }));

      setTimeout(() => {
        onCompleteBlindRanking(placements);
      }, 600);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
            1
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Phase 1: Blind Ranking
              <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                No Changing Decisions
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Player: <span className="text-purple-300 font-semibold">{nickname}</span> — Place each movie in a slot #1 (Best) to #10 as it appears!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-xs text-zinc-400 block font-medium">Progress</span>
            <span className="text-sm font-extrabold text-white">
              {Math.min(currentIndex + 1, 10)} / 10
            </span>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden mb-8 border border-zinc-800">
        <div
          className="bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 h-full transition-all duration-300"
          style={{ width: `${(currentIndex / 10) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Active Current Movie Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isComplete && currentMovie ? (
              <motion.div
                key={currentMovie.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 rounded-3xl border border-purple-500/30 p-5 shadow-2xl shadow-purple-950/40 relative overflow-hidden group"
              >
                {/* Glowing subtle background effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

                {/* Movie Header / Poster */}
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden mb-4 shadow-lg border border-zinc-800 bg-zinc-950">
                  <img
                    src={currentMovie.posterPath}
                    alt={currentMovie.title}
                    className="w-[100%] h-[100%] object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
                    }}
                  />

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-500/40 flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      {currentMovie.voteAverage}
                    </span>
                  </div>

                  {/* Release Year Tag */}
                  <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-zinc-800 flex items-center gap-1 shadow-lg">
                    <span className="text-xs font-semibold text-zinc-300">
                      {currentMovie.releaseYear}
                    </span>
                  </div>
                </div>

                {/* Movie Details */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug mb-1">
                    {currentMovie.title}
                  </h3>
                  {currentMovie.originalTitle && currentMovie.originalTitle !== currentMovie.title && (
                    <p className="text-xs text-zinc-400 italic mb-2">
                      ({currentMovie.originalTitle})
                    </p>
                  )}

                  {/* Genres */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 my-2">
                    {currentMovie.genres.map((genre, gIdx) => (
                      <span
                        key={gIdx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Overview accordion toggle */}
                  <button
                    onClick={() => setShowSynopsis(!showSynopsis)}
                    className="mt-2 text-xs text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{showSynopsis ? 'Hide Overview' : 'Read Overview'}</span>
                  </button>

                  {showSynopsis && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-zinc-300 mt-2 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-left leading-relaxed max-h-32 overflow-y-auto"
                    >
                      {currentMovie.overview}
                    </motion.p>
                  )}
                </div>

                <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-500/30 text-center">
                  <p className="text-xs text-purple-200 font-semibold flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    Choose a position on the right!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="w-full max-w-sm bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 text-center">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-spin" />
                <h3 className="text-lg font-bold text-white mb-1">Blind Ranking Locked!</h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Preparing your official non-blind re-ranking step...
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: 10 Position Slots */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-900/40 p-4 sm:p-6 rounded-3xl border border-zinc-800/80 backdrop-blur-md">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Your Blind Board (#1 Best to #10)</span>
              <span className="text-xs text-purple-400 font-normal">
                Click empty slot to assign
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((assignedMovie, index) => {
                const rankNum = index + 1;
                const isOccupied = assignedMovie !== null;

                return (
                  <motion.button
                    key={index}
                    whileHover={!isOccupied && !isComplete ? { scale: 1.02 } : {}}
                    whileTap={!isOccupied && !isComplete ? { scale: 0.98 } : {}}
                    onClick={() => handlePlaceMovie(index)}
                    disabled={isOccupied || isComplete}
                    className={`relative flex items-center p-2.5 rounded-2xl border transition-all text-left overflow-hidden ${
                      isOccupied
                        ? 'bg-zinc-900/90 border-purple-500/40 shadow-lg'
                        : 'bg-zinc-950/70 border-dashed border-zinc-800 hover:border-purple-500/60 hover:bg-purple-950/20 cursor-pointer group'
                    }`}
                  >
                    {/* Position Number Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mr-3 border ${
                        rankNum === 1
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : rankNum === 2
                          ? 'bg-zinc-300/20 text-zinc-200 border-zinc-400/50'
                          : rankNum === 3
                          ? 'bg-amber-700/20 text-amber-400 border-amber-700/50'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      #{rankNum}
                    </div>

                    {/* Slot Content */}
                    {isOccupied && assignedMovie ? (
                      <div className="flex items-center gap-3 w-full overflow-hidden">
                        <img
                          src={assignedMovie.posterPath}
                          alt={assignedMovie.title}
                          className="w-10 h-14 object-cover rounded-lg shrink-0 border border-zinc-800"
                        />
                        <div className="truncate flex-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {assignedMovie.title}
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {assignedMovie.releaseYear} • ⭐ {assignedMovie.voteAverage}
                          </p>
                        </div>
                        <div className="p-1.5 rounded-lg bg-zinc-800 text-purple-400 border border-purple-500/20 shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-medium text-zinc-500 group-hover:text-purple-300 transition-colors">
                          Assign to Position #{rankNum}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-purple-400 transition-colors" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
