import { useImmer } from "use-immer";
import { WordsByLength } from "./wordsByLength";

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
        if (!draft[word.length]) {
          draft[word.length] = [];
        }
        draft[word.length].push(word);
      });
    },
  };

  return collection;
}
