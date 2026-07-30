import React, { useState } from 'react';
import { X, Key, Check, Info, Server, RefreshCw } from 'lucide-react';

interface TMDBSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const TMDBSettingsModal: React.FC<TMDBSettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">TMDB API Settings</h2>
            <p className="text-xs text-zinc-400">The Movie Database (TMDB) Config</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Custom TMDB API Key (v3)
            </label>
            <input
              type="password"
              placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-zinc-400 mt-2 flex items-start gap-1.5 leading-normal">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Optional: If empty, the app seamlessly serves dynamically randomized real movies from the server's curated TMDB database.
              </span>
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Server Proxy status: <strong className="text-emerald-400 font-semibold">Active & Online</strong></span>
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
                <span>Save API Config</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
