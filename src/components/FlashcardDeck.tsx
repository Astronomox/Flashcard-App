"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import Flashcard from "@/components/Flashcard";
import { recordSubjectAnswer, recordSnapshot, recordSubjectAnswerWithOptions, buildAggregatedSnapshot, addSubjectStudyTime } from "@/lib/progress";

interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  subject: string;
}

interface FlashcardDeckProps {
  subject: string;
  cards: FlashcardItem[];
}

const FlashcardDeck = ({ subject, cards }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStartAt, setCardStartAt] = useState<number>(Date.now());
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [shuffledCards, setShuffledCards] = useState<FlashcardItem[]>(cards);
  const currentCardRef = useRef<FlashcardItem | null>(null);
  const cardStartAtRef = useRef<number>(Date.now());

  // Helper: Fisher-Yates shuffle
  const shuffle = (arr: FlashcardItem[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // When the incoming cards prop changes (e.g., a new subject selected), shuffle them
  useEffect(() => {
    const copy = cards.slice();
    setShuffledCards(shuffle(copy));
    setCurrentIndex(0);
    setMasteredCards(new Set());
    const now = Date.now();
    setCardStartAt(now);
    cardStartAtRef.current = now;

    return () => {
      // when deck unmounts, record time spent on the current card
      try {
        const now2 = Date.now();
        const minutes = Math.max(0, (now2 - cardStartAtRef.current) / 60000);
        if (minutes > 0 && currentCardRef.current) {
          addSubjectStudyTime(subject, minutes);
        }
      } catch (e) {
        // log cleanup errors to make failures visible in dev
        // eslint-disable-next-line no-console
        console.error('FlashcardDeck cleanup error', e);
      }
    };
  }, [cards, subject]);

  const currentCard = shuffledCards[currentIndex];

  // keep a ref to the current card for unmount/cleanup use
  useEffect(() => { 
    currentCardRef.current = shuffledCards[currentIndex] ?? null; 
  }, [shuffledCards, currentIndex]);

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      try {
        const now = Date.now();
        const minutes = Math.max(0, (now - cardStartAtRef.current) / 60000);
        if (minutes > 0) addSubjectStudyTime(subject, minutes);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('FlashcardDeck timing error (next)', e);
      }
      setCurrentIndex(currentIndex + 1);
      const now2 = Date.now();
      setCardStartAt(now2);
      cardStartAtRef.current = now2;
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      try {
        const now = Date.now();
        const minutes = Math.max(0, (now - cardStartAtRef.current) / 60000);
        if (minutes > 0) addSubjectStudyTime(subject, minutes);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('FlashcardDeck timing error (prev)', e);
      }
      setCurrentIndex(currentIndex - 1);
      const now2 = Date.now();
      setCardStartAt(now2);
      cardStartAtRef.current = now2;
    }
  };

  const markAsMastered = () => {
    const now = Date.now();
    const minutes = Math.max(0, (now - cardStartAt) / 60000);
    setMasteredCards(prev => {
      const newSet = new Set(prev);
      newSet.add(currentCard.id);
      // record subject-level progress with time
      try {
        // Record progress with time spent
        recordSubjectAnswerWithOptions(subject, { correct: true, cardId: currentCard.id, mastered: true, timeSpent: minutes });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('FlashcardDeck record progress error (mastered)', e);
      }
      // record an aggregated snapshot built from store
      try {
        const snap = buildAggregatedSnapshot();
        recordSnapshot({ totalCards: snap.totalCards, masteredCards: snap.masteredCards, accuracy: snap.accuracy });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('FlashcardDeck snapshot error (mastered)', e);
      }
      return newSet;
    });
    if (currentIndex < shuffledCards.length - 1) {
      handleNext();
    }
  };

  const markAsNeedsReview = () => {
    const now = Date.now();
    const minutes = Math.max(0, (now - cardStartAt) / 60000);
    setMasteredCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      // record subject-level progress as incorrect with time
      try {
        recordSubjectAnswerWithOptions(subject, { correct: false, cardId: currentCard.id, mastered: false, timeSpent: minutes });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('FlashcardDeck record progress error (needs review)', e);
      }
      // record aggregated snapshot
      try {
        const snap = buildAggregatedSnapshot();
        recordSnapshot({ totalCards: snap.totalCards, masteredCards: snap.masteredCards, accuracy: snap.accuracy });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('FlashcardDeck snapshot error (needs review)', e);
      }
      return newSet;
    });
    if (currentIndex < shuffledCards.length - 1) {
      handleNext();
    }
  };

  const total = shuffledCards.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const masteryPercentage = total > 0 ? (masteredCards.size / total) * 100 : 0;

  if (total === 0) {
    return (
      <div className="w-full max-w-md mx-auto clay-surface p-8 text-center">
        <p className="font-hand font-semibold" style={{ color: 'var(--ink-faint)', fontSize: '18px' }}>
          No flashcards available for this subject.
        </p>
        <p className="text-sm mt-2 font-body" style={{ color: 'var(--ink-faint)' }}>
          Try selecting a different subject.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="clay-surface mb-4 overflow-hidden">
        <div
          className="px-5 py-4"
          style={{
            background: 'var(--clay-accent)',
            borderBottom: '3px solid #7A3A1A',
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-display font-bold" style={{ color: 'var(--paper)' }}>{subject}</h2>
            <div className="flex items-center gap-3">
              <span
                className="font-hand font-semibold px-3 py-1 rounded-lg"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'var(--paper)',
                  fontSize: '16px',
                }}
              >
                {currentIndex + 1} / {total}
              </span>
              <button
                onClick={() => {
                  try {
                    const now = Date.now();
                    const minutes = Math.max(0, (now - cardStartAtRef.current) / 60000);
                    if (minutes > 0) addSubjectStudyTime(subject, minutes);
                  } catch (e) {
                    console.error('FlashcardDeck timing error (reshuffle)', e);
                  }
                  const copy = shuffledCards.slice();
                  setShuffledCards(shuffle(copy));
                  setCurrentIndex(0);
                  const now2 = Date.now();
                  setCardStartAt(now2);
                  cardStartAtRef.current = now2;
                }}
                className="font-hand font-semibold px-3 py-1 rounded-lg"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                }}
              >
                Reshuffle
              </button>
            </div>
          </div>
        </div>
        <div className="px-5 py-4" style={{ background: 'var(--clay-card)' }}>
          <div className="mb-2 flex justify-between text-sm font-hand font-semibold" style={{ color: 'var(--ink-light)', fontSize: '15px' }}>
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="clay-progress mb-4">
            <div
              className="clay-progress-fill"
              style={{ width: `${progress}%`, background: 'var(--clay-accent)' }}
            />
          </div>

          <div className="flex justify-between text-sm font-hand font-semibold" style={{ color: 'var(--ink-light)', fontSize: '15px' }}>
            <span><span className="wax-seal" /> Mastered: {masteredCards.size}</span>
            <span>Mastery: {Math.round(masteryPercentage)}%</span>
          </div>
        </div>
      </div>

      <Flashcard 
        front={currentCard.front} 
        back={currentCard.back} 
        subject={currentCard.subject} 
      />

  <div className="flex items-center justify-between mt-6 animate-fade-up">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Previous card"
          className="clay-btn clay-btn-muted flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ padding: '8px 16px', fontSize: '16px' }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-3 mx-2">
          <button
            onClick={markAsNeedsReview}
            aria-label="Mark as needs review"
            className="clay-btn clay-btn-red flex items-center gap-2"
            style={{ padding: '8px 16px', fontSize: '16px', borderColor: '#7A2A20' }}
          >
            <X className="w-4 h-4" />
            <span className="hidden md:inline">Tricky</span>
          </button>

          <button
            onClick={markAsMastered}
            aria-label="Mark as mastered"
            className="clay-btn clay-btn-green flex items-center gap-2"
            style={{ padding: '8px 16px', fontSize: '16px' }}
          >
            <Check className="w-4 h-4" />
            <span className="hidden md:inline">Got it!</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          aria-label="Next card"
          className="clay-btn clay-btn-muted flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ padding: '8px 16px', fontSize: '16px' }}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;