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
        className={`h-64 cursor-pointer transition-transform duration-700 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleFlip}
      >
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          {!isFlipped ? (
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{subject}</div>
              <div className="text-xl font-semibold">{front}</div>
              <div className="mt-4 text-sm text-muted-foreground">Click to flip</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Answer</div>
              <div className="text-xl font-semibold">{back}</div>
              <div className="mt-4 text-sm text-muted-foreground">Click to flip back</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={handleFlip} className="flex items-center gap-2">
          <RotateCw className="w-4 h-4" />
          Flip Card
        </Button>
      </div>
    </div>
  );
};

export default Flashcard;