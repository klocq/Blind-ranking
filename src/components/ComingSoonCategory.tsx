import React, { useState } from 'react';
import { Gamepad2, Music, Sparkles, Bell, Check, Film } from 'lucide-react';
import { Category } from '../types';

interface ComingSoonCategoryProps {
  category: Category;
  onSwitchToMovies: () => void;
}

export const ComingSoonCategory: React.FC<ComingSoonCategoryProps> = ({
  category,
  onSwitchToMovies,
}) => {
  const [notified, setNotified] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const isGames = category === 'games';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNotified(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-2xl shadow-purple-950/60 mx-auto">
          <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
            {isGames ? (
              <Gamepad2 className="w-10 h-10 text-purple-400" />
            ) : (
              <Music className="w-10 h-10 text-indigo-400" />
            )}
          </div>
        </div>
        <span className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
          Coming Soon
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        {isGames ? 'Video Games Blind Ranking' : 'Music & Albums Blind Ranking'}
      </h1>

      <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed mb-8">
        {isGames
          ? 'Get ready to test your gaming intuition! Blindly rank 10 legendary video game titles from Steam and IGDB, then build your official personal top 10 list.'
          : 'Prepare your ears! Rank top Billboard hits and iconic album covers blindly, followed by your official non-blind list to see if your music taste is consistent.'}
      </p>

      {/* Feature Teasers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-xl mx-auto">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
          <Sparkles className="w-5 h-5 text-amber-400 mb-2" />
          <h3 className="text-xs font-bold text-white mb-1">Dynamic Database</h3>
          <p className="text-[11px] text-zinc-400">
            {isGames ? 'IGDB & RAWG Game API' : 'Spotify & Last.fm API'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
          <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
          <h3 className="text-xs font-bold text-white mb-1">Global Bragging</h3>
          <p className="text-[11px] text-zinc-400">
            Cross-category leaderboard rankings
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
          <Sparkles className="w-5 h-5 text-indigo-400 mb-2" />
          <h3 className="text-xs font-bold text-white mb-1">AI Insights</h3>
          <p className="text-[11px] text-zinc-400">
            Custom critic feedback on your taste
          </p>
        </div>
      </div>

      {/* Notify Form */}
      <div className="max-w-md mx-auto bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 backdrop-blur-md mb-8">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
          <Bell className="w-4 h-4 text-amber-400" />
          Get Notified When {isGames ? 'Games' : 'Music'} Launches
        </h3>

        {notified ? (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>You're on the early access list! We'll notify you.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>

      {/* Switch back button */}
      <button
        onClick={onSwitchToMovies}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-extrabold text-xs shadow-xl hover:scale-105 transition-transform"
      >
        <Film className="w-4 h-4" />
        <span>Play the Movies Challenge Now</span>
      </button>
    </div>
  );
};
