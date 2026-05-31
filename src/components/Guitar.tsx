import { MusicData, matchesPitchClass, ALL_PITCHES_SHARP } from '../types';
import { cn } from '../lib/utils';

const TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];
const FRETS = 13;

function getNote(stringOpenNote: string, fret: number): string {
  const startIndex = ALL_PITCHES_SHARP.indexOf(stringOpenNote);
  return ALL_PITCHES_SHARP[(startIndex + fret) % 12];
}

export function Guitar({ data }: { data: MusicData }) {
  return (
    <div className="w-full font-mono flex flex-col">
      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Fretboard Matrix</div>
      <div className="relative min-w-[500px] flex flex-col overflow-x-auto pb-2">
        <div className="grid grid-cols-[30px_1fr] gap-0">
          
          {/* Tuning markers */}
          <div className="flex flex-col text-[10px] text-white/40 border-r border-white/5 bg-[#111112]">
             {TUNING.map((note, i) => (
                 <span key={i} className="flex h-[40px] items-center justify-center font-bold">{note}</span>
             ))}
          </div>

          {/* Fretboard Grid */}
          <div className="grid border-l-0 border-t border-white/5 bg-[#09090A]" style={{ gridTemplateColumns: `repeat(${FRETS}, minmax(0, 1fr))` }}>
              {TUNING.map((openNote, stringIdx) => (
                 Array.from({ length: FRETS }).map((_, fIdx) => {
                     const currentNote = getNote(openNote, fIdx);
                     const matchedNoteExp = data.notes.find(n => matchesPitchClass(n, currentNote));
                     const isRoot = matchedNoteExp && matchesPitchClass(matchedNoteExp, data.root);
                     const isDot = stringIdx === 3 && [3,5,7,9].includes(fIdx);
                     const isDoubleDot = stringIdx === 3 && fIdx === 12;

                     return (
                         <div key={`${stringIdx}-${fIdx}`} className="border-r border-b border-white/5 h-[40px] flex items-center justify-center relative group">
                             {/* String line */}
                             <div className="absolute left-0 right-0 h-[1px] bg-white/10 top-1/2 -translate-y-1/2 pointer-events-none"></div>
                             
                             {/* Fret marker dot */}
                             {(isDot || isDoubleDot) && (
                                <div className="absolute text-[#00FFC2]/20 text-[10px] pointer-events-none font-sans font-bold flex justify-center -z-0">
                                   {isDoubleDot ? '••' : '•'}
                                </div>
                             )}

                             {matchedNoteExp && (
                               <div className={cn(
                                 "z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase transition-all duration-300",
                                 isRoot ? "bg-[#00FFC2] text-black shadow-[0_0_10px_rgba(0,255,194,0.5)] scale-110" : "bg-white/10 text-white backdrop-blur-sm border border-white/10"
                               )}>
                                 {matchedNoteExp}
                               </div>
                             )}
                         </div>
                     );
                 })
              ))}
          </div>
        </div>
        
        {/* Fret numbers footer */}
        <div className="grid grid-cols-[30px_1fr] gap-0">
            <div></div>
            <div className="grid opacity-40 text-white/50" style={{ gridTemplateColumns: `repeat(${FRETS}, minmax(0, 1fr))` }}>
                {Array.from({length: FRETS}).map((_, i) => (
                    <div key={i} className="text-center text-[9px] pt-3">{i}</div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
