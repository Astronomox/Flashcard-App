"use client";

import React, { useState } from 'react';
import { BookOpen, Globe, Calculator, Beaker, Palette, Music, Microscope, Atom } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const subjects = [
  {
    id: 'history',
    name: 'History',
    icon: BookOpen,
    description: 'Explore historical events and figures',
    clayColor: '#FFE0B2',
    clayBorder: '#FFA726',
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: Globe,
    description: 'Learn about countries, capitals, and landscapes',
    clayColor: '#C8E6C9',
    clayBorder: '#66BB6A',
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: Calculator,
    description: 'Master equations, formulas, and theorems',
    clayColor: '#B3E5FC',
    clayBorder: '#29B6F6',
  },
  {
    id: 'science',
    name: 'Science',
    icon: Beaker,
    description: 'Discover biology, chemistry, and physics',
    clayColor: '#E1BEE7',
    clayBorder: '#AB47BC',
  },
  {
    id: 'art',
    name: 'Art',
    icon: Palette,
    description: 'Study artists, movements, and techniques',
    clayColor: '#F8BBD0',
    clayBorder: '#EC407A',
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    description: 'Learn about composers, theory, and instruments',
    clayColor: '#D1C4E9',
    clayBorder: '#7E57C2',
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: Microscope,
    description: 'Understand living organisms and ecosystems',
    clayColor: '#DCEDC8',
    clayBorder: '#8BC34A',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: Atom,
    description: 'Explore elements, compounds, and reactions',
    clayColor: '#B2EBF2',
    clayBorder: '#00BCD4',
  }
];

const SubjectSelector = ({ onSelectSubject, selectedSubject }: {
  onSelectSubject: (subject: string) => void;
  selectedSubject: string | null;
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clay-surface p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold mb-2" style={{ color: 'var(--ink)' }}>
          Select a Subject
        </h2>
        <p className="font-body mb-4" style={{ color: 'var(--ink-light)' }}>
          Choose from {subjects.length} subjects to begin your study session
        </p>
        <input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="clay-input max-w-md"
        />
      </div>

      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubjects.map((subject) => {
            const IconComponent = subject.icon;
            const isSelected = selectedSubject === subject.id;

            return (
              <div
                key={subject.id}
                onClick={() => onSelectSubject(subject.id)}
                className="clay-surface cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  borderColor: isSelected ? 'var(--clay-accent)' : 'var(--clay-dark)',
                  borderWidth: isSelected ? '3px' : '3px',
                }}
              >
                <div
                  className="p-3 rounded-xl flex items-center justify-center"
                  style={{
                    background: subject.clayColor,
                    border: `2.5px solid ${subject.clayBorder}`,
                    boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.5), inset -1px -1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <IconComponent size={24} style={{ color: subject.clayBorder }} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--ink)' }}>
                    {subject.name}
                  </h3>
                  <p className="font-body text-sm" style={{ color: 'var(--ink-light)' }}>
                    {subject.description}
                  </p>
                  <div className="mt-2 font-hand font-semibold" style={{ color: 'var(--ink-faint)', fontSize: '14px' }}>
                    <span className="wax-seal" /> 1000 flashcards
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SubjectSelector;