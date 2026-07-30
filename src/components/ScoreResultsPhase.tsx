import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { ScoreBreakdown, BlindPlacement, OfficialPlacement } from '../types';
import { Trophy, Sparkles, RefreshCw, Share2, Bot, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScoreResultsPhaseProps {
  scoreBreakdown: ScoreBreakdown;
  nickname: string;
  blindPlacements: BlindPlacement[];
  officialPlacements: OfficialPlacement[];
  onSubmitToLeaderboard: (nickname: string) => void;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export const ScoreResultsPhase: React.FC<ScoreResultsPhaseProps> = ({
  scoreBreakdown,
  nickname,
  blindPlacements,
  officialPlacements,
  onSubmitToLeaderboard,
  onPlayAgain,
  onViewLeaderboard,
}) => {
  const [aiCommentary, setAiCommentary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Trigger celebratory confetti if high score
    if (scoreBreakdown.finalScore >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Fetch AI commentary from express server endpoint
    fetchAiCommentary();
  }, []);

  const fetchAiCommentary = async () => {
    try {
      setLoadingAi(true);
      const res = await fetch('/api/ai-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          score: scoreBreakdown.finalScore,
          items: scoreBreakdown.items
        })
      });

      const data = await res.json();
      if (data.success && data.commentary) {
        setAiCommentary(data.commentary);
      } else {
        setAiCommentary(`Incredible effort! Your instincts resulted in a ${scoreBreakdown.finalScore}% accuracy rating.`);
      }
    } catch (err) {
      setAiCommentary(`Great job! Your blind ranking scored ${scoreBreakdown.finalScore}% match.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLeaderboardSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    onSubmitToLeaderboard(nickname);
  };

  const handleShareScore = () => {
    const text = `🎬 Blind Ranking Challenge Score: ${scoreBreakdown.finalScore}% (${scoreBreakdown.rankBadge})\nCan you beat my intuition? Play now on BlindRank!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* SCORE HERO BANNER */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-8 rounded-3xl border border-purple-500/40 text-center shadow-2xl shadow-purple-950/50 mb-8 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Challenge Completed for {nickname}</span>
        </div>

        <div className="flex flex-col items-center justify-center my-2">
          <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-200 to-amber-300 tracking-tight">
            {scoreBreakdown.finalScore}%
          </span>
          <p className="text-sm text-zinc-400 mt-1 font-medium">
            Match Accuracy Score
          </p>
        </div>

        <div className="inline-block mt-3 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-sm sm:text-base shadow-lg">
          {scoreBreakdown.rankBadgeIcon} {scoreBreakdown.rankBadge}
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={handleLeaderboardSubmit}
            disabled={submitted}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              submitted
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-950/30'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{submitted ? 'Submitted to Leaderboard ✓' : 'Submit Score to Global Leaderboard'}</span>
          </button>

          <button
            onClick={handleShareScore}
            className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold border border-zinc-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>{copied ? 'Copied to Clipboard! 📋' : 'Share Result'}</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold border border-purple-400 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </motion.div>

      {/* AI MOVIE CRITIC COMMENTARY */}
      <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 mb-8 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>AI Film Critic Assessment</span>
        </div>
        {loadingAi ? (
          <div className="flex items-center gap-2 text-xs text-zinc-400 py-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Analyzing your cinema intuition...</span>
          </div>
        ) : (
          <p className="text-sm text-zinc-200 italic leading-relaxed">
            "{aiCommentary}"
          </p>
        )}
      </div>

      {/* DETAILED COMPARISON MATRIX */}
      <div className="bg-zinc-900/40 p-4 sm:p-6 rounded-3xl border border-zinc-800/80 backdrop-blur-md mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Ranking Comparison Breakdown
            </h3>
            <p className="text-xs text-zinc-400">
              Side-by-side view of your Blind placements vs Official placements
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
            10 Items
          </span>
        </div>

        {/* Table / List View */}
        <div className="space-y-3">
          {scoreBreakdown.items.map((item) => {
            const isMatch = item.difference === 0;

            return (
              <div
                key={item.movie.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isMatch
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : item.difference > 3
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-zinc-950/80 border-zinc-800'
                }`}
              >
                {/* Movie Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.movie.posterPath}
                    alt={item.movie.title}
                    className="w-10 h-14 object-cover rounded-lg shrink-0 border border-zinc-800 shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {item.movie.title}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium">
                      {item.movie.releaseYear} • ⭐ {item.movie.voteAverage}
                    </p>
                  </div>
                </div>

                {/* Ranks & Discrepancy */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">
                        Blind
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                        #{item.blindRank}
                      </span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />

                    <div className="text-center">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">
                        Official
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        #{item.officialRank}
                      </span>
                    </div>
                  </div>

                  {/* Discrepancy Penalty Badge */}
                  <div className="text-right pl-2">
                    {isMatch ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Exact Match
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        Δ {item.difference} pos (-{item.penalty} penalty)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPlayAgain}
          className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Play Another Round</span>
        </button>

        <button
          onClick={onViewLeaderboard}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>View Global Leaderboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
