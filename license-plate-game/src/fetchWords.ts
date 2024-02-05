import { WordsByLength, groupWordsByLength } from "./wordsByLength";

export async function fetchWords(pair: string): Promise<WordList> {
  const res = await fetch(`http://localhost:3000/${pair}.txt`);
  const text = await res.text();
  const words = text.split("\n");
  return newWordList(words);
}

type WordList = {
  contains: (word: string) => boolean;
  getWordsByLength: () => WordsByLength;
  getWordsByLengthSummary: () => Record<number, number>;
};

function newWordList(words: string[]): WordList {
  const wordsByLength = groupWordsByLength(words);

  return {
    getWordsByLength: () => wordsByLength,
    getWordsByLengthSummary: () => {
      return Object.fromEntries(
        Object.entries(wordsByLength).map(([length, words]) => [
          length,
          words.length,
        ])
      );
    },
    contains: (word) => {
      const words = wordsByLength[word.length];

      if (!words) {
        return false;
      }

      const index = words.indexOf(word.toLowerCase());

      return index > -1;
    },
  };
}
