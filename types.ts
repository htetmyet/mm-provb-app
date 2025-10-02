
export interface DictionaryEntry {
  alphabet: string;
  word: string;
  phonetics: string;
  meaning: string;
  pos: string; // Part of Speech
  origin: string;
}

export interface ProverbEntry {
  id: string;
  proverb: string;
  meaning: string;
  english_meaning: string | null;
}

export type Theme = 'light' | 'dark';
