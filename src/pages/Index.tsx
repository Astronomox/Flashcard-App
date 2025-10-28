"use client";

import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import SubjectSelector from "@/components/SubjectSelector";
import FlashcardDeck from "@/components/FlashcardDeck";

// Sample flashcard data
const sampleFlashcards = {
  history: [
    {
      id: "1",
      front: "Who was the first President of the United States?",
      back: "George Washington",
      subject: "History"
    },
    {
      id: "2",
      front: "In which year did World War II end?",
      back: "1945",
      subject: "History"
    },
    {
      id: "3",
      front: "What ancient wonder of the world was located in Alexandria?",
      back: "The Lighthouse of Alexandria (Pharos of Alexandria)",
      subject: "History"
    }
  ],
  geography: [
    {
      id: "4",
      front: "What is the capital of Australia?",
      back: "Canberra",
      subject: "Geography"
    },
    {
      id: "5",
      front: "Which is the longest river in the world?",
      back: "The Nile River",
      subject: "Geography"
    },
    {
      id: "6",
      front: "What is the smallest country in the world?",
      back: "Vatican City",
      subject: "Geography"
    }
  ],
  math: [
    {
      id: "7",
      front: "What is the value of π (pi) to 3 decimal places?",
      back: "3.142",
      subject: "Mathematics"
    },
    {
      id: "8",
      front: "What is the quadratic formula?",
      back: "x = (-b ± √(b² - 4ac)) / (2a)",
      subject: "Mathematics"
    },
    {
      id: "9",
      front: "What is the Pythagorean theorem?",
      back: "a² + b² = c²",
      subject: "Mathematics"
    }
  ],
  science: [
    {
      id: "10",
      front: "What is the chemical symbol for gold?",
      back: "Au",
      subject: "Science"
    },
    {
      id: "11",
      front: "What is the speed of light in a vacuum?",
      back: "Approximately 299,792,458 meters per second",
      subject: "Science"
    },
    {
      id: "12",
      front: "What are the three states of matter?",
      back: "Solid, liquid, and gas",
      subject: "Science"
    }
  ]
};

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Academic Study Flashcards</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                  className="text-blue-600 hover:text-blue-800 font-medium"
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