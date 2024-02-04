import { ITextField, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { onChangeHandler } from "../fluentUiHelpers";
import { fetchWords } from "../fetchWords";
import { AnswersList } from "../AnswersList";
import { WordsByLength } from "../wordsByLength";

type PlayGameProps = {
  pair: string;
  onRevealClicked: () => void;
};

export function PlayGame({ pair, onRevealClicked }: PlayGameProps) {
  const { data, isPending, error } = useQuery({
    queryKey: [pair],
    queryFn: () => fetchWords(pair),
  });

  const [guess, setGuess] = useState("");

  const guessRef = useRef<ITextField>(null);

  useEffect(() => {
    guessRef.current?.focus();
  }, []);

  const [guessedWords, updateGuessedWords] = useImmer<WordsByLength>({});

  function onGuessSubmitted(event: React.FormEvent) {
    event.preventDefault();

    if (isPending || error) {
      // TODO: something better
      return;
    }

    const index = data.indexOf(guess.toLowerCase());

    if (index === -1) {
      // TODO: something better
      return;
    }

    updateGuessedWords((draft) => {
      if (!draft[guess.length]) {
        draft[guess.length] = [];
      }
      draft[guess.length].push(guess);
    });

    setGuess("");

    guessRef.current?.focus();
  }

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

          <Stack.Item>
            <PrimaryButton type="submit" text="Submit" />
          </Stack.Item>
        </Stack>
      </form>

      <div>
        <h2>Answers</h2>

        <div>
          <PrimaryButton onClick={onRevealClicked} text="Reveal" />
        </div>

        <AnswersList wordsByLength={guessedWords} />
      </div>
    </>
  );
}
