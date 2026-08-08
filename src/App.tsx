import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BlindRankingPhase } from './components/BlindRankingPhase';
import { OfficialRankingPhase } from './components/OfficialRankingPhase';
import { ScoreResultsPhase } from './components/ScoreResultsPhase';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { ComingSoonCategory } from './components/ComingSoonCategory';
import { TMDBSettingsModal } from './components/TMDBSettingsModal';
import { DeveloperGuideModal } from './components/DeveloperGuideModal';

import { Category, GamePhase, Movie, BlindPlacement, OfficialPlacement, ScoreBreakdown } from './types';
import { calculateScoreBreakdown } from './utils/scoring';
import { Sparkles, Film, Play, Trophy, Dices, Shield, ArrowRight, Star } from 'lucide-react';

const RANDOM_NICKNAMES = [
  'Cinephile99', 'FilmBuff_X', 'PopcornMaster', 'ReelLover',
  'ScreenPhantom', 'CinemaWizard', 'DirectorCut', 'MovieGeek'
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('movies');
  const [gamePhase, setGamePhase] = useState<GamePhase>('welcome');
  
  const [nickname, setNickname] = useState<string>('Cinephile99');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(false);

  const [blindPlacements, setBlindPlacements] = useState<BlindPlacement[]>([]);
  const [officialPlacements, setOfficialPlacements] = useState<OfficialPlacement[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDevGuideOpen, setIsDevGuideOpen] = useState<boolean>(false);
  const [tmdbApiKey, setTmdbApiKey] = useState<string>('');
  const [igdbClientId, setIgdbClientId] = useState<string>('b5nv3312oi5aqv3nhmvbzjvfm7eqee');
  const [igdbClientSecret, setIgdbClientSecret] = useState<string>('3r549ce0668vcp37ywyd9xq230e3p3');

  const generateRandomNickname = () => {
    const random = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    setNickname(`${random}_${num}`);
  };

  const handleStartGame = async () => {
    try {
      setLoadingMovies(true);
      
      let url = '/api/movies?count=10';
      if (activeCategory === 'movies') {
        url = tmdbApiKey
          ? `/api/movies?count=10&apiKey=${encodeURIComponent(tmdbApiKey)}`
          : '/api/movies?count=10';
      } else if (activeCategory === 'games') {
        url = igdbClientId && igdbClientSecret
          ? `/api/games?count=10&clientId=${encodeURIComponent(igdbClientId)}&clientSecret=${encodeURIComponent(igdbClientSecret)}`
          : '/api/games?count=10';
      }

      const res = await fetch(url);
      const data = await res.json();

      const items = data.movies || data.games || [];

      if (data.success && Array.isArray(items) && items.length > 0) {
        setMovies(items);
      } else {
        console.warn('API response missing items, using fallback');
      }

      setBlindPlacements([]);
      setOfficialPlacements([]);
      setScoreBreakdown(null);
      setGamePhase('blind');
    } catch (err) {
      console.error('Error starting game:', err);
      setGamePhase('blind');
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleCompleteBlind = (placements: BlindPlacement[]) => {
    setBlindPlacements(placements);
    setGamePhase('official');
  };

  const handleCompleteOfficial = (official: OfficialPlacement[]) => {
    setOfficialPlacements(official);
    const result = calculateScoreBreakdown(blindPlacements, official);
    setScoreBreakdown(result);
    setGamePhase('results');
  };

  const handleSubmitToLeaderboard = async (userNick: string) => {
    if (!scoreBreakdown) return;
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: userNick || nickname,
          category: activeCategory,
          score: scoreBreakdown.finalScore,
          rankBadge: scoreBreakdown.rankBadge,
          blindRanking: blindPlacements.map((bp) => ({
            position: bp.position,
            movieId: bp.movie.id,
            title: bp.movie.title,
            posterPath: bp.movie.posterPath
          })),
          officialRanking: officialPlacements.map((op) => ({
            position: op.position,
            movieId: op.movie.id,
            title: op.movie.title,
            posterPath: op.movie.posterPath
          }))
        })
      });
      setGamePhase('leaderboard');
    } catch (err) {
      console.error('Failed to submit leaderboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white antialiased">
      {/* HEADER */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setGamePhase('welcome');
        }}
        currentPhase={gamePhase}
        onNavigateLeaderboard={() => setGamePhase('leaderboard')}
        onNavigateHome={() => setGamePhase('welcome')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDevGuide={() => setIsDevGuideOpen(true)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {activeCategory === 'music' ? (
          <ComingSoonCategory
            category={activeCategory}
            onSwitchToMovies={() => {
              setActiveCategory('movies');
              setGamePhase('welcome');
            }}
          />
        ) : (
          <>
            {/* GAME PHASE: WELCOME */}
            {gamePhase === 'welcome' && (
              <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                {/* Hero Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-6 shadow-inner">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    Interactive Intuition Challenge • {activeCategory === 'games' ? 'Powered by IGDB API' : 'Powered by TMDB API'}
                  </span>
                </div>

                {/* Hero Headline */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
                  Rank <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-200 to-amber-300">
                    10 {activeCategory === 'games' ? 'Video Games' : 'Movies'}
                  </span> Blindly.
                  <br />
                  Compare Your True Instincts.
                </h1>

                <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
                  Test your {activeCategory === 'games' ? 'gaming' : 'cinematic'} judgement! In <strong>Phase 1</strong>, assign 10 random {activeCategory === 'games' ? 'video games' : 'movies'} to positions #1 to #10 as they appear one-by-one. In <strong>Phase 2</strong>, organize your official non-blind list to discover your accuracy score.
                </p>

                {/* Nickname Input & Start Card */}
                <div className="max-w-md mx-auto bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 backdrop-blur-md shadow-2xl mb-12">
                  <div className="text-left mb-4">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Enter Player Nickname
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g. Cinephile99"
                        maxLength={24}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <button
                        onClick={generateRandomNickname}
                        type="button"
                        className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                        title="Randomize Nickname"
                      >
                        <Dices className="w-5 h-5 text-amber-400" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleStartGame}
                    disabled={loadingMovies}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-base shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMovies ? (
                      <>
                        <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
                        <span>Fetching {activeCategory === 'games' ? 'Video Games' : 'Movies'}...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-white" />
                        <span>Start {activeCategory === 'games' ? 'Games' : 'Movie'} Challenge</span>
                      </>
                    )}
                  </button>
                </div>

                {/* How It Works Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs mb-3 border border-purple-500/20">
                      1
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">1. Blind Phase</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      10 movies pop up one-by-one. Lock each in a permanent rank #1 to #10 before seeing the rest.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3 border border-indigo-500/20">
                      2
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">2. Official Phase</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Organize all 10 movies into your true personal preference list with smooth touch drag controls.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs mb-3 border border-amber-500/20">
                      3
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">3. Score & Board</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Get your weighted discrepancy score %, view AI critic analysis, and rank on the global leaderboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* GAME PHASE: BLIND RANKING */}
            {gamePhase === 'blind' && (
              <BlindRankingPhase
                movies={movies}
                nickname={nickname}
                onCompleteBlindRanking={handleCompleteBlind}
                onRestart={() => setGamePhase('welcome')}
              />
            )}

            {/* GAME PHASE: OFFICIAL RANKING */}
            {gamePhase === 'official' && (
              <OfficialRankingPhase
                blindPlacements={blindPlacements}
                nickname={nickname}
                onCompleteOfficialRanking={handleCompleteOfficial}
                onRestart={() => setGamePhase('welcome')}
              />
            )}

            {/* GAME PHASE: RESULTS */}
            {gamePhase === 'results' && scoreBreakdown && (
              <ScoreResultsPhase
                scoreBreakdown={scoreBreakdown}
                nickname={nickname}
                blindPlacements={blindPlacements}
                officialPlacements={officialPlacements}
                onSubmitToLeaderboard={handleSubmitToLeaderboard}
                onPlayAgain={handleStartGame}
                onViewLeaderboard={() => setGamePhase('leaderboard')}
              />
            )}

            {/* GAME PHASE: LEADERBOARD */}
            {gamePhase === 'leaderboard' && (
              <GlobalLeaderboard
                activeCategory={activeCategory}
                onPlayNewGame={handleStartGame}
                onBackHome={() => setGamePhase('welcome')}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1">
            <span>BlindRank Challenge</span> • <span>Powered by TMDB API & Gemini AI</span>
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setIsDevGuideOpen(true)}
              className="hover:text-purple-300 transition-colors"
            >
              Setup & Deployment Guide
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-indigo-300 transition-colors"
            >
              TMDB Settings
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <TMDBSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={tmdbApiKey}
        onSaveApiKey={(key) => setTmdbApiKey(key)}
        igdbClientId={igdbClientId}
        igdbClientSecret={igdbClientSecret}
        onSaveIgdbConfig={(cid, sec) => {
          setIgdbClientId(cid);
          setIgdbClientSecret(sec);
        }}
      />

      <DeveloperGuideModal
        isOpen={isDevGuideOpen}
        onClose={() => setIsDevGuideOpen(false)}
      />
    </div>
  );
}
