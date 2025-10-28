"use client";

import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import SubjectSelector from "@/components/SubjectSelector";
import FlashcardDeck from "@/components/FlashcardDeck";

// Actual educational flashcards for each subject
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
    },
    {
      id: "4",
      front: "Who wrote 'The Communist Manifesto'?",
      back: "Karl Marx and Friedrich Engels",
      subject: "History"
    },
    {
      id: "5",
      front: "What was the name of the ship that brought the Pilgrims to America in 1620?",
      back: "The Mayflower",
      subject: "History"
    },
    {
      id: "6",
      front: "Which Egyptian pharaoh was known for his tomb being discovered nearly intact?",
      back: "Tutankhamun (King Tut)",
      subject: "History"
    },
    {
      id: "7",
      front: "What year did the Berlin Wall fall?",
      back: "1989",
      subject: "History"
    },
    {
      id: "8",
      front: "Who was the British Prime Minister during most of World War II?",
      back: "Winston Churchill",
      subject: "History"
    },
    {
      id: "9",
      front: "What was the name of the first artificial satellite launched into space?",
      back: "Sputnik 1",
      subject: "History"
    },
    {
      id: "10",
      front: "Which ancient civilization built the city of Machu Picchu?",
      back: "The Incas",
      subject: "History"
    },
    {
      id: "11",
      front: "Who painted the ceiling of the Sistine Chapel?",
      back: "Michelangelo",
      subject: "History"
    },
    {
      id: "12",
      front: "What was the name of the plague that killed millions in Europe in the 14th century?",
      back: "The Black Death (Bubonic Plague)",
      subject: "History"
    },
    {
      id: "13",
      front: "Which document established the separation of powers in the United States government?",
      back: "The Constitution",
      subject: "History"
    },
    {
      id: "14",
      front: "Who was the first person to circumnavigate the globe?",
      back: "Ferdinand Magellan (though he died during the voyage, his crew completed it)",
      subject: "History"
    },
    {
      id: "15",
      front: "What was the name of the first permanent English settlement in America?",
      back: "Jamestown, Virginia (1607)",
      subject: "History"
    }
  ],
  geography: [
    {
      id: "16",
      front: "What is the capital of Australia?",
      back: "Canberra",
      subject: "Geography"
    },
    {
      id: "17",
      front: "Which is the longest river in the world?",
      back: "The Nile River",
      subject: "Geography"
    },
    {
      id: "18",
      front: "What is the smallest country in the world?",
      back: "Vatican City",
      subject: "Geography"
    },
    {
      id: "19",
      front: "Which ocean is the largest?",
      back: "The Pacific Ocean",
      subject: "Geography"
    },
    {
      id: "20",
      front: "What is the capital of Canada?",
      back: "Ottawa",
      subject: "Geography"
    },
    {
      id: "21",
      front: "Which continent is known as the 'Dark Continent'?",
      back: "Africa",
      subject: "Geography"
    },
    {
      id: "22",
      front: "What is the highest mountain in the world?",
      back: "Mount Everest",
      subject: "Geography"
    },
    {
      id: "23",
      front: "Which country has the most natural lakes?",
      back: "Canada",
      subject: "Geography"
    },
    {
      id: "24",
      front: "What is the capital of Brazil?",
      back: "Brasília",
      subject: "Geography"
    },
    {
      id: "25",
      front: "Which desert is the largest in the world?",
      back: "Antarctic Desert",
      subject: "Geography"
    },
    {
      id: "26",
      front: "What is the deepest point in the ocean?",
      back: "Mariana Trench",
      subject: "Geography"
    },
    {
      id: "27",
      front: "Which country is known as the Land of the Rising Sun?",
      back: "Japan",
      subject: "Geography"
    },
    {
      id: "28",
      front: "What is the capital of Egypt?",
      back: "Cairo",
      subject: "Geography"
    },
    {
      id: "29",
      front: "Which river flows through the Grand Canyon?",
      back: "Colorado River",
      subject: "Geography"
    },
    {
      id: "30",
      front: "What is the largest island in the world?",
      back: "Greenland",
      subject: "Geography"
    }
  ],
  math: [
    {
      id: "31",
      front: "What is the value of π (pi) to 3 decimal places?",
      back: "3.142",
      subject: "Mathematics"
    },
    {
      id: "32",
      front: "What is the quadratic formula?",
      back: "x = (-b ± √(b² - 4ac)) / (2a)",
      subject: "Mathematics"
    },
    {
      id: "33",
      front: "What is the Pythagorean theorem?",
      back: "a² + b² = c²",
      subject: "Mathematics"
    },
    {
      id: "34",
      front: "What is the formula for the area of a circle?",
      back: "A = πr²",
      subject: "Mathematics"
    },
    {
      id: "35",
      front: "What is the derivative of x²?",
      back: "2x",
      subject: "Mathematics"
    },
    {
      id: "36",
      front: "What is the sum of the angles in a triangle?",
      back: "180 degrees",
      subject: "Mathematics"
    },
    {
      id: "37",
      front: "What is the value of e (Euler's number) to 3 decimal places?",
      back: "2.718",
      subject: "Mathematics"
    },
    {
      id: "38",
      front: "What is the formula for the volume of a sphere?",
      back: "V = (4/3)πr³",
      subject: "Mathematics"
    },
    {
      id: "39",
      front: "What is the integral of 1/x?",
      back: "ln|x| + C",
      subject: "Mathematics"
    },
    {
      id: "40",
      front: "What is the name of a polygon with 12 sides?",
      back: "Dodecagon",
      subject: "Mathematics"
    },
    {
      id: "41",
      front: "What is the value of sin(90°)?",
      back: "1",
      subject: "Mathematics"
    },
    {
      id: "42",
      front: "What is the formula for compound interest?",
      back: "A = P(1 + r/n)^(nt)",
      subject: "Mathematics"
    },
    {
      id: "43",
      front: "What is the name of the sequence where each number is the sum of the two preceding ones?",
      back: "Fibonacci sequence",
      subject: "Mathematics"
    },
    {
      id: "44",
      front: "What is the determinant of a 2x2 matrix [a b; c d]?",
      back: "ad - bc",
      subject: "Mathematics"
    },
    {
      id: "45",
      front: "What is the formula for the circumference of a circle?",
      back: "C = 2πr",
      subject: "Mathematics"
    }
  ],
  science: [
    {
      id: "46",
      front: "What is the chemical symbol for gold?",
      back: "Au",
      subject: "Science"
    },
    {
      id: "47",
      front: "What is the speed of light in a vacuum?",
      back: "Approximately 299,792,458 meters per second",
      subject: "Science"
    },
    {
      id: "48",
      front: "What are the three states of matter?",
      back: "Solid, liquid, and gas",
      subject: "Science"
    },
    {
      id: "49",
      front: "What is the powerhouse of the cell?",
      back: "Mitochondria",
      subject: "Science"
    },
    {
      id: "50",
      front: "What is the chemical formula for water?",
      back: "H₂O",
      subject: "Science"
    },
    {
      id: "51",
      front: "What is the unit of electrical resistance?",
      back: "Ohm",
      subject: "Science"
    },
    {
      id: "52",
      front: "What gas do plants absorb from the atmosphere?",
      back: "Carbon dioxide (CO₂)",
      subject: "Science"
    },
    {
      id: "53",
      front: "What is the hardest natural substance on Earth?",
      back: "Diamond",
      subject: "Science"
    },
    {
      id: "54",
      front: "What is the study of earthquakes called?",
      back: "Seismology",
      subject: "Science"
    },
    {
      id: "55",
      front: "What is the largest organ in the human body?",
      back: "Skin",
      subject: "Science"
    },
    {
      id: "56",
      front: "What is the chemical symbol for silver?",
      back: "Ag",
      subject: "Science"
    },
    {
      id: "57",
      front: "What is the process by which plants make their food?",
      back: "Photosynthesis",
      subject: "Science"
    },
    {
      id: "58",
      front: "What is the unit of force in the metric system?",
      back: "Newton",
      subject: "Science"
    },
    {
      id: "59",
      front: "What is the study of heredity called?",
      back: "Genetics",
      subject: "Science"
    },
    {
      id: "60",
      front: "What is the chemical symbol for iron?",
      back: "Fe",
      subject: "Science"
    }
  ],
  art: [
    {
      id: "61",
      front: "Who painted the Mona Lisa?",
      back: "Leonardo da Vinci",
      subject: "Art"
    },
    {
      id: "62",
      front: "What art movement was Pablo Picasso associated with?",
      back: "Cubism",
      subject: "Art"
    },
    {
      id: "63",
      front: "What is the art of folding paper called?",
      back: "Origami",
      subject: "Art"
    },
    {
      id: "64",
      front: "Who sculpted David?",
      back: "Michelangelo",
      subject: "Art"
    },
    {
      id: "65",
      front: "What is the primary color that is not made by mixing other colors?",
      back: "Red, blue, or yellow",
      subject: "Art"
    },
    {
      id: "66",
      front: "What art technique uses small dots to create an image?",
      back: "Pointillism",
      subject: "Art"
    },
    {
      id: "67",
      front: "Who painted The Starry Night?",
      back: "Vincent van Gogh",
      subject: "Art"
    },
    {
      id: "68",
      front: "What is the art of beautiful handwriting called?",
      back: "Calligraphy",
      subject: "Art"
    },
    {
      id: "69",
      front: "What is the name of the famous painting by Edvard Munch?",
      back: "The Scream",
      subject: "Art"
    },
    {
      id: "70",
      front: "What is the art of carving or engraving on stone called?",
      back: "Sculpture",
      subject: "Art"
    },
    {
      id: "71",
      front: "Who painted the ceiling of the Sistine Chapel?",
      back: "Michelangelo",
      subject: "Art"
    },
    {
      id: "72",
      front: "What is the art movement characterized by exaggerated motion and clear detail?",
      back: "Baroque",
      subject: "Art"
    },
    {
      id: "73",
      front: "What is the name of the art style that emphasizes geometric shapes?",
      back: "Abstract art",
      subject: "Art"
    },
    {
      id: "74",
      front: "Who is known for his drip painting technique?",
      back: "Jackson Pollock",
      subject: "Art"
    },
    {
      id: "75",
      front: "What is the art of arranging type called?",
      back: "Typography",
      subject: "Art"
    }
  ],
  music: [
    {
      id: "76",
      front: "What is the highest female singing voice?",
      back: "Soprano",
      subject: "Music"
    },
    {
      id: "77",
      front: "How many keys does a standard piano have?",
      back: "88 keys",
      subject: "Music"
    },
    {
      id: "78",
      front: "What is the tempo marking for a slow piece of music?",
      back: "Adagio",
      subject: "Music"
    },
    {
      id: "79",
      front: "What is the name of the musical symbol that raises a note by a half step?",
      back: "Sharp (#)",
      subject: "Music"
    },
    {
      id: "80",
      front: "Who composed the 'Moonlight Sonata'?",
      back: "Ludwig van Beethoven",
      subject: "Music"
    },
    {
      id: "81",
      front: "What is the time signature of a waltz?",
      back: "3/4 time",
      subject: "Music"
    },
    {
      id: "82",
      front: "What is the lowest string on a standard guitar?",
      back: "Low E string",
      subject: "Music"
    },
    {
      id: "83",
      front: "What is the term for gradually getting louder in music?",
      back: "Crescendo",
      subject: "Music"
    },
    {
      id: "84",
      front: "What is the name of the musical staff with four lines?",
      back: "Treble clef (G clef)",
      subject: "Music"
    },
    {
      id: "85",
      front: "Who composed 'The Four Seasons'?",
      back: "Antonio Vivaldi",
      subject: "Music"
    },
    {
      id: "86",
      front: "What is the interval between two adjacent notes on a piano?",
      back: "A semitone (or half step)",
      subject: "Music"
    },
    {
      id: "87",
      front: "What is the term for a group of eight musicians?",
      back: "Octet",
      subject: "Music"
    },
    {
      id: "88",
      front: "What is the name of the musical symbol that looks like a curved line?",
      back: "Slur",
      subject: "Music"
    },
    {
      id: "89",
      front: "What is the term for playing notes smoothly and connected?",
      back: "Legato",
      subject: "Music"
    },
    {
      id: "90",
      front: "What is the name of the musical rest that lasts for four beats?",
      back: "Whole rest",
      subject: "Music"
    }
  ],
  biology: [
    {
      id: "91",
      front: "What is the basic unit of life?",
      back: "Cell",
      subject: "Biology"
    },
    {
      id: "92",
      front: "What process do plants use to make their own food?",
      back: "Photosynthesis",
      subject: "Biology"
    },
    {
      id: "93",
      front: "What is the powerhouse of the cell?",
      back: "Mitochondria",
      subject: "Biology"
    },
    {
      id: "94",
      front: "What is the study of heredity called?",
      back: "Genetics",
      subject: "Biology"
    },
    {
      id: "95",
      front: "What is the largest organ in the human body?",
      back: "Skin",
      subject: "Biology"
    },
    {
      id: "96",
      front: "What is the liquid component of blood called?",
      back: "Plasma",
      subject: "Biology"
    },
    {
      id: "97",
      front: "What is the process by which cells divide to form two identical cells?",
      back: "Mitosis",
      subject: "Biology"
    },
    {
      id: "98",
      front: "What is the name of the pigment that gives skin its color?",
      back: "Melanin",
      subject: "Biology"
    },
    {
      id: "99",
      front: "What is the name of the tube that connects the throat to the stomach?",
      back: "Esophagus",
      subject: "Biology"
    },
    {
      id: "100",
      front: "What is the name of the protein that carries oxygen in red blood cells?",
      back: "Hemoglobin",
      subject: "Biology"
    },
    {
      id: "101",
      front: "What is the name of the process by which plants lose water through their leaves?",
      back: "Transpiration",
      subject: "Biology"
    },
    {
      id: "102",
      front: "What is the name of the largest bone in the human body?",
      back: "Femur (thigh bone)",
      subject: "Biology"
    },
    {
      id: "103",
      front: "What is the name of the process by which organisms break down food to release energy?",
      back: "Cellular respiration",
      subject: "Biology"
    },
    {
      id: "104",
      front: "What is the name of the fluid that surrounds the brain and spinal cord?",
      back: "Cerebrospinal fluid",
      subject: "Biology"
    },
    {
      id: "105",
      front: "What is the name of the process by which DNA makes RNA?",
      back: "Transcription",
      subject: "Biology"
    }
  ],
  chemistry: [
    {
      id: "106",
      front: "What is the chemical symbol for gold?",
      back: "Au",
      subject: "Chemistry"
    },
    {
      id: "107",
      front: "What is the chemical formula for water?",
      back: "H₂O",
      subject: "Chemistry"
    },
    {
      id: "108",
      front: "What is the pH of pure water?",
      back: "7",
      subject: "Chemistry"
    },
    {
      id: "109",
      front: "What is the name of the table that organizes chemical elements?",
      back: "Periodic table",
      subject: "Chemistry"
    },
    {
      id: "110",
      front: "What is the name of the bond formed by sharing electrons?",
      back: "Covalent bond",
      subject: "Chemistry"
    },
    {
      id: "111",
      front: "What is the name of the negatively charged particle in an atom?",
      back: "Electron",
      subject: "Chemistry"
    },
    {
      id: "112",
      front: "What is the name of the process by which a solid turns directly into a gas?",
      back: "Sublimation",
      subject: "Chemistry"
    },
    {
      id: "113",
      front: "What is the chemical symbol for sodium?",
      back: "Na",
      subject: "Chemistry"
    },
    {
      id: "114",
      front: "What is the name of the positively charged particle in an atom?",
      back: "Proton",
      subject: "Chemistry"
    },
    {
      id: "115",
      front: "What is the name of the process by which a liquid turns into a gas?",
      back: "Evaporation",
      subject: "Chemistry"
    },
    {
      id: "116",
      front: "What is the chemical symbol for oxygen?",
      back: "O",
      subject: "Chemistry"
    },
    {
      id: "117",
      front: "What is the name of the bond formed by the transfer of electrons?",
      back: "Ionic bond",
      subject: "Chemistry"
    },
    {
      id: "118",
      front: "What is the name of the neutral particle in an atom?",
      back: "Neutron",
      subject: "Chemistry"
    },
    {
      id: "119",
      front: "What is the name of the process by which a gas turns into a liquid?",
      back: "Condensation",
      subject: "Chemistry"
    },
    {
      id: "120",
      front: "What is the chemical symbol for carbon?",
      back: "C",
      subject: "Chemistry"
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