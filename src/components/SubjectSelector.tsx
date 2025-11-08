"use client";

import React, { useState } from 'react';
import { BookOpen, Globe, Calculator, Beaker, Palette, Music, Microscope, Atom } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const subjects = [
  { 
    id: 'history', 
    name: 'History', 
    icon: BookOpen,
    description: 'Explore historical events and figures',
    gradient: ['#f59e0b', '#fb923c']
  },
  { 
    id: 'geography', 
    name: 'Geography', 
    icon: Globe,
    description: 'Learn about countries, capitals, and landscapes',
    gradient: ['#10b981', '#14b8a6']
  },
  { 
    id: 'math', 
    name: 'Mathematics', 
    icon: Calculator,
    description: 'Master equations, formulas, and theorems',
    gradient: ['#3b82f6', '#6366f1']
  },
  { 
    id: 'science', 
    name: 'Science', 
    icon: Beaker,
    description: 'Discover biology, chemistry, and physics',
    gradient: ['#8b5cf6', '#d946ef']
  },
  { 
    id: 'art', 
    name: 'Art', 
    icon: Palette,
    description: 'Study artists, movements, and techniques',
    gradient: ['#fb7185', '#ec4899']
  },
  { 
    id: 'music', 
    name: 'Music', 
    icon: Music,
    description: 'Learn about composers, theory, and instruments',
    gradient: ['#7c3aed', '#6d28d9']
  },
  { 
    id: 'biology', 
    name: 'Biology', 
    icon: Microscope,
    description: 'Understand living organisms and ecosystems',
    gradient: ['#10b981', '#059669']
  },
  { 
    id: 'chemistry', 
    name: 'Chemistry', 
    icon: Atom,
    description: 'Explore elements, compounds, and reactions',
    gradient: ['#06b6d4', '#3b82f6']
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select a Subject</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Choose from {subjects.length} subjects to begin your study session
        </p>
        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubjects.map((subject) => {
            const IconComponent = subject.icon;
            const isSelected = selectedSubject === subject.id;
            const gradientStyle = { background: `linear-gradient(90deg, ${subject.gradient[0]}, ${subject.gradient[1]})` };

            return (
              <div
                key={subject.id}
                onClick={() => onSelectSubject(subject.id)}
                className={
                  `p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 shadow-sm hover:scale-[1.01]` +
                  (isSelected ? ' border-transparent ring-2 ring-offset-2 ring-opacity-30' : ' border-gray-200 dark:border-gray-700')
                }
                style={isSelected ? { boxShadow: `0 8px 30px ${subject.gradient[0]}30` } : undefined}
              >
                <div className="p-3 rounded-lg text-white flex items-center justify-center" style={gradientStyle}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{subject.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{subject.description}</p>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    1000 flashcards available
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