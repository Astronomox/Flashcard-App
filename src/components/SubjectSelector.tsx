"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BookOpen, Globe, Calculator, FlaskConical, Palette, Music, Dna, Atom } from "lucide-react";

const subjectCategories = [
  { id: 'history', name: 'History', icon: BookOpen },
  { id: 'geography', name: 'Geography', icon: Globe },
  { id: 'math', name: 'Mathematics', icon: Calculator },
  { id: 'science', name: 'Science', icon: FlaskConical },
  { id: 'art', name: 'Art', icon: Palette },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'biology', name: 'Biology', icon: Dna },
  { id: 'chemistry', name: 'Chemistry', icon: Atom },
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Select Subject
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <ScrollArea className="h-64">
          <div className="grid grid-cols-2 gap-3">
            {filteredSubjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? "default" : "outline"}
                  className="h-20 flex flex-col items-center justify-center gap-2 py-4"
                  onClick={() => onSelectSubject(subject.id)}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-sm">{subject.name}</span>
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
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectSelector;