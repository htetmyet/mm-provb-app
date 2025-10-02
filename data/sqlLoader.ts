import initSqlJs, { Database, SqlJsStatic, Statement } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import dictionaryDbUrl from './burmese_dictionary.db?url';
import proverbsDbUrl from './burmese_proverbs.db?url';
import type { DictionaryEntry, ProverbEntry } from '../types';

let sqlJsInstance: Promise<SqlJsStatic> | null = null;
let dictionaryCache: Promise<DictionaryEntry[]> | null = null;
let proverbsCache: Promise<ProverbEntry[]> | null = null;

const getSqlJs = () => {
  if (!sqlJsInstance) {
    sqlJsInstance = initSqlJs({
      locateFile: (_file: string) => sqlWasmUrl,
    });
  }
  return sqlJsInstance;
};

const loadDatabase = async (url: string): Promise<Database> => {
  const SQL = await getSqlJs();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load database from ${url} (status ${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  return new SQL.Database(new Uint8Array(buffer));
};

const toString = (value: unknown): string => (value == null ? '' : String(value));
const normalizeOptional = (value: unknown): string | null => {
  const text = toString(value).trim();
  if (!text) {
    return null;
  }
  const lower = text.toLowerCase();
  if (lower === 'null' || lower === 'undefined') {
    return null;
  }
  return text;
};

const resolveProverbText = (candidate: string | null, fallback: string | null): string => {
  if (candidate && /\D/.test(candidate)) {
    return candidate;
  }
  if (fallback && fallback.length > 0) {
    return fallback;
  }
  return candidate && candidate.length > 0 ? candidate : 'Untitled proverb';
};

const mapDictionaryRows = (db: Database): DictionaryEntry[] => {
  const entries: DictionaryEntry[] = [];
  const statement = db.prepare(
    'SELECT alphabet, word, phonetics, meaning, pos, origin FROM entries'
  );

  while (statement.step()) {
    const row = statement.getAsObject() as Record<string, unknown>;
    entries.push({
      alphabet: toString(row.alphabet),
      word: toString(row.word),
      phonetics: toString(row.phonetics),
      meaning: toString(row.meaning),
      pos: toString(row.pos),
      origin: toString(row.origin),
    });
  }

  statement.free();
  return entries;
};

const mapProverbRows = (db: Database): ProverbEntry[] => {
  const proverbs: ProverbEntry[] = [];
  const queries = [
    `SELECT id,
            c0 AS proverb,
            c1 AS meaning,
            c2 AS english_meaning
     FROM proverbs_fts_content
     ORDER BY id`,
    `SELECT f.rowid AS id,
            f.provb AS proverb,
            f.meaning AS meaning,
            f.en_meaning AS english_meaning
     FROM proverbs_fts f
     ORDER BY f.rowid`,
    `SELECT provb_id AS id,
            provb AS proverb,
            meaning,
            en_meaning AS english_meaning
     FROM proverbs
     ORDER BY provb_id`,
  ];

  let statement: Statement | null = null;

  for (const query of queries) {
    try {
      statement = db.prepare(query);
      break;
    } catch (error) {
      console.warn(`Failed to prepare proverb query: ${query}\n${error}`);
    }
  }

  if (!statement) {
    throw new Error('Unable to prepare proverb query for proverbs database');
  }

  while (statement.step()) {
    const row = statement.getAsObject() as Record<string, unknown>;
    const rawProverb = normalizeOptional(row.proverb ?? row.provb);
    const meaning = normalizeOptional(row.meaning);
    const englishMeaning = normalizeOptional(row.english_meaning ?? row.en_meaning);
    const resolvedProverb = resolveProverbText(rawProverb, meaning);
    proverbs.push({
      id: toString(row.id ?? row.provb_id ?? row.rowid),
      proverb: resolvedProverb,
      meaning: meaning ?? '',
      english_meaning: englishMeaning,
    });
  }

  statement.free();
  return proverbs;
};

export const loadDictionaryEntries = (): Promise<DictionaryEntry[]> => {
  if (!dictionaryCache) {
    dictionaryCache = (async () => {
      const db = await loadDatabase(dictionaryDbUrl);
      try {
        return mapDictionaryRows(db);
      } finally {
        db.close();
      }
    })().catch(error => {
      dictionaryCache = null;
      throw error;
    });
  }

  return dictionaryCache;
};

export const loadProverbEntries = (): Promise<ProverbEntry[]> => {
  if (!proverbsCache) {
    proverbsCache = (async () => {
      const db = await loadDatabase(proverbsDbUrl);
      try {
        return mapProverbRows(db);
      } finally {
        db.close();
      }
    })().catch(error => {
      proverbsCache = null;
      throw error;
    });
  }

  return proverbsCache;
};
