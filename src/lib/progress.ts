export type Snapshot = {
  totalCards: number;
  masteredCards: number;
  accuracy: number; // percentage
  timestamp: string;
};

export type SubjectProgress = {
  answered: number;
  correct: number;
  incorrect: number;
  masteredIds: string[]; // list of card ids marked mastered
  lastUpdated?: string;
  studyTime?: number; // total study time in minutes for this subject
};

export type ProgressStore = {
  snapshots: Snapshot[]; // history (newest last)
  bySubject: Record<string, SubjectProgress>;
  usage?: {
    sessions: number;
    totalTime: number; // minutes
    sessionStart?: string | null;
    lastActive?: string | null;
  };
};

const KEY = 'flashcards.progress';
const MAX_SNAPSHOTS = 50;

export const loadProgress = (): ProgressStore => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { snapshots: [], bySubject: {} };
    const parsed = JSON.parse(raw) as ProgressStore;
    // basic shape checks
    return {
      snapshots: Array.isArray(parsed.snapshots) ? parsed.snapshots : [],
      bySubject: parsed.bySubject ?? {},
      usage: parsed.usage ?? { sessions: 0, totalTime: 0, sessionStart: null, lastActive: null },
    };
  } catch (e) {
    console.error('loadProgress parse error', e);
    return { snapshots: [], bySubject: {} };
  }
};

export const saveProgress = (store: ProgressStore) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch (e) {
    console.error('saveProgress error', e);
  }
};

export const startUsageSession = () => {
  const store = loadProgress();
  store.usage = store.usage ?? { sessions: 0, totalTime: 0, sessionStart: null, lastActive: null };
  if (!store.usage.sessionStart) {
    store.usage.sessionStart = new Date().toISOString();
    store.usage.sessions = (store.usage.sessions ?? 0) + 1;
    saveProgress(store);
  }
  return store.usage;
};

export const addUsageTime = (minutes: number) => {
  const store = loadProgress();
  store.usage = store.usage ?? { sessions: 0, totalTime: 0, sessionStart: null, lastActive: null };
  store.usage.totalTime = (store.usage.totalTime ?? 0) + minutes;
  store.usage.lastActive = new Date().toISOString();
  saveProgress(store);
  return store.usage;
};

export const endUsageSession = () => {
  const store = loadProgress();
  if (store.usage && store.usage.sessionStart) {
    // compute session length optionally
    store.usage.sessionStart = null;
    saveProgress(store);
  }
  return store.usage;
};

// NEW FUNCTION: Add study time to a specific subject
export const addSubjectStudyTime = (subject: string, minutes: number) => {
  const store = loadProgress();
  const cur = store.bySubject[subject] ?? { 
    answered: 0, 
    correct: 0, 
    incorrect: 0, 
    masteredIds: [], 
    lastUpdated: undefined,
    studyTime: 0 
  };
  
  cur.studyTime = (cur.studyTime ?? 0) + minutes;
  cur.lastUpdated = new Date().toISOString();
  store.bySubject[subject] = cur;
  saveProgress(store);
  
  // Also add to global usage time
  try {
    startUsageSession();
    addUsageTime(minutes);
  } catch (e) {
    console.error('addSubjectStudyTime usage tracking error', e);
  }
  
  return cur;
};

export const recordSnapshot = (snapshot: Omit<Snapshot, 'timestamp'> & { timestamp?: string }) => {
  const s: Snapshot = { ...snapshot, timestamp: snapshot.timestamp ?? new Date().toISOString() };
  const store = loadProgress();
  store.snapshots.push(s);
  if (store.snapshots.length > MAX_SNAPSHOTS) store.snapshots.splice(0, store.snapshots.length - MAX_SNAPSHOTS);
  saveProgress(store);
  return s;
};

