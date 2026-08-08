import React, { useState } from 'react';
import { X, Key, Check, Info, Server, Gamepad2, Film } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  igdbClientId?: string;
  igdbClientSecret?: string;
  onSaveIgdbConfig?: (clientId: string, clientSecret: string) => void;
}

export const TMDBSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  igdbClientId = '',
  igdbClientSecret = '',
  onSaveIgdbConfig
}) => {
  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [clientId, setClientId] = useState<string>(igdbClientId);
  const [clientSecret, setClientSecret] = useState<string>(igdbClientSecret);
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey);
    if (onSaveIgdbConfig) {
      onSaveIgdbConfig(clientId, clientSecret);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">API Settings</h2>
            <p className="text-xs text-zinc-400">Configure TMDB (Movies) & IGDB (Games)</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* TMDB Section */}
          <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Film className="w-4 h-4" />
              <span>TMDB Movies API (Optional)</span>
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                TMDB API Key (v3)
              </label>
              <input
                type="password"
                placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* IGDB Section */}
          <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Gamepad2 className="w-4 h-4" />
              <span>IGDB Video Games API (Twitch Developer Console)</span>
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Twitch Client ID
              </label>
              <input
                type="text"
                placeholder="e.g. kimne78kx3ncx6brgo4mv6wki5h1ko"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Twitch Client Secret
              </label>
              <input
                type="password"
                placeholder="e.g. 8x93hkw2..."
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-zinc-400 pt-1 flex items-start gap-1.5 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                If empty, the app serves dynamically randomized top video games from our curated dataset!
              </span>
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Backend API Proxy: <strong className="text-emerald-400 font-semibold">Ready & Active</strong></span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Config</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
