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
        className={`h-64 cursor-pointer transition-all duration-700 transform-style-3d relative preserve-text-normal ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleFlip}
      >
        <CardContent className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
          {!isFlipped ? (
            <div className="text-center">
              <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium mb-2">{subject}</div>
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">{front}</div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Click to flip</div>
            </div>
          ) : (
            <div className="text-center back-content">
              <div className="text-sm text-green-600 dark:text-green-300 font-medium mb-2">Answer</div>
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">{back}</div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Click to flip back</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-4">
        <Button 
          variant="default" 
          onClick={handleFlip} 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
        >
          <RotateCw className="w-4 h-4" />
          Flip Card
        </Button>
      </div>
    </div>
  );
};

export default Flashcard;