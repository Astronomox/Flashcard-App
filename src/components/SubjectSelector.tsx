"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BookOpen, Globe, Calculator, FlaskConical, Palette, Music, Dna, Atom } from "lucide-react";

const subjectCategories = [
  { id: 'history', name: 'History', icon: BookOpen, color: 'from-amber-400 to-orange-500' },
  { id: 'geography', name: 'Geography', icon: Globe, color: 'from-emerald-400 to-teal-500' },
  { id: 'math', name: 'Mathematics', icon: Calculator, color: 'from-blue-400 to-indigo-500' },
  { id: 'science', name: 'Science', icon: FlaskConical, color: 'from-purple-400 to-fuchsia-500' },
  { id: 'art', name: 'Art', icon: Palette, color: 'from-pink-400 to-rose-500' },
  { id: 'music', name: 'Music', icon: Music, color: 'from-cyan-400 to-sky-500' },
  { id: 'biology', name: 'Biology', icon: Dna, color: 'from-green-400 to-lime-500' },
  { id: 'chemistry', name: 'Chemistry', icon: Atom, color: 'from-violet-400 to-purple-500' },
];

interface SubjectSelectorProps {
  onSelectSubject: (subject: string) => void;
  selectedSubject: string | null;
}

const SubjectSelector = ({ onSelectSubject, selectedSubject }: SubjectSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjectCategories.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-indigo-100 dark:border-indigo-900/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Select Subject
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-indigo-200 focus:border-indigo-400"
          />
        </div>
        
        <ScrollArea className="h-64">
          <div className="grid grid-cols-2 gap-3">
            {filteredSubjects.map((subject) => {
              const IconComponent = subject.icon;
              const isSelected = selectedSubject === subject.id;
              return (
                <Button
                  key={subject.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all hover:scale-105 ${
                    isSelected 
                      ? `bg-gradient-to-r ${subject.color} text-white border-0 shadow-md` 
                      : "border-2 border-indigo-200 hover:border-indigo-400"
                  }`}
                  onClick={() => onSelectSubject(subject.id)}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-sm font-medium">{subject.name}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-4">
          <Input
            placeholder="Or enter custom subject..."
            value={selectedSubject && !subjectCategories.find(s => s.id === selectedSubject) ? selectedSubject : ''}
            onChange={(e) => onSelectSubject(e.target.value)}
            className="border-2 border-indigo-200 focus:border-indigo-400"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectSelector;