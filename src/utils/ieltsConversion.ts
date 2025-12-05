// IELTS Listening score conversion (raw score to band score)
const listeningConversion: { [key: number]: number } = {
  40: 9.0, 39: 9.0, 38: 8.5, 37: 8.5, 36: 8.0, 35: 8.0, 34: 7.5, 33: 7.5, 32: 7.5,
  31: 7.0, 30: 7.0, 29: 6.5, 28: 6.5, 27: 6.5, 26: 6.5, 25: 6.0, 24: 6.0, 23: 6.0,
  22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5, 17: 5.0, 16: 5.0, 15: 4.5, 14: 4.5,
  13: 4.5, 12: 4.0, 11: 4.0, 10: 4.0, 9: 3.5, 8: 3.5, 7: 3.5, 6: 3.0, 5: 3.0,
  4: 2.5, 3: 2.5, 2: 2.0, 1: 2.0, 0: 0.0
};

// IELTS Academic Reading score conversion (raw score to band score)
const readingAcademicConversion: { [key: number]: number } = {
  40: 9.0, 39: 9.0, 38: 8.5, 37: 8.5, 36: 8.0, 35: 8.0, 34: 7.5, 33: 7.5, 32: 7.0,
  31: 7.0, 30: 6.5, 29: 6.5, 28: 6.5, 27: 6.0, 26: 6.0, 25: 6.0, 24: 5.5, 23: 5.5,
  22: 5.5, 21: 5.0, 20: 5.0, 19: 5.0, 18: 4.5, 17: 4.5, 16: 4.5, 15: 4.0, 14: 4.0,
  13: 3.5, 12: 3.5, 11: 3.0, 10: 3.0, 9: 2.5, 8: 2.5, 7: 2.5, 6: 2.0, 5: 2.0,
  4: 1.5, 3: 1.5, 2: 1.0, 1: 1.0, 0: 0.0
};

// IELTS General Training Reading score conversion (raw score to band score)
const readingGeneralConversion: { [key: number]: number } = {
  40: 9.0, 39: 8.5, 38: 8.0, 37: 8.0, 36: 7.5, 35: 7.0, 34: 7.0, 33: 6.5, 32: 6.5,
  31: 6.0, 30: 6.0, 29: 5.5, 28: 5.5, 27: 5.5, 26: 5.0, 25: 5.0, 24: 5.0, 23: 5.0,
  22: 4.5, 21: 4.5, 20: 4.5, 19: 4.5, 18: 4.0, 17: 4.0, 16: 4.0, 15: 3.5, 14: 3.5,
  13: 3.0, 12: 3.0, 11: 3.0, 10: 2.5, 9: 2.5, 8: 2.5, 7: 2.0, 6: 2.0, 5: 1.5,
  4: 1.5, 3: 1.0, 2: 1.0, 1: 1.0, 0: 0.0
};

export const convertListeningScore = (rawScore: number): number => {
  if (rawScore < 0 || rawScore > 40) return 0;
  return listeningConversion[rawScore] || 0;
};

export const convertReadingScore = (rawScore: number, testType: 'academic' | 'general' = 'academic'): number => {
  if (rawScore < 0 || rawScore > 40) return 0;
  const conversionTable = testType === 'general' ? readingGeneralConversion : readingAcademicConversion;
  return conversionTable[rawScore] || 0;
};

export const calculateOverallBand = (
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number => {
  const average = (listening + reading + writing + speaking) / 4;
  // Round to nearest 0.5
  return Math.round(average * 2) / 2;
};
