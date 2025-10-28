"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Clock, Target } from "lucide-react";

interface StudyStatsProps {
  totalCards: number;
  masteredCards: number;
  studyTime: number; // in minutes
  accuracy: number; // percentage
}

const StudyStats = ({ totalCards, masteredCards, studyTime, accuracy }: StudyStatsProps) => {
  const masteryPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;
  const remainingCards = totalCards - masteredCards;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Study Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cards</p>
              <p className="text-xl font-bold">{totalCards}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mastered</p>
              <p className="text-xl font-bold">{masteredCards}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Time</p>
              <p className="text-xl font-bold">{studyTime}m</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-xl font-bold">{accuracy}%</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Mastery Progress</span>
            <span>{Math.round(masteryPercentage)}%</span>
          </div>
          <Progress value={masteryPercentage} className="h-2" />
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>{remainingCards} cards remaining to master</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyStats;