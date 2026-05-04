"use client";

import React from 'react';
import { BookOpen, CheckCircle, Clock, Target } from "lucide-react";
import { formatMinutesToHMS } from "@/lib/utils";

interface StudyStatsProps {
  totalCards: number;
  masteredCards: number;
  accuracy: number;
}

const StudyStats = ({ totalCards, masteredCards, accuracy }: StudyStatsProps) => {
  const masteryPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;
  const remainingCards = totalCards - masteredCards;

  const statItems = [
    { icon: BookOpen, label: 'Total Cards', value: totalCards, bg: '#B3E5FC', border: '#29B6F6', iconColor: '#0288D1' },
    { icon: CheckCircle, label: 'Mastered', value: masteredCards, bg: '#C8E6C9', border: '#66BB6A', iconColor: '#388E3C' },
    { icon: Target, label: 'Accuracy', value: `${accuracy}%`, bg: '#FFE0B2', border: '#FFA726', iconColor: '#E65100' },
  ];

  return (
    <div className="clay-surface w-full">
      <div
        className="px-5 py-4"
        style={{
          borderBottom: '2px solid var(--clay-dark)',
        }}
      >
        <h3 className="font-display font-semibold text-lg flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <Target className="w-5 h-5" />
          Study Statistics
        </h3>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-4">
          {statItems.map(({ icon: Icon, label, value, bg, border, iconColor }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: bg,
                  border: `2px solid ${border}`,
                  boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.5), inset -1px -1px 2px rgba(0,0,0,0.08)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div>
                <p className="font-hand text-sm" style={{ color: 'var(--ink-faint)', fontSize: '14px' }}>{label}</p>
                <p className="text-xl font-display font-bold" style={{ color: 'var(--ink)' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2 font-hand font-semibold" style={{ color: 'var(--ink-light)', fontSize: '15px' }}>
            <span>Mastery Progress</span>
            <span>{Math.round(masteryPercentage)}%</span>
          </div>
          <div className="clay-progress">
            <div
              className="clay-progress-fill"
              style={{ width: `${masteryPercentage}%`, background: 'var(--green-clay)' }}
            />
          </div>
        </div>

        <div className="mt-4 font-hand" style={{ color: 'var(--ink-faint)', fontSize: '15px' }}>
          <p><span className="wax-seal" /> {remainingCards} cards remaining to master</p>
        </div>
      </div>
    </div>
  );
};

export default StudyStats;