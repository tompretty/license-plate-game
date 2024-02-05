import {
  DefaultButton,
  ITextField,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { onChangeHandler } from "../fluentUiHelpers";
import { fetchWords } from "../fetchWords";
import { AnswersList } from "../AnswersList";
import { useWordCollection } from "../useWordsByLength";
import { AnswersSummaryList } from "../AnswersSummaryList";

type PlayGameProps = {
  pair: string;
  onRevealClicked: () => void;
};

export function PlayGame({ pair, onRevealClicked }: PlayGameProps) {
  const {
    data: wordList,
    isPending,
    error,
  } = useQuery({
    queryKey: [pair],
    queryFn: () => fetchWords(pair),
  });

  const [guess, setGuess] = useState("");

  const guessRef = useRef<ITextField>(null);

  useEffect(() => {
    guessRef.current?.focus();
  }, []);

  const guessedWords = useWordCollection();

  function onGuessSubmitted(event: React.FormEvent) {
    event.preventDefault();

    if (isPending || error) {
      // TODO: something better
      return;
    }

    if (!wordList.contains(guess)) {
      // TODO: something better
      return;
    }

    guessedWords.addWord(guess);
    setGuess("");

    guessRef.current?.focus();
  }

  const [showSummary, setShowSummary] = useState(false);

  return (
    <>
      <form onSubmit={onGuessSubmitted}>
        <Stack tokens={{ childrenGap: 16 }}>
          <TextField
            componentRef={guessRef}
            label="Word"
            value={guess}
            onChange={onChangeHandler((value) => setGuess(value.toUpperCase()))}
          />

          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton type="submit" text="Submit" />
            <DefaultButton
              type="button"
              text={showSummary ? "Hide summary" : "Show summary"}
              onClick={() => setShowSummary((b) => !b)}
            />
          </Stack>
        </Stack>
      </form>

      {showSummary && (
        <div>
          <h2>Summary</h2>

          {wordList && (
            <AnswersSummaryList
              wordsByLengthSummary={wordList.getWordsByLengthSummary()}
            />
          )}
        </div>
      )}

      <div>
        <h2>Answers</h2>

        <div>
          <PrimaryButton onClick={onRevealClicked} text="Reveal" />
        </div>

        <AnswersList
          wordsByLength={guessedWords.getWordsByLength()}
          label="Guessed words"
        />
      </div>
    </>
  );
}
