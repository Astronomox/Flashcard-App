"use client";

import React, { useState } from 'react';
import { RotateCw } from "lucide-react";
import MathText from "@/components/MathText";

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
      <div
        className="h-64 cursor-pointer relative card-outer animate-fade-up clay-surface"
        onClick={handleFlip}
        role="button"
        aria-pressed={isFlipped}
      >
        <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          {/* FRONT */}
          <div className="front-content paper-surface" style={{ borderRadius: 'calc(var(--radius) - 3px)' }}>
            <div className="label-handwritten text-sm mb-2" style={{ fontSize: '15px' }}>
              <span className="wax-seal" /> {subject}
            </div>
            <MathText
              text={front}
              className="text-xl font-display font-semibold text-center px-4"
              style={{ color: 'var(--ink)', lineHeight: '1.5' }}
            />
            <div className="mt-4 font-hand" style={{ color: 'var(--ink-faint)', fontSize: '15px' }}>
              tap to reveal
            </div>
          </div>
          {/* BACK */}
          <div className="back-content paper-surface" style={{ borderRadius: 'calc(var(--radius) - 3px)', borderLeftColor: '#A0C8A0' }}>
            <div className="label-handwritten text-sm mb-2" style={{ color: 'var(--green-clay)', fontSize: '15px' }}>
              Answer
            </div>
            <MathText
              text={back}
              className="text-lg font-body font-medium text-center px-4"
              style={{ color: 'var(--ink)', lineHeight: '1.7' }}
            />
            <div className="mt-4 font-hand" style={{ color: 'var(--ink-faint)', fontSize: '15px' }}>
              tap to flip back
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 animate-fade-up">
        <button
          onClick={handleFlip}
          className="clay-btn flex items-center gap-2"
          style={{ fontSize: '17px' }}
        >
          <RotateCw className="w-4 h-4" />
          Flip Card
        </button>
      </div>
    </div>
  );
};

export default Flashcard;