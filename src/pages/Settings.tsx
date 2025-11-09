import React, { useEffect, useState } from "react";
import StudyStats from "@/components/StudyStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="input input-bordered w-full bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
              placeholder="Name"
              value={user.name}
              onChange={(e) => { setUser({ ...user, name: e.target.value }); setDirtyUser(true); }}
            />
            <input
              className="input input-bordered w-full bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
              placeholder="Age"
              type="number"
              value={user.age ?? ''}
              onChange={(e) => { const val = e.target.value ? Number(e.target.value) : null; setUser({ ...user, age: val }); setDirtyUser(true); }}
            />
            <input
              className="input input-bordered w-full bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
              placeholder="Email"
              type="email"
              value={user.email ?? ''}
              onChange={(e) => { setUser({ ...user, email: e.target.value }); setDirtyUser(true); }}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={saveUser} disabled={!dirtyUser}>Save Info</Button>
            <Button size="sm" variant="outline" onClick={clearData}>Clear User + Progress</Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">Delete All Progress</Button>
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

            <Button size="sm" onClick={saveProgressSnapshot} disabled={saving}>{saving ? 'Saving...' : 'Save Progress Snapshot'}</Button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Last saved: {latestSnapshot ? new Date(latestSnapshot.timestamp).toLocaleString() : 'No saved progress'}</p>
          </div>
        </CardContent>
      </Card>

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
        <h2 className="text-lg font-medium mb-2">Usage</h2>
        <div className="p-3 border rounded-md">
          <div className="flex items-center justify-between">
            <div>Sessions</div>
            <div className="font-medium">{usage.sessions}</div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>Total study time</div>
            <div className="font-medium">{formatMinutesToHMS(usage.totalTime)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Subject progress</h2>
        {subjectEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No per-subject data yet. Study some cards to populate progress.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjectEntries.map(([subj, data]) => {
              const answered = data.answered ?? 0;
              const mastered = data.masteredIds?.length ?? 0;
              const masteryPercent = answered > 0 ? Math.round((mastered / answered) * 100) : 0;
              return (
                <div key={subj} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{subj}</div>
                    <div className="text-sm text-muted-foreground">Updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : '-'}</div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div>Answered</div>
                      <div className="font-medium">{answered}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Correct</div>
                      <div className="font-medium">{data.correct}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Incorrect</div>
                      <div className="font-medium">{data.incorrect}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Mastered</div>
                      <div className="font-medium">{mastered}</div>
                    </div>
                    <div className="mt-2">
                      <Progress value={masteryPercent} className="h-2" />
                      <div className="text-sm text-right mt-1">Mastery {masteryPercent}%</div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Study time: {formatMinutesToHMS(data.studyTime ?? 0)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Progress history</h2>
        {store.snapshots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No snapshots yet.</p>
        ) : (
          <div className="space-y-2">
            {(() => {
              const snaps = store.snapshots.slice().reverse();
              const toShow = showAllSnapshots ? snaps : snaps.slice(0, 2);
              return (
                <>
                  {toShow.map((s, idx) => (
                    <div key={idx} className="p-2 border rounded-md flex justify-between items-center">
                      <div className="text-sm">
                        <div className="font-medium">{new Date(s.timestamp).toLocaleString()}</div>
                        <div className="text-muted-foreground">
                          Mastered {s.masteredCards} / {s.totalCards} • Accuracy {s.accuracy}%
                        </div>
                      </div>
                      <div>
                        <Button size="sm" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(s)); }}>Copy</Button>
                      </div>
                    </div>
                  ))}

                  {snaps.length > 2 && (
                    <div className="flex justify-center">
                      <Button size="sm" variant="link" onClick={() => setShowAllSnapshots((v) => !v)}>{showAllSnapshots ? 'Show less' : `Show more (${snaps.length - 2} more)`}</Button>
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
