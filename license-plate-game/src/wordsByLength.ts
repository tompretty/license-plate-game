export type WordsByLength = Record<number, string[]>;

export function groupWordsByLength(words: string[]): WordsByLength {
  const wordsByLength: WordsByLength = {};
  words.forEach(addWord(wordsByLength));
  return wordsByLength;
}

export function addWord(wordsByLength: WordsByLength) {
  function add(word: string) {
    if (!wordsByLength[word.length]) {
      wordsByLength[word.length] = [];
    }
    wordsByLength[word.length]!.push(word);
  }
  return add;
}
