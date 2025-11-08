"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface FlashcardProps {
  front: string;
  back: string;
  subject: string;
}

const Flashcard = ({ front, back, subject }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card
        className="h-64 cursor-pointer relative card-outer animate-fade-up"
        onClick={handleFlip}
        role="button"
        aria-pressed={isFlipped}
      >
        <CardContent className="h-full p-0">
          <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
            <div className="front-content p-6 bg-gradient-to-br from-[hsl(var(--primary)/0.06)] to-[hsl(var(--accent)/0.04)] dark:from-[hsl(var(--primary)/0.12)] dark:to-[hsl(var(--accent)/0.06)]">
              <div className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-2">{subject}</div>
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">{front}</div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Click to flip</div>
            </div>
            <div className="back-content p-6 bg-gradient-to-br from-[hsl(var(--primary)/0.06)] to-[hsl(var(--accent)/0.04)] dark:from-[hsl(var(--primary)/0.12)] dark:to-[hsl(var(--accent)/0.06)]">
              <div className="text-sm text-green-600 dark:text-green-300 font-medium mb-2">Answer</div>
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">{back}</div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Click to flip back</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-4 animate-fade-up">
        <Button 
          variant="default" 
          onClick={handleFlip} 
          className="flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] hover:from-[hsl(var(--primary))] hover:to-[hsl(var(--secondary))] text-white shadow-sm"
        >
          <RotateCw className="w-4 h-4" />
          Flip Card
        </Button>
      </div>
    </div>
  );
};

export default Flashcard;