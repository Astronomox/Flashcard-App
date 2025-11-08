"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, RotateCw, Check, X } from "lucide-react";
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
      <Card className="w-full max-w-md mx-auto border-2 border-amber-100 dark:border-amber-900/50">
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">No flashcards available for this subject.</p>
          <p className="text-sm mt-2">Try selecting a different subject.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-4 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{subject}</CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentIndex + 1} / {total}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  // reshuffle current deck
                  try {
                    const now = Date.now();
                    const minutes = Math.max(0, (now - cardStartAtRef.current) / 60000);
                    if (minutes > 0) addSubjectStudyTime(subject, minutes);
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error('FlashcardDeck timing error (reshuffle)', e);
                  }
                  const copy = shuffledCards.slice();
                  setShuffledCards(shuffle(copy));
                  setCurrentIndex(0);
                  const now2 = Date.now();
                  setCardStartAt(now2);
                  cardStartAtRef.current = now2;
                }}
                className="text-white/90 hover:text-white"
              >
                Reshuffle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mb-4 h-2" />
          
          <div className="flex justify-between text-sm">
            <span>Mastered: {masteredCards.size}</span>
            <span>Mastery: {Math.round(masteryPercentage)}%</span>
          </div>
        </CardContent>
      </Card>

      <Flashcard 
        front={currentCard.front} 
        back={currentCard.back} 
        subject={currentCard.subject} 
      />

  <div className="flex items-center justify-between mt-6 animate-fade-up">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Previous card"
          className="rounded-full px-4 py-2.5 flex items-center gap-2 border-2 border-indigo-200 text-indigo-700 bg-white/60 hover:bg-indigo-50 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:border-indigo-800 dark:text-indigo-300 dark:bg-slate-800/60 dark:hover:bg-indigo-900/30"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-3 mx-2">
          <Button
            variant="ghost"
            onClick={markAsNeedsReview}
            aria-label="Mark as needs review"
            className="rounded-full px-4 py-2.5 flex items-center gap-2 border-2 border-amber-300 text-amber-700 bg-white/60 hover:bg-amber-50 shadow-sm transition-colors dark:border-amber-800 dark:text-amber-300 dark:bg-slate-800/60 dark:hover:bg-amber-900/20"
          >
            <X className="w-4 h-4" />
            <span className="hidden md:inline">Needs Review</span>
          </Button>

          <Button
            variant="ghost"
            onClick={markAsMastered}
            aria-label="Mark as mastered"
            className="rounded-full px-4 py-2.5 flex items-center gap-2 border-2 border-green-300 text-green-700 bg-white/60 hover:bg-green-50 shadow-sm transition-colors dark:border-green-800 dark:text-green-300 dark:bg-slate-800/60 dark:hover:bg-green-900/20"
          >
            <Check className="w-4 h-4" />
            <span className="hidden md:inline">Mastered</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          aria-label="Next card"
          className="rounded-full px-4 py-2.5 flex items-center gap-2 border-2 border-indigo-200 text-indigo-700 bg-white/60 hover:bg-indigo-50 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:border-indigo-800 dark:text-indigo-300 dark:bg-slate-800/60 dark:hover:bg-indigo-900/30"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardDeck;