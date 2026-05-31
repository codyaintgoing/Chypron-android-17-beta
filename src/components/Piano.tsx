import { MusicData, matchesPitchClass } from '../types';
import { cn } from '../lib/utils';

export function Piano({ data }: { data: MusicData }) {
  const PIANO_KEYS = [
    { s: 'C', b: false }, { s: 'C#', f: 'Db', b: true }, { s: 'D', b: false }, { s: 'D#', f: 'Eb', b: true }, { s: 'E', b: false },
    { s: 'F', b: false }, { s: 'F#', f: 'Gb', b: true }, { s: 'G', b: false }, { s: 'G#', f: 'Ab', b: true }, { s: 'A', b: false },
    { s: 'A#', f: 'Bb', b: true }, { s: 'B', b: false },
    { s: 'C', b: false }, { s: 'C#', f: 'Db', b: true }, { s: 'D', b: false }, { s: 'D#', f: 'Eb', b: true }, { s: 'E', b: false },
    { s: 'F', b: false }, { s: 'F#', f: 'Gb', b: true }, { s: 'G', b: false }, { s: 'G#', f: 'Ab', b: true }, { s: 'A', b: false },
    { s: 'A#', f: 'Bb', b: true }, { s: 'B', b: false }, { s: 'C', b: false }
  ];

  return (
    <div className="w-full flex justify-center flex-col">
      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Keyboard Matrix</div>
      <div className="relative flex h-32 sm:h-40 w-full overflow-x-auto overflow-y-hidden">
        <div className="flex w-full min-w-[500px] h-full border-t border-l border-white/10 bg-white">
            {PIANO_KEYS.map((key, i) => {
            if (key.b) return null;

            const matchedNote = data.notes.find(n => matchesPitchClass(n, key.s) || (key.f && matchesPitchClass(n, key.f)));
            const isRoot = matchedNote && matchesPitchClass(matchedNote, data.root);
            
            const hasBlackNext = i + 1 < PIANO_KEYS.length && PIANO_KEYS[i+1].b;
            const nextKey = hasBlackNext ? PIANO_KEYS[i+1] : null;
            const bMatch = nextKey ? data.notes.find(n => matchesPitchClass(n, nextKey.s) || (nextKey.f && matchesPitchClass(n, nextKey.f))) : null;
            const bIsRoot = bMatch ? matchesPitchClass(bMatch, data.root) : false;

            return (
                <div key={i} className="relative flex-1 border-r border-[#09090A] flex flex-col justify-end pb-2 group">
                  <div className={cn(
                      "absolute inset-0 transition-colors z-0",
                      matchedNote ? (isRoot ? "bg-[#00FFC2]" : "bg-black/10") : "bg-transparent hover:bg-black/5"
                  )} />
                  {matchedNote && <span className={cn("relative z-10 w-full text-center font-mono text-[10px] sm:text-xs font-bold uppercase", isRoot ? "text-black" : "text-black/60")}>{matchedNote}</span>}

                  {nextKey && (
                      <div className={cn(
                      "absolute top-0 right-0 translate-x-1/2 w-[60%] h-[60%] border-x border-b border-[#09090A] z-20 flex flex-col items-center justify-end pb-1 transition-colors uppercase",
                      bMatch ? (bIsRoot ? "bg-[#00FFC2] shadow-[0_0_15px_rgba(0,255,194,0.4)] text-black" : "bg-[#111112] text-white shadow-[0_0_10px_rgba(255,255,255,0.2)] border-white/20") : "bg-[#09090A]"
                      )}>
                      {bMatch && <span className="font-mono text-[9px] font-bold tracking-tighter">{bMatch}</span>}
                      </div>
                  )}
                </div>
            )
            })}
        </div>
      </div>
    </div>
  );
}