// compute aggregated snapshot from store current state
export const buildAggregatedSnapshot = (): Snapshot => {
  const store = loadProgress();
  const subjects = Object.values(store.bySubject || {});
  const totalAnswered = subjects.reduce((s, v) => s + (v.answered ?? 0), 0);
  const mastered = subjects.reduce((s, v) => s + (v.masteredIds?.length ?? 0), 0);
  const totalCorrect = subjects.reduce((s, v) => s + (v.correct ?? 0), 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  return {
    totalCards: totalAnswered,
    masteredCards: mastered,
    accuracy,
    timestamp: new Date().toISOString(),
  };
};

export const recordSubjectAnswer = (subject: string, { correct, cardId, mastered }: { correct: boolean; cardId?: string; mastered?: boolean }) => {
  const store = loadProgress();
  const cur = store.bySubject[subject] ?? { answered: 0, correct: 0, incorrect: 0, masteredIds: [], lastUpdated: undefined };
  cur.answered = (cur.answered ?? 0) + 1;
  if (correct) cur.correct = (cur.correct ?? 0) + 1;
  else cur.incorrect = (cur.incorrect ?? 0) + 1;
  if (cardId && mastered) {
    // add to mastered if not present
    if (!cur.masteredIds.includes(cardId)) cur.masteredIds.push(cardId);
  }
  if (cardId && mastered === false) {
    // remove from mastered list
    cur.masteredIds = cur.masteredIds.filter((id) => id !== cardId);
  }
  cur.lastUpdated = new Date().toISOString();
  store.bySubject[subject] = cur;
  saveProgress(store);
  return cur;
};

// allow passing additional options such as timeSpent (minutes)
export const recordSubjectAnswerWithOptions = (subject: string, { correct, cardId, mastered, timeSpent }: { correct: boolean; cardId?: string; mastered?: boolean; timeSpent?: number }) => {
  const store = loadProgress();
  const cur = store.bySubject[subject] ?? { answered: 0, correct: 0, incorrect: 0, masteredIds: [], lastUpdated: undefined, studyTime: 0 };
  cur.answered = (cur.answered ?? 0) + 1;
  if (correct) cur.correct = (cur.correct ?? 0) + 1;
  else cur.incorrect = (cur.incorrect ?? 0) + 1;
  if (cardId && mastered) {
    if (!cur.masteredIds.includes(cardId)) cur.masteredIds.push(cardId);
  }
  if (cardId && mastered === false) {
    cur.masteredIds = cur.masteredIds.filter((id) => id !== cardId);
  }
  cur.lastUpdated = new Date().toISOString();
  // usage tracking: ensure session started and add time
  try {
    startUsageSession();
    if (timeSpent && timeSpent > 0) addUsageTime(timeSpent);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('progress usage tracking error', e);
  }
  store.bySubject[subject] = cur;
  saveProgress(store);
  return cur;
};

export const getSubjectProgress = (subject: string): SubjectProgress | undefined => {
  return loadProgress().bySubject[subject];
};

export const getHistory = (): Snapshot[] => loadProgress().snapshots;

// attach a typed backwards-compatible helper on window without using `any`
declare global {
  interface Window {
    saveFlashcardsProgress?: (payload: Partial<Snapshot>) => Snapshot;
  }
}

try {
  window.saveFlashcardsProgress = (payload: Partial<Snapshot>) => {
    const merged: Snapshot = {
      totalCards: payload.totalCards ?? 0,
      masteredCards: payload.masteredCards ?? 0,
      accuracy: payload.accuracy ?? 0,
      timestamp: payload.timestamp ?? new Date().toISOString(),
    };
    return recordSnapshot(merged);
  };
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('window saveFlashcardsProgress attach error', e);
}

export default {
  loadProgress,
  saveProgress,
  recordSnapshot,
  buildAggregatedSnapshot,
  recordSubjectAnswer,
  recordSubjectAnswerWithOptions,
  getSubjectProgress,
  getHistory,
  startUsageSession,
  addUsageTime,
  addSubjectStudyTime, // Add to exports
  endUsageSession,
};