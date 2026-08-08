import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { CURATED_TMDB_MOVIES } from './src/data/mockMovies.js';
import { CURATED_IGDB_GAMES } from './src/data/mockGames.js';
import { LeaderboardEntry, Movie } from './src/types.js';

export const app = express();

app.use(express.json());

// Determine writable directory for leaderboard in serverless (e.g. Vercel) or container environments
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

// Initial seed data for global leaderboard
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    nickname: 'CinephileX',
    category: 'movies',
    score: 96,
    rankBadge: 'Cinema Psychic 🔮',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    blindRanking: [
      { position: 1, movieId: 27205, title: 'Inception', posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80' },
      { position: 2, movieId: 157336, title: 'Interstellar', posterPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80' },
      { position: 3, movieId: 155, title: 'The Dark Knight', posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
      { position: 4, movieId: 872585, title: 'Oppenheimer', posterPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80' },
      { position: 5, movieId: 238, title: 'The Godfather', posterPath: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80' },
      { position: 6, movieId: 680, title: 'Pulp Fiction', posterPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80' },
      { position: 7, movieId: 550, title: 'Fight Club', posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80' },
      { position: 8, movieId: 13, title: 'Forrest Gump', posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80' },
      { position: 9, movieId: 603, title: 'The Matrix', posterPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80' },
      { position: 10, movieId: 299536, title: 'Avengers: Infinity War', posterPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80' }
    ],
    officialRanking: [
      { position: 1, movieId: 27205, title: 'Inception', posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80' },
      { position: 2, movieId: 157336, title: 'Interstellar', posterPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80' },
      { position: 3, movieId: 155, title: 'The Dark Knight', posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
      { position: 4, movieId: 872585, title: 'Oppenheimer', posterPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80' },
      { position: 5, movieId: 238, title: 'The Godfather', posterPath: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80' },
      { position: 6, movieId: 680, title: 'Pulp Fiction', posterPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80' },
      { position: 7, movieId: 550, title: 'Fight Club', posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80' },
      { position: 8, movieId: 13, title: 'Forrest Gump', posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80' },
      { position: 9, movieId: 603, title: 'The Matrix', posterPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80' },
      { position: 10, movieId: 299536, title: 'Avengers: Infinity War', posterPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80' }
    ]
  },
  {
    id: 'seed-2',
    nickname: 'MovieNerd_99',
    category: 'movies',
    score: 91,
    rankBadge: 'Cinema Psychic 🔮',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    blindRanking: [
      { position: 1, movieId: 155, title: 'The Dark Knight', posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
      { position: 2, movieId: 27205, title: 'Inception', posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80' },
      { position: 3, movieId: 872585, title: 'Oppenheimer', posterPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80' },
      { position: 4, movieId: 157336, title: 'Interstellar', posterPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80' },
      { position: 5, movieId: 680, title: 'Pulp Fiction', posterPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80' },
      { position: 6, movieId: 238, title: 'The Godfather', posterPath: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80' },
      { position: 7, movieId: 13, title: 'Forrest Gump', posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80' },
      { position: 8, movieId: 550, title: 'Fight Club', posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80' },
      { position: 9, movieId: 603, title: 'The Matrix', posterPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80' },
      { position: 10, movieId: 299536, title: 'Avengers: Infinity War', posterPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80' }
    ],
    officialRanking: [
      { position: 1, movieId: 27205, title: 'Inception', posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80' },
      { position: 2, movieId: 155, title: 'The Dark Knight', posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
      { position: 3, movieId: 157336, title: 'Interstellar', posterPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80' },
      { position: 4, movieId: 872585, title: 'Oppenheimer', posterPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80' },
      { position: 5, movieId: 238, title: 'The Godfather', posterPath: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80' },
      { position: 6, movieId: 680, title: 'Pulp Fiction', posterPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80' },
      { position: 7, movieId: 550, title: 'Fight Club', posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80' },
      { position: 8, movieId: 13, title: 'Forrest Gump', posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80' },
      { position: 9, movieId: 603, title: 'The Matrix', posterPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80' },
      { position: 10, movieId: 299536, title: 'Avengers: Infinity War', posterPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80' }
    ]
  },
  {
    id: 'seed-3',
    nickname: 'DirectorCut',
    category: 'movies',
    score: 84,
    rankBadge: 'Master Film Critic 🎬',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    blindRanking: [
      { position: 1, movieId: 238, title: 'The Godfather', posterPath: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80' },
      { position: 2, movieId: 680, title: 'Pulp Fiction', posterPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80' },
      { position: 3, movieId: 27205, title: 'Inception', posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80' },
      { position: 4, movieId: 155, title: 'The Dark Knight', posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
      { position: 5, movieId: 157336, title: 'Interstellar', posterPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80' },
      { position: 6, movieId: 872585, title: 'Oppenheimer', posterPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80' },
      { position: 7, movieId: 550, title: 'Fight Club', posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80' },
      { position: 8, movieId: 13, title: 'Forrest Gump', posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80' },
      { position: 9, movieId: 603, title: 'The Matrix', posterPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80' },
      { position: 10, movieId: 299536, title: 'Avengers: Infinity War', posterPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80' }
    ],
    officialRanking: [
      { position: 1, movieId: 27205, title: 'Inception', posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80' },
      { position: 2, movieId: 157336, title: 'Interstellar', posterPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80' },
      { position: 3, movieId: 155, title: 'The Dark Knight', posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
      { position: 4, movieId: 238, title: 'The Godfather', posterPath: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80' },
      { position: 5, movieId: 680, title: 'Pulp Fiction', posterPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80' },
      { position: 6, movieId: 872585, title: 'Oppenheimer', posterPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80' },
      { position: 7, movieId: 550, title: 'Fight Club', posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80' },
      { position: 8, movieId: 13, title: 'Forrest Gump', posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80' },
      { position: 9, movieId: 603, title: 'The Matrix', posterPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80' },
      { position: 10, movieId: 299536, title: 'Avengers: Infinity War', posterPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80' }
    ]
  }
];

let inMemoryLeaderboard: LeaderboardEntry[] = [...INITIAL_LEADERBOARD];

function getLeaderboard(): LeaderboardEntry[] {
  try {
    if (fs.existsSync(LEADERBOARD_FILE)) {
      const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read leaderboard from file system, returning in-memory state');
  }
  return inMemoryLeaderboard;
}

function saveLeaderboard(entries: LeaderboardEntry[]): void {
  inMemoryLeaderboard = [...entries];
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write leaderboard to file system (serverless/read-only environment)');
  }
}

// Helper: Shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. Dynamic TMDB Movies API Endpoint
app.get('/api/movies', async (req, res) => {
  try {
    const count = Number(req.query.count) || 10;
    const customApiKey = (req.query.apiKey as string) || process.env.TMDB_API_KEY;

    if (customApiKey && customApiKey.trim().length > 5) {
      try {
        const page = Math.floor(Math.random() * 8) + 1;
        const tmdbRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${customApiKey.trim()}&include_adult=false&language=en-US&sort_by=popularity.desc&vote_count.gte=300&page=${page}`
        );

        if (tmdbRes.ok) {
          const data = await tmdbRes.json();
          if (data.results && Array.isArray(data.results) && data.results.length >= count) {
            const shuffled = shuffleArray(data.results).slice(0, count);
            const mappedMovies: Movie[] = shuffled.map((item: any) => ({
              id: item.id,
              title: item.title,
              originalTitle: item.original_title,
              releaseYear: item.release_date ? parseInt(item.release_date.substring(0, 4)) : 2023,
              posterPath: item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80',
              backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : undefined,
              overview: item.overview || 'A popular film featured in the movie database challenge.',
              voteAverage: Number(item.vote_average?.toFixed(1)) || 7.5,
              genres: ['Cinema', 'Popular']
            }));
            return res.json({ success: true, movies: mappedMovies, source: 'tmdb-api' });
          }
        }
      } catch (tmdbErr) {
        console.warn('TMDB API call failed, falling back to dynamic curated dataset:', tmdbErr);
      }
    }

    // Dynamic fallback to rich curated TMDB database
    const selected = shuffleArray(CURATED_TMDB_MOVIES).slice(0, count);
    res.json({ success: true, movies: selected, source: 'curated-tmdb' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch movies' });
  }
});

// 1.5. Dynamic IGDB Games API Endpoint
app.get('/api/games', async (req, res) => {
  try {
    const count = Number(req.query.count) || 10;
    const clientId = (req.query.clientId as string) || process.env.TWITCH_CLIENT_ID || process.env.IGDB_CLIENT_ID;
    const clientSecret = (req.query.clientSecret as string) || process.env.TWITCH_CLIENT_SECRET || process.env.IGDB_CLIENT_SECRET;

    if (clientId && clientSecret && clientId.trim().length > 3 && clientSecret.trim().length > 3) {
      try {
        // Step A: Fetch Twitch OAuth App Access Token
        const tokenRes = await fetch(
          `https://id.twitch.tv/oauth2/token?client_id=${clientId.trim()}&client_secret=${clientSecret.trim()}&grant_type=client_credentials`,
          { method: 'POST' }
        );

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const accessToken = tokenData.access_token;

          // Step B: Query IGDB v4 API for well known video games (rating >= 75, rating count >= 10)
          let igdbRes = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Client-ID': clientId.trim(),
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'text/plain'
            },
            body: `fields name, summary, rating, rating_count, total_rating_count, first_release_date, cover.url, genres.name; where rating >= 75 & rating_count >= 10 & cover != null; sort rating desc; limit 100;`
          });

          let gamesData = igdbRes.ok ? await igdbRes.json() : [];

          // If strict query returned fewer items, fallback to rating >= 75 with cover
          if (!Array.isArray(gamesData) || gamesData.length < count) {
            const fallbackRes = await fetch('https://api.igdb.com/v4/games', {
              method: 'POST',
              headers: {
                'Client-ID': clientId.trim(),
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'text/plain'
              },
              body: `fields name, summary, rating, first_release_date, cover.url, genres.name; where rating >= 75 & cover != null; sort rating desc; limit 100;`
            });
            if (fallbackRes.ok) {
              gamesData = await fallbackRes.json();
            }
          }

          if (Array.isArray(gamesData) && gamesData.length >= count) {
            const shuffled = shuffleArray(gamesData).slice(0, count);
            const mappedGames: Movie[] = shuffled.map((g: any) => {
              let posterUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80';
              if (g.cover && g.cover.url) {
                let rawUrl = g.cover.url;
                if (rawUrl.startsWith('//')) rawUrl = 'https:' + rawUrl;
                posterUrl = rawUrl.replace('t_thumb', 't_cover_big');
              }
              const releaseYear = g.first_release_date
                ? new Date(g.first_release_date * 1000).getFullYear()
                : 2022;

              return {
                id: g.id,
                title: g.name,
                originalTitle: g.name,
                releaseYear,
                posterPath: posterUrl,
                overview: g.summary || 'A legendary title in the video game database.',
                voteAverage: g.rating ? Number((g.rating / 10).toFixed(1)) : 9.0,
                genres: g.genres ? g.genres.map((gn: any) => gn.name) : ['Video Game']
              };
            });

            return res.json({ success: true, games: mappedGames, source: 'igdb-api' });
          }
        }
      } catch (igdbErr) {
        console.warn('IGDB API fetch failed, using curated video games dataset:', igdbErr);
      }
    }

    // Fallback to rich curated video games dataset
    const selected = shuffleArray(CURATED_IGDB_GAMES).slice(0, count);
    res.json({ success: true, games: selected, source: 'curated-igdb' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch games' });
  }
});

// 2. Leaderboard GET & POST
app.get('/api/leaderboard', (_req, res) => {
  const entries = getLeaderboard();
  entries.sort((a, b) => b.score - a.score);
  res.json({ success: true, leaderboard: entries });
});

app.post('/api/leaderboard', (req, res) => {
  try {
    const { nickname, category, score, rankBadge, blindRanking, officialRanking } = req.body || {};
    if (!nickname || score === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const currentLeaderboard = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      id: `rank-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      nickname: String(nickname).substring(0, 24),
      category: category || 'movies',
      score: Number(score),
      rankBadge: rankBadge || 'Movie Enthusiast 🎬',
      createdAt: new Date().toISOString(),
      blindRanking: blindRanking || [],
      officialRanking: officialRanking || []
    };

    currentLeaderboard.push(newEntry);
    currentLeaderboard.sort((a, b) => b.score - a.score);
    saveLeaderboard(currentLeaderboard);

    const rankPosition = currentLeaderboard.findIndex((item) => item.id === newEntry.id) + 1;

    res.json({
      success: true,
      entry: newEntry,
      rankPosition,
      totalEntries: currentLeaderboard.length,
      leaderboard: currentLeaderboard
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to record entry' });
  }
});

// 3. AI Commentary Endpoint using Gemini
app.post('/api/ai-commentary', async (req, res) => {
  const { nickname = 'Player', score = 80, items = [] } = req.body || {};
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        commentary: `Impressive run, ${nickname}! Scoring ${score}% shows a keen sense of cinematic intuition.`
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are a funny, witty film critic analyzing a player's "Blind Ranking vs Official Ranking" game results.
Player: ${nickname}
Score: ${score}%
Details: ${JSON.stringify(items.slice(0, 5))}

Provide a 2-sentence humorous, playful analysis of how their blind instincts matched up to their true rankings. Be entertaining and constructive!`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const commentary = response.text || `Fascinating ranking strategy, ${nickname}! Achieving ${score}% proves your instincts are sharp.`;
    res.json({ success: true, commentary });
  } catch (error) {
    res.json({
      success: true,
      commentary: `Great effort, ${nickname}! Scoring ${score}% shows strong movie knowledge and instincts.`
    });
  }
});
