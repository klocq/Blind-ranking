import React, { useState } from 'react';
import { X, Terminal, GitBranch, CloudUpload, Code, Copy, Check, ExternalLink } from 'lucide-react';

interface DeveloperGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperGuideModal: React.FC<DeveloperGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Developer & Deployment Guide
            </h2>
            <p className="text-xs text-zinc-400">
              Local Dev, Git Commands on Windows, VS Code & Vercel Deployment
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-zinc-300">
          {/* STEP 1 */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                1. Local Development Setup
              </h3>
              <button
                onClick={() => copyCode('npm install\nnpm run dev', 'step1')}
                className="p-1 text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-zinc-400 mb-2 leading-relaxed">
              Clone the workspace or export ZIP. Open command prompt or PowerShell in the root folder:
            </p>
            <pre className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-amber-300 font-mono text-[11px]">
              npm install{"\n"}npm run dev
            </pre>
            <p className="text-zinc-500 text-[11px] mt-2">
              Runs Express backend + Vite frontend together on http://localhost:3000
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                2. Initialize Git Repository on Windows
              </h3>
              <button
                onClick={() => copyCode('git init\ngit add .\ngit commit -m "Initial commit: Blind Ranking Challenge App"', 'step2')}
                className="p-1 text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-zinc-400 mb-2 leading-relaxed">
              In Windows Command Prompt / PowerShell inside your project folder:
            </p>
            <pre className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-indigo-300 font-mono text-[11px]">
              git init{"\n"}git add .{"\n"}git commit -m "Initial commit: Blind Ranking Challenge App"
            </pre>
            <p className="text-zinc-500 text-[11px] mt-2">
              Create a new repository on GitHub and link remote: <code className="text-zinc-300">git remote add origin https://github.com/your-username/blind-ranking.git</code> followed by <code className="text-zinc-300">git push -u origin main</code>.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
              <Code className="w-4 h-4" />
              3. Committing via VS Code Interface
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 leading-relaxed">
              <li>Open project folder in <strong>VS Code</strong>.</li>
              <li>Click the <strong>Source Control</strong> tab on the left sidebar (<code className="text-zinc-200">Ctrl+Shift+G</code>).</li>
              <li>Hover over <em>Changes</em> and click the <strong>+</strong> button to Stage All Changes.</li>
              <li>Type your commit message in the message box (e.g. <em>"Feature: Blind vs Official ranking comparison engine"</em>).</li>
              <li>Click <strong>Commit</strong>, then click <strong>Sync Changes / Push</strong> to push to GitHub.</li>
            </ol>
          </div>

          {/* STEP 4 */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2 mb-2">
              <CloudUpload className="w-4 h-4" />
              4. Deploy Live on Vercel
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 leading-relaxed">
              <li>Sign in to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Vercel.com</a> with your GitHub account.</li>
              <li>Click <strong>Add New Project</strong> and import your GitHub repository.</li>
              <li>In Environment Variables, add <code className="text-zinc-200">TMDB_API_KEY</code> and <code className="text-zinc-200">GEMINI_API_KEY</code> (optional).</li>
              <li>Click <strong>Deploy</strong>. Vercel automatically builds and provides a live HTTPS URL!</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
