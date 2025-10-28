"use client";

import React, { useState } from 'react';
import { BookOpen, Globe, Calculator, Flask, Palette, Music, Microscope, Atom } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const subjects = [
  { 
    id: 'history', 
    name: 'History', 
    icon: BookOpen,
    description: 'Explore historical events and figures',
    color: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'geography', 
    name: 'Geography', 
    icon: Globe,
    description: 'Learn about countries, capitals, and landscapes',
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    id: 'math', 
    name: 'Mathematics', 
    icon: Calculator,
    description: 'Master equations, formulas, and theorems',
    color: 'from-blue-500 to-indigo-500'
  },
  { 
    id: 'science', 
    name: 'Science', 
    icon: Flask,
    description: 'Discover biology, chemistry, and physics',
    color: 'from-purple-500 to-fuchsia-500'
  },
  { 
    id: 'art', 
    name: 'Art', 
    icon: Palette,
    description: 'Study artists, movements, and techniques',
    color: 'from-rose-500 to-pink-500'
  },
  { 
    id: 'music', 
    name: 'Music', 
    icon: Music,
    description: 'Learn about composers, theory, and instruments',
    color: 'from-violet-500 to-purple-500'
  },
  { 
    id: 'biology', 
    name: 'Biology', 
    icon: Microscope,
    description: 'Understand living organisms and ecosystems',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'chemistry', 
    name: 'Chemistry', 
    icon: Atom,
    description: 'Explore elements, compounds, and reactions',
    color: 'from-cyan-500 to-blue-500'
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
          Choose from {subjects.length} academic subjects to begin your study session
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
            
            return (
              <div
                key={subject.id}
                onClick={() => onSelectSubject(subject.id)}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  flex items-start gap-4
                  ${isSelected 
                    ? `border-${subject.color.split(' ')[0].split('-')[1]}-500 bg-${subject.color.split(' ')[0].split('-')[1]}-50 dark:bg-${subject.color.split(' ')[0].split('-')[1]}-900/20` 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                  ${isSelected ? 'ring-2 ring-offset-2 ring-' + subject.color.split(' ')[0].split('-')[1] + '-500 ring-opacity-30' : ''}
                `}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${subject.color} text-white`}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{subject.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{subject.description}</p>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    100 flashcards available
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