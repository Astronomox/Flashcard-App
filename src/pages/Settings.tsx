import React, { useEffect, useState } from "react";
import StudyStats from "@/components/StudyStats";
import progressLib, { Snapshot, SubjectProgress } from "@/lib/progress";
import { formatMinutesToHMS } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const USER_KEY = "flashcards.user";

const Settings = () => {
  const [user, setUser] = useState<{ name: string; age?: number | null; email?: string }>({ name: "", age: null, email: "" });
  const [dirtyUser, setDirtyUser] = useState(false);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<{
    snapshots: Snapshot[];
    bySubject: Record<string, SubjectProgress>;
    usage?: { sessions: number; totalTime: number; sessionStart?: string | null; lastActive?: string | null; }
  }>({ snapshots: [], bySubject: {} });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore localStorage parse errors
    }
    const s = progressLib.loadProgress();
    setStore(s);
  }, []);

  const saveUser = () => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setDirtyUser(false);
    } catch (e) {
      console.error(e);
    }
  };

  const saveProgressSnapshot = async () => {
    setSaving(true);
    try {
      // Create snapshot from current aggregated progress
      const snap = progressLib.buildAggregatedSnapshot();
      const saved = progressLib.recordSnapshot(snap);
      setStore(progressLib.loadProgress());
      return saved;
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const clearData = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('flashcards.progress');
    setUser({ name: "", age: null, email: "" });
    setStore({ snapshots: [], bySubject: {} });
    setDirtyUser(false);
  };

  const deleteAllProgress = () => {
    try {
      progressLib.saveProgress({ snapshots: [], bySubject: {}, usage: { sessions: 0, totalTime: 0, sessionStart: null, lastActive: null } });
      setStore(progressLib.loadProgress());
    } catch (e) {
      console.error(e);
    }
  };

  // Derive stats for the StudyStats preview
  const latestSnapshot = store.snapshots.length > 0 ? store.snapshots[store.snapshots.length - 1] : null;
  const stats = latestSnapshot ?? (() => {
    // Approximate aggregation from bySubject
    const subjects = Object.values(store.bySubject || {});
    if (subjects.length === 0) return { totalCards: 0, masteredCards: 0, accuracy: 0 };
    const totalAnswered = subjects.reduce((s, v) => s + (v.answered ?? 0), 0);
    const totalCorrect = subjects.reduce((s, v) => s + (v.correct ?? 0), 0);
    const mastered = subjects.reduce((s, v) => s + (v.masteredIds?.length ?? 0), 0);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return { totalCards: totalAnswered, masteredCards: mastered, accuracy };
  })();

  const subjectEntries = Object.entries(store.bySubject || {});
  const usage = store.usage ?? { sessions: 0, totalTime: 0 };

  const [showAllSnapshots, setShowAllSnapshots] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-4" style={{ color: 'var(--ink)' }}>Settings</h1>
      <div className="clay-surface">
        <div className="px-5 py-4" style={{ borderBottom: '2px solid var(--clay-dark)' }}>
          <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--ink)' }}>User Settings</h3>
        </div>
        <div className="px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="clay-input"
              placeholder="Name"
              value={user.name}
              onChange={(e) => { setUser({ ...user, name: e.target.value }); setDirtyUser(true); }}
            />
            <input
              className="clay-input"
              placeholder="Age"
              type="number"
              value={user.age ?? ''}
              onChange={(e) => { const val = e.target.value ? Number(e.target.value) : null; setUser({ ...user, age: val }); setDirtyUser(true); }}
            />
            <input
              className="clay-input"
              placeholder="Email"
              type="email"
              value={user.email ?? ''}
              onChange={(e) => { setUser({ ...user, email: e.target.value }); setDirtyUser(true); }}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button className="clay-btn clay-btn-green" style={{ padding: '8px 16px', fontSize: '16px' }} onClick={saveUser} disabled={!dirtyUser}>Save Info</button>
            <button className="clay-btn clay-btn-muted" style={{ padding: '8px 16px', fontSize: '16px' }} onClick={clearData}>Clear User + Progress</button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="clay-btn clay-btn-red" style={{ padding: '8px 16px', fontSize: '16px' }}>Delete All Progress</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all progress and history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => { deleteAllProgress(); }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button className="clay-btn" style={{ padding: '8px 16px', fontSize: '16px' }} onClick={saveProgressSnapshot} disabled={saving}>{saving ? 'Saving...' : 'Save Progress Snapshot'}</button>
          </div>
          <div className="mt-4">
            <p className="font-hand" style={{ color: 'var(--ink-faint)', fontSize: '14px' }}>Last saved: {latestSnapshot ? new Date(latestSnapshot.timestamp).toLocaleString() : 'No saved progress'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Preview current stats</h2>
        <StudyStats 
          totalCards={stats.totalCards} 
          masteredCards={stats.masteredCards} 
          studyTime={usage.totalTime} 
          accuracy={stats.accuracy} 
        />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-display font-semibold mb-2" style={{ color: 'var(--ink)' }}>Usage</h2>
        <div className="clay-surface p-4">
          <div className="flex items-center justify-between font-body" style={{ color: 'var(--ink-light)' }}>
            <div>Sessions</div>
            <div className="font-semibold" style={{ color: 'var(--ink)' }}>{usage.sessions}</div>
          </div>
          <div className="flex items-center justify-between mt-2 font-body" style={{ color: 'var(--ink-light)' }}>
            <div>Total study time</div>
            <div className="font-semibold" style={{ color: 'var(--ink)' }}>{formatMinutesToHMS(usage.totalTime)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-display font-semibold mb-2" style={{ color: 'var(--ink)' }}>Subject progress</h2>
        {subjectEntries.length === 0 ? (
          <p className="font-hand" style={{ color: 'var(--ink-faint)', fontSize: '15px' }}>No per-subject data yet. Study some cards to populate progress.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjectEntries.map(([subj, data]) => {
              const answered = data.answered ?? 0;
              const mastered = data.masteredIds?.length ?? 0;
              const masteryPercent = answered > 0 ? Math.round((mastered / answered) * 100) : 0;
              return (
                <div key={subj} className="clay-surface p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-display font-semibold" style={{ color: 'var(--ink)' }}>{subj}</div>
                    <div className="font-hand text-sm" style={{ color: 'var(--ink-faint)', fontSize: '13px' }}>Updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : '-'}</div>
                  </div>
                  <div className="mt-2 text-sm font-body" style={{ color: 'var(--ink-light)' }}>
                    <div className="flex items-center justify-between">
                      <div>Answered</div>
                      <div className="font-semibold" style={{ color: 'var(--ink)' }}>{answered}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Correct</div>
                      <div className="font-semibold" style={{ color: 'var(--ink)' }}>{data.correct}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Incorrect</div>
                      <div className="font-semibold" style={{ color: 'var(--ink)' }}>{data.incorrect}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Mastered</div>
                      <div className="font-semibold" style={{ color: 'var(--ink)' }}>{mastered}</div>
                    </div>
                    <div className="mt-2">
                      <div className="clay-progress">
                        <div className="clay-progress-fill" style={{ width: `${masteryPercent}%`, background: 'var(--green-clay)' }} />
                      </div>
                      <div className="text-sm text-right mt-1 font-hand" style={{ color: 'var(--ink-faint)', fontSize: '14px' }}>Mastery {masteryPercent}%</div>
                    </div>
                    <div className="mt-2 font-hand" style={{ color: 'var(--ink-faint)', fontSize: '14px' }}>Study time: {formatMinutesToHMS(data.studyTime ?? 0)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-display font-semibold mb-2" style={{ color: 'var(--ink)' }}>Progress history</h2>
        {store.snapshots.length === 0 ? (
          <p className="font-hand" style={{ color: 'var(--ink-faint)', fontSize: '15px' }}>No snapshots yet.</p>
        ) : (
          <div className="space-y-2">
            {(() => {
              const snaps = store.snapshots.slice().reverse();
              const toShow = showAllSnapshots ? snaps : snaps.slice(0, 2);
              return (
                <>
                  {toShow.map((s, idx) => (
                    <div key={idx} className="clay-surface p-3 flex justify-between items-center">
                      <div className="text-sm">
                        <div className="font-display font-semibold" style={{ color: 'var(--ink)' }}>{new Date(s.timestamp).toLocaleString()}</div>
                        <div className="font-hand" style={{ color: 'var(--ink-faint)', fontSize: '14px' }}>
                          <span className="wax-seal" /> Mastered {s.masteredCards} / {s.totalCards} • Accuracy {s.accuracy}%
                        </div>
                      </div>
                      <div>
                        <button className="clay-btn clay-btn-muted" style={{ padding: '4px 12px', fontSize: '14px' }} onClick={() => { navigator.clipboard?.writeText(JSON.stringify(s)); }}>Copy</button>
                      </div>
                    </div>
                  ))}

                  {snaps.length > 2 && (
                    <div className="flex justify-center">
                      <button className="font-hand font-semibold" style={{ color: 'var(--clay-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }} onClick={() => setShowAllSnapshots((v) => !v)}>{showAllSnapshots ? 'Show less' : `Show more (${snaps.length - 2} more)`}</button>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
