"use client";

import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import SubjectSelector from "@/components/SubjectSelector";
import FlashcardDeck from "@/components/FlashcardDeck";

// Generate flashcards for each subject
const generateFlashcards = () => {
  // History flashcards
  const historyCards = Array.from({ length: 100 }, (_, i) => ({
    id: `history-${i + 1}`,
    front: `History Question ${i + 1}`,
    back: `History Answer ${i + 1}`,
    subject: "History"
  }));
  
  // Geography flashcards
  const geographyCards = Array.from({ length: 100 }, (_, i) => ({
    id: `geography-${i + 1}`,
    front: `Geography Question ${i + 1}`,
    back: `Geography Answer ${i + 1}`,
    subject: "Geography"
  }));
  
  // Math flashcards
  const mathCards = Array.from({ length: 100 }, (_, i) => ({
    id: `math-${i + 1}`,
    front: `Math Question ${i + 1}`,
    back: `Math Answer ${i + 1}`,
    subject: "Mathematics"
  }));
  
  // Science flashcards
  const scienceCards = Array.from({ length: 100 }, (_, i) => ({
    id: `science-${i + 1}`,
    front: `Science Question ${i + 1}`,
    back: `Science Answer ${i + 1}`,
    subject: "Science"
  }));
  
  // Art flashcards
  const artCards = Array.from({ length: 100 }, (_, i) => ({
    id: `art-${i + 1}`,
    front: `Art Question ${i + 1}`,
    back: `Art Answer ${i + 1}`,
    subject: "Art"
  }));
  
  // Music flashcards
  const musicCards = Array.from({ length: 100 }, (_, i) => ({
    id: `music-${i + 1}`,
    front: `Music Question ${i + 1}`,
    back: `Music Answer ${i + 1}`,
    subject: "Music"
  }));
  
  // Biology flashcards
  const biologyCards = Array.from({ length: 100 }, (_, i) => ({
    id: `biology-${i + 1}`,
    front: `Biology Question ${i + 1}`,
    back: `Biology Answer ${i + 1}`,
    subject: "Biology"
  }));
  
  // Chemistry flashcards
  const chemistryCards = Array.from({ length: 100 }, (_, i) => ({
    id: `chemistry-${i + 1}`,
    front: `Chemistry Question ${i + 1}`,
    back: `Chemistry Answer ${i + 1}`,
    subject: "Chemistry"
  }));

  return {
    history: historyCards,
    geography: geographyCards,
    math: mathCards,
    science: scienceCards,
    art: artCards,
    music: musicCards,
    biology: biologyCards,
    chemistry: chemistryCards
  };
};

const sampleFlashcards = generateFlashcards();

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Academic Study Flashcards
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Master your subjects with interactive flashcards. Select a subject to get started!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!selectedSubject ? (
            <SubjectSelector 
              onSelectSubject={handleSelectSubject} 
              selectedSubject={selectedSubject} 
            />
          ) : (
            <div>
              <div className="mb-6">
                <button 
                  onClick={handleBackToSubjects}
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  ← Back to Subjects
                </button>
              </div>
              <FlashcardDeck 
                subject={selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} 
                cards={sampleFlashcards[selectedSubject as keyof typeof sampleFlashcards] || []} 
              />
            </div>
          )}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;