"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, RotateCw, Check, X } from "lucide-react";
import Flashcard from "@/components/Flashcard";

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
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const markAsMastered = () => {
    setMasteredCards(prev => new Set(prev).add(currentCard.id));
    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  const markAsNeedsReview = () => {
    setMasteredCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;
  const masteryPercentage = cards.length > 0 ? (masteredCards.size / cards.length) * 100 : 0;

  if (cards.length === 0) {
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
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentIndex + 1} / {cards.length}
            </Badge>
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

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          className="flex items-center gap-2 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={markAsNeedsReview}
            className="flex items-center gap-2 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/30"
          >
            <X className="w-4 h-4" />
            Needs Review
          </Button>
          <Button 
            variant="outline" 
            onClick={markAsMastered}
            className="flex items-center gap-2 border-2 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
          >
            <Check className="w-4 h-4" />
            Mastered
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleNext} 
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-2 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardDeck;