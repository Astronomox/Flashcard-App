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
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">No flashcards available for this subject.</p>
          <p className="text-sm mt-2">Try selecting a different subject.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{subject}</CardTitle>
          <Badge variant="secondary">
            {currentIndex + 1} / {cards.length}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mb-4" />
          
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
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={markAsNeedsReview}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Needs Review
          </Button>
          <Button 
            variant="outline" 
            onClick={markAsMastered}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mastered
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleNext} 
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardDeck;