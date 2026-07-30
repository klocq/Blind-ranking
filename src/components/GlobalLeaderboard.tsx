import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeaderboardEntry, Category } from '../types';
import { Trophy, Medal, Crown, Sparkles, ChevronDown, ChevronUp, ArrowLeft, RefreshCw, Film } from 'lucide-react';

interface GlobalLeaderboardProps {
  activeCategory: Category;
  onPlayNewGame: () => void;
  onBackHome: () => void;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  activeCategory,
  onPlayNewGame,
  onBackHome,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        setEntries(data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(
    (e) => !e.category || e.category === activeCategory
  );

  const toggleExpand = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-950/40">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Global Leaderboard
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                {activeCategory}
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Top scores worldwide. Expand the top 3 entries to view their side-by-side rankings!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeaderboard}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
            title="Refresh Leaderboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onPlayNewGame}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 transition-all"
          >
            Start New Game
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-400 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-spin mb-2" />
          <p className="text-xs font-medium">Loading top rankings...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-12 text-center text-zinc-400 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <Film className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Scores Recorded Yet</h3>
          <p className="text-xs text-zinc-400 mb-4">
            Be the first player to complete a blind ranking in this category!
          </p>
          <button
            onClick={onPlayNewGame}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
          >
            Play Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isExpanded = expandedEntryId === entry.id;

            return (
              <div
                key={entry.id}
                className={`bg-zinc-900/60 rounded-3xl border transition-all overflow-hidden ${
                  rank === 1
                    ? 'border-amber-500/50 shadow-xl shadow-amber-950/20'
                    : rank === 2
                    ? 'border-zinc-400/40 shadow-lg'
                    : rank === 3
                    ? 'border-amber-700/40'
                    : 'border-zinc-800/80'
                }`}
              >
                {/* Main Player Row */}
                <div
                  onClick={() => toggleExpand(entry.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank Number Badge */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                        rank === 1
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : rank === 2
                          ? 'bg-zinc-300/20 text-zinc-200 border-zinc-400/50'
                          : rank === 3
                          ? 'bg-amber-700/20 text-amber-400 border-amber-700/50'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {rank === 1 ? (
                        <Crown className="w-5 h-5 text-amber-400" />
                      ) : rank === 2 ? (
                        <Medal className="w-5 h-5 text-zinc-300" />
                      ) : rank === 3 ? (
                        <Medal className="w-5 h-5 text-amber-600" />
                      ) : (
                        `#${rank}`
                      )}
                    </div>

                    {/* Nickname & Badge */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {entry.nickname}
                        </h3>
                        {isTop3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30 uppercase">
                            TOP {rank}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">
                        {entry.rankBadge || 'Film Buff'} • {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Score & Accordion Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-amber-300">
                        {entry.score}%
                      </span>
                      <span className="text-[10px] text-zinc-500 block font-semibold uppercase">
                        Accuracy
                      </span>
                    </div>

                    <div className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* SIDE-BY-SIDE EXPANDABLE RANKING BREAKDOWN (Prominently required for Top 3) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-zinc-800 bg-zinc-950/80 p-4 sm:p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          Side-by-Side Ranking Comparison for {entry.nickname}
                        </h4>
                        <span className="text-[11px] text-zinc-400">
                          Blind vs Official Top 10
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* LEFT COLUMN: Blind Rankings */}
                        <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-purple-500/30">
                          <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 pb-2 border-b border-purple-500/20 flex items-center justify-between">
                            <span>Blind Ranking (In Intuition Order)</span>
                            <span className="text-[10px] text-purple-400">Phase 1</span>
                          </h5>
                          <div className="space-y-2">
                            {entry.blindRanking && entry.blindRanking.length > 0 ? (
                              entry.blindRanking.map((item) => (
                                <div
                                  key={item.position}
                                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-zinc-950 border border-zinc-800"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-purple-400 w-5">
                                      #{item.position}
                                    </span>
                                    <span className="font-semibold text-white truncate max-w-[180px]">
                                      {item.title}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-zinc-500 italic">No blind data recorded</p>
                            )}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Official Rankings */}
                        <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-indigo-500/30">
                          <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 pb-2 border-b border-indigo-500/20 flex items-center justify-between">
                            <span>Official Ranking (True Personal Top 10)</span>
                            <span className="text-[10px] text-indigo-400">Phase 2</span>
                          </h5>
                          <div className="space-y-2">
                            {entry.officialRanking && entry.officialRanking.length > 0 ? (
                              entry.officialRanking.map((item) => (
                                <div
                                  key={item.position}
                                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-zinc-950 border border-zinc-800"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-indigo-400 w-5">
                                      #{item.position}
                                    </span>
                                    <span className="font-semibold text-white truncate max-w-[180px]">
                                      {item.title}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-zinc-500 italic">No official data recorded</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onBackHome}
          className="text-xs font-bold text-zinc-400 hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Game Home</span>
        </button>
      </div>
    </div>
  );
};
