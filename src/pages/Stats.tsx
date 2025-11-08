import React, { useEffect, useState } from "react";
import StudyStats from "@/components/StudyStats";
import progressLib, { Snapshot } from "@/lib/progress";

const Stats = () => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    try {
      const history = progressLib.getHistory();
      if (history && history.length > 0) {
        setSnapshot(history[history.length - 1]);
        return;
      }
      const store = progressLib.loadProgress();
      // derive an approximate snapshot from bySubject if no snapshots
      const subjects = Object.values(store.bySubject || {});
      if (subjects.length > 0) {
        const totalAnswered = subjects.reduce((s, v) => s + (v.answered ?? 0), 0);
        const totalCorrect = subjects.reduce((s, v) => s + (v.correct ?? 0), 0);
        const mastered = subjects.reduce((s, v) => s + (v.masteredIds?.length ?? 0), 0);
        const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
        setSnapshot({ totalCards: totalAnswered, masteredCards: mastered, accuracy, timestamp: new Date().toISOString() });
      } else {
        setSnapshot({ totalCards: 0, masteredCards: 0, accuracy: 0, timestamp: new Date().toISOString() });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const stats = snapshot ?? { totalCards: 0, masteredCards: 0, accuracy: 0 };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Study Stats</h1>
      <StudyStats totalCards={stats.totalCards} masteredCards={stats.masteredCards} accuracy={stats.accuracy} />
    </div>
  );
};

export default Stats;
