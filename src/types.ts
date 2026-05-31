export interface ProgressionChord {
  name: string;
  notes: string[];
  numeral: string;
}

export interface MusicData {
  type: 'scale' | 'chord' | 'progression';
  root: string;
  name: string;
  notes: string[];
  intervals: string[];
  inversions?: string[];
  description: string;
  chords?: ProgressionChord[];
}

export const ALL_PITCHES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const ALL_PITCHES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function simplifyNote(note: string): string {
  // Map complex enharmonics to standard for generic rendering if needed
  // This helps when trying to match user input to standard 12-tone array
  const map: Record<string, string> = {
    'Cb': 'B', 'B#': 'C', 'E#': 'F', 'Fb': 'E'
  };
  return map[note] || note;
}

export function matchesPitchClass(note1: string, note2: string): boolean {
  if (note1 === note2) return true;
  const n1 = simplifyNote(note1);
  const n2 = simplifyNote(note2);
  if (n1 === n2) return true;

  const sharpIndex = ALL_PITCHES_SHARP.indexOf(n1);
  if (sharpIndex !== -1 && ALL_PITCHES_FLAT[sharpIndex] === n2) return true;
  
  const flatIndex = ALL_PITCHES_FLAT.indexOf(n1);
  if (flatIndex !== -1 && ALL_PITCHES_SHARP[flatIndex] === n2) return true;
  
  return false;
}
