import { useImmer } from "use-immer";
import { WordsByLength, addWord } from "./wordsByLength";

type WordCollection = {
  getWordsByLength: () => WordsByLength;
  addWord: (word: string) => void;
};

export function useWordCollection(): WordCollection {
  const [words, updateWords] = useImmer<WordsByLength>([]);

  const collection: WordCollection = {
    getWordsByLength: () => words,
    addWord: (word) => {
      updateWords((draft) => {
        addWord(draft)(word);
      });
    },
  };

  return collection;
}
