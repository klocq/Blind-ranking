import React from 'react';
import { Film, Gamepad2, Music, Trophy, Settings, HelpCircle, Flame } from 'lucide-react';
import { Category, GamePhase } from '../types';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  currentPhase: GamePhase;
  onNavigateLeaderboard: () => void;
  onNavigateHome: () => void;
  onOpenSettings: () => void;
  onOpenDevGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  currentPhase,
  onNavigateLeaderboard,
  onNavigateHome,
  onOpenSettings,
  onOpenDevGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-purple-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-purple-400 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                BlindRank
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block font-medium">
              Blind vs. Official Ranking Challenge
            </p>
          </div>
        </button>

        {/* Category Switcher */}
        <nav className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800/80 shadow-inner">
          <button
            onClick={() => onSelectCategory('movies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'movies'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>

          <button
            onClick={() => onSelectCategory('games')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeCategory === 'games'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Games</span>
            <span className="text-[9px] px-1 bg-zinc-800 text-purple-300 rounded font-medium border border-purple-500/30">
              Soon
            </span>
          </button>

          <button
            onClick={() => onSelectCategory('music')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeCategory === 'music'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Music</span>
            <span className="text-[9px] px-1 bg-zinc-800 text-indigo-300 rounded font-medium border border-indigo-500/30">
              Soon
            </span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateLeaderboard}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              currentPhase === 'leaderboard'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-950/30'
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-amber-500/40 hover:text-amber-300'
            }`}
            title="Global Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Leaderboard</span>
          </button>

          <button
            onClick={onOpenDevGuide}
            className="p-2 rounded-xl bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white hover:border-purple-500/40 transition-colors"
            title="Deployment & Setup Guide"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white hover:border-indigo-500/40 transition-colors"
            title="TMDB API Settings"
          >
            <Settings className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
