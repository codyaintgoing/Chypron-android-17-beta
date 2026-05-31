import { useState, FormEvent } from 'react';
import { MusicData, matchesPitchClass } from './types';
import { Piano } from './components/Piano';
import { Guitar } from './components/Guitar';
import { SpencerChat } from './components/SpencerChat';
import { NetworkHub } from './components/NetworkHub';
import { Music, Loader2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COMMON_ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const BUILDER_TYPES = ['Major Triad', 'Minor Triad', 'Dominant 7th', 'Major 7th', 'Minor 7th', 'Major Scale', 'Minor Pentatonic'];

export default function App() {
  const [query, setQuery] = useState('C Major scale');
  const [data, setData] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [builderRoot, setBuilderRoot] = useState('C');
  const [builderType, setBuilderType] = useState('Major Triad');
  const [copied, setCopied] = useState(false);

  const handleCopyNotes = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.notes.join(' - '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeAnalysis = async (q: string) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/music-theory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      if (!res.ok) throw new Error('Failed to analyze request');
      const musicData = await res.json();
      setData(musicData);
    } catch (err) {
      setError('Analysis anomaly detected. Retrying sequence...');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeAnalysis(query);
  };

  const handleBuildChord = () => {
    const combinedQuery = `${builderRoot} ${builderType}`;
    setQuery(combinedQuery);
    executeAnalysis(combinedQuery);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050117] text-[#E2D9FF] font-sans overflow-hidden">
      {/* Top Navigation / Status Bar */}
      <div className="h-14 border-b border-[#3B1B8A] flex items-center justify-between px-6 bg-[#02000A] shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-[#00F0FF] neon-text-cyan font-black tracking-tighter text-xl uppercase">Android 17 Chypron</span>
            <span className="text-[8px] text-[#A233FF] font-mono font-bold tracking-widest">JARVIS-INTELLECT "BETA" // BY: CLIFTON CODY EDGAR</span>
          </div>
          <div className="h-6 w-px bg-[#3B1B8A] mx-2"></div>
          <div className="flex flex-col space-y-1 text-[9px] font-mono uppercase tracking-widest text-[#5D4B8B] hidden sm:flex">
            <span className="text-[#E2D9FF]">Engine: Connected</span>
            <span>Apex7 Monetizer: Active</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-1 hidden sm:flex">
            <div className={`w-2 h-2 ${loading ? 'bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]' : 'bg-[#00F0FF]'} rounded-full`}></div>
            <div className="w-2 h-2 bg-[#3B1B8A] rounded-full"></div>
            <div className="w-2 h-2 bg-[#A233FF] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-px bg-[#3B1B8A]/30 overflow-hidden">
        
        {/* Left Sidebar: Controls & Comm */}
        <div className="md:col-span-3 bg-[#11012C] flex flex-col p-4 space-y-4 overflow-y-auto w-full">
          
          <section className="bg-[#02000A] p-4 rounded-lg border border-[#3B1B8A]">
             <h3 className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-widest mb-3">Analyzer Terminal</h3>
             <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
               <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., F#m9 or Progression I V vi IV"
                  className="w-full bg-[#11012C] border border-[#3B1B8A] px-3 py-2 text-xs text-[#E2D9FF] focus:outline-none focus:border-[#00F0FF] font-mono shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
               />
               <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-full px-4 py-2 bg-[#3B1B8A] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black hover:shadow-[0_0_15px_#00F0FF] text-xs font-bold uppercase rounded-sm flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Sequence'}
               </button>
             </form>
          </section>

          <section className="bg-[#02000A] p-4 rounded-lg border border-[#3B1B8A]">
             <h3 className="text-[10px] font-bold text-[#A233FF] uppercase tracking-widest mb-3">Builder Engine</h3>
             <div className="flex flex-col space-y-3">
                <div className="flex space-x-2">
                    <select 
                        value={builderRoot} 
                        onChange={(e) => setBuilderRoot(e.target.value)}
                        className="w-1/3 bg-[#11012C] border border-[#3B1B8A] p-2 text-xs text-[#E2D9FF] focus:outline-none focus:border-[#A233FF]"
                    >
                        {COMMON_ROOTS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select 
                        value={builderType} 
                        onChange={(e) => setBuilderType(e.target.value)}
                        className="w-2/3 bg-[#11012C] border border-[#3B1B8A] p-2 text-xs text-[#E2D9FF] focus:outline-none focus:border-[#A233FF]"
                    >
                        {BUILDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button
                  onClick={handleBuildChord}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[#240A59] border border-[#A233FF] text-[#E2D9FF] hover:bg-[#A233FF] hover:text-white hover:shadow-[0_0_15px_#A233FF] text-xs font-bold uppercase rounded-sm transition-all cursor-pointer"
                >
                  Synthesize Structure
                </button>
             </div>
          </section>

          {/* Group Chat Integration */}
          <div className="flex-1 min-h-[250px] flex flex-col">
              <SpencerChat />
          </div>
        </div>

        {/* Center: Main Visualization Area */}
        <div className="md:col-span-6 bg-[#02000A] flex flex-col p-4 sm:p-6 space-y-6 overflow-y-auto w-full relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3B1B8A]/10 via-[#02000A] to-[#02000A] pointer-events-none"></div>
          {error && (
            <div className="relative text-xs text-red-400 bg-red-900/40 border border-red-500/50 p-3 font-mono shadow-[0_0_10px_rgba(255,0,0,0.2)]">
              {error}
            </div>
          )}

          {data ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={data.root + data.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-[100vw] relative z-10"
              >
                <div className="flex flex-col mb-4 bg-[#11012C]/50 p-4 border border-[#3B1B8A] rounded-lg">
                    <span className="text-[10px] text-[#A233FF] uppercase font-bold tracking-widest">{data.type} SYNTHESIS</span>
                    <h2 className="text-3xl font-bold text-white neon-text-cyan my-1">{data.root} {data.name}</h2>
                    <p className="text-xs text-[#E2D9FF]/80 leading-relaxed max-w-lg mt-2">{data.description}</p>
                    
                    {data.inversions && data.inversions.length > 0 && (
                       <div className="mt-4 border-t border-[#3B1B8A] pt-3">
                         <span className="text-[10px] text-[#A233FF] uppercase font-bold tracking-widest mb-2 block">Common Inversions</span>
                         <div className="flex flex-wrap gap-2">
                           {data.inversions.map((inv, idx) => (
                             <span key={idx} className="bg-[#3B1B8A]/40 border border-[#3B1B8A] text-xs px-2 py-1 rounded text-[#00F0FF] font-mono">
                               {inv}
                             </span>
                           ))}
                         </div>
                       </div>
                    )}
                    
                    {data.type === 'progression' && data.chords && (
                      <div className="mt-4 border-t border-[#3B1B8A] pt-4">
                        <span className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-widest mb-3 block neon-text-cyan">Progression Sequence</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {data.chords.map((chord, idx) => (
                            <div key={idx} className="bg-[#02000A] border border-[#3B1B8A] p-3 rounded-md flex flex-col hover:border-[#00F0FF] transition-colors relative overflow-hidden group">
                               <div className="absolute top-0 right-0 w-16 h-16 bg-[#00F0FF]/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#00F0FF]/20 transition-all pointer-events-none" />
                               <span className="text-[10px] text-[#A233FF] font-mono mb-1">{chord.numeral}</span>
                               <span className="text-sm font-bold text-white tracking-widest uppercase mb-2 line-clamp-1">{chord.name}</span>
                               <div className="flex flex-wrap gap-1 mt-auto">
                                 {chord.notes.map((n, i) => (
                                   <span key={i} className="text-[9px] bg-[#3B1B8A]/50 px-1.5 py-0.5 rounded text-[#E2D9FF] font-mono border border-[#3B1B8A] shadow-sm">{n}</span>
                                 ))}
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="bg-[#11012C] border border-[#3B1B8A] rounded-lg p-4 shadow-[0_0_20px_rgba(0,240,255,0.05)] overflow-x-auto w-full relative">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent"></div>
                  <Piano data={data} />
                </div>
                
                <div className="bg-[#11012C] border border-[#3B1B8A] rounded-lg p-4 shadow-[0_0_20px_rgba(162,51,255,0.05)] overflow-x-auto w-full relative">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A233FF]/50 to-transparent"></div>
                  <Guitar data={data} />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-[#5D4B8B] font-mono text-xs border border-[#3B1B8A] bg-[#11012C]/50 p-4 rounded-lg border-dashed relative z-10">
              <Music className="w-8 h-8 mb-4 opacity-50 text-[#A233FF]" />
              <div className="animate-pulse">[ AWAITING STRUCTURE SYNTHESIS ]</div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Data Matrix & Networks */}
        <div className="md:col-span-3 bg-[#11012C] flex flex-col overflow-hidden w-full">
          <div className="flex-1 overflow-y-auto">
             <NetworkHub />
          </div>

          {/* Analysis Data */}
          <div className="h-[250px] shrink-0 border-t border-[#3B1B8A] bg-[#02000A] flex flex-col">
            <div className="p-3 border-b border-[#3B1B8A] shrink-0 bg-[#11012C] flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-[#A233FF] uppercase tracking-widest">Harmonic Composition</h3>
              {data && (
                <button
                  onClick={handleCopyNotes}
                  className="p-1 rounded bg-[#3B1B8A]/40 hover:bg-[#3B1B8A] text-[#E2D9FF] hover:text-[#00F0FF] transition-colors"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-3 h-3 text-[#00F0FF]" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto font-mono p-2">
              {data ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] text-[#5D4B8B] uppercase border-b border-[#3B1B8A]/50">
                      <th className="p-2 font-normal">Int</th>
                      <th className="p-2 font-normal">Note</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    {data.notes.map((note, i) => {
                      const interval = data.intervals[i] || '-';
                      const isRoot = interval === '1' || interval === 'R' || matchesPitchClass(note, data.root);

                      return (
                        <tr key={i} className={`border-b border-[#3B1B8A]/30 ${isRoot ? 'bg-[#00F0FF]/10' : 'hover:bg-[#3B1B8A]/30 transition-colors'}`}>
                          <td className={`p-2 ${isRoot ? 'text-[#00F0FF] neon-text-cyan' : 'text-[#E2D9FF]/60'}`}>{interval}</td>
                          <td className={`p-2 ${isRoot ? 'text-white font-bold' : 'text-[#E2D9FF]'}`}>{note}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-[10px] font-mono text-[#5D4B8B] text-center py-6">
                  BUFFER_EMPTY
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
