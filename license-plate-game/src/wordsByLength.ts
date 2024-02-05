export type WordsByLength = Record<number, string[]>;

export function groupWordsByLength(words: string[]): WordsByLength {
  const wordsByLength: WordsByLength = {};
  words.forEach((word) => {
    if (!wordsByLength[word.length]) {
      wordsByLength[word.length] = [];
    }
    wordsByLength[word.length]!.push(word);
  });
  return wordsByLength;
}
