import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ITextField, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { onChangeHandler } from "./fluentUiHelpers";
import { useImmer } from "use-immer";

function App() {
  const [page, setPage] = useState<PageKind>("ENTER");
  const [pair, setPair] = useState("");

  if (page === "ENTER") {
    return (
      <EnterPairPage
        onPairSelected={(pair) => {
          setPage("PLAY");
          setPair(pair);
        }}
      />
    );
  } else if (page === "PLAY") {
    return (
      <PlayGamePage pair={pair} onRevealClicked={() => setPage("REVEAL")} />
    );
  } else if (page === "REVEAL") {
    return <RevealPage pair={pair} onRestartClicked={() => setPage("ENTER")} />;
  }
}

export default App;

type PageKind = "ENTER" | "PLAY" | "REVEAL";

// ---- Pages ---- //

type EnterPairPageProps = {
  onPairSelected: (pair: string) => void;
};

function EnterPairPage({ onPairSelected }: EnterPairPageProps) {
  const [firstLetter, setFirstLetter] = useState("");
  const [lastLetter, setLastLetter] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const firstRef = useRef<ITextField>(null);
  const lastRef = useRef<ITextField>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (firstLetter.length === 0 || lastLetter.length === 0) {
      setShowErrors(true);
      return;
    }

    onPairSelected(firstLetter + lastLetter);
  }

  const onLetterChangeHandler = (handler: (value: string) => void) =>
    onChangeHandler((value: string) => {
      if (!isValidLetterInput(value)) {
        return;
      }

      setShowErrors(false);

      handler(value.toUpperCase());
    });

  const onFirstLetterChange = onLetterChangeHandler((value) => {
    setFirstLetter(value);

    if (value.length > 0) {
      lastRef.current?.focus();
    }
  });

  const onLastLetterChange = onLetterChangeHandler((value) => {
    setLastLetter(value);
  });

  const onLastLetterKeydown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Backspace") {
      if (lastLetter.length === 0) {
        firstRef?.current?.focus();
      }
    }
  };

  return (
    <>
      <h1>The license plate game</h1>

      <form onSubmit={onSubmit}>
        <Stack tokens={{ childrenGap: "16" }}>
          <Stack
            styles={{ root: { maxWidth: 500 } }}
            tokens={{ childrenGap: "16" }}
            horizontal
          >
            <TextField
              componentRef={firstRef}
              label="First"
              value={firstLetter}
              onChange={onFirstLetterChange}
              errorMessage={
                showErrors && firstLetter.length === 0 ? "Enter a letter" : ""
              }
              maxLength={1}
              styles={{ fieldGroup: { width: 60 } }}
            />

            <TextField
              componentRef={lastRef}
              label="Last"
              value={lastLetter}
              onChange={onLastLetterChange}
              onKeyDown={onLastLetterKeydown}
              errorMessage={
                showErrors && lastLetter.length === 0 ? "Enter a letter" : ""
              }
              maxLength={1}
              styles={{ fieldGroup: { width: 60 } }}
            />
          </Stack>

          <Stack.Item>
            <PrimaryButton type="submit" text="Go" />
          </Stack.Item>
        </Stack>
      </form>
    </>
  );
}

function isValidLetterInput(value: string): boolean {
  return value.length === 0 || isLetter(value);
}

function isLetter(value: string): boolean {
  return /^[a-zA-Z]$/.test(value);
}

type PlayGamePageProps = {
  pair: string;
  onRevealClicked: () => void;
};

function PlayGamePage({ pair, onRevealClicked }: PlayGamePageProps) {
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
      <h1>The license plate game</h1>

      <div>Pair: {pair}</div>

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

        <div>
          {Object.entries(guessedWords)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([length, words]) => (
              <div key={length}>
                <h3>{length} letter words</h3>

                <ul>
                  {words.map((word) => (
                    <li key={word}>{word}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

type RevealPageProps = {
  pair: string;
  onRestartClicked: () => void;
};

function RevealPage({ pair, onRestartClicked }: RevealPageProps) {
  const { data } = useQuery({
    queryKey: [pair],
    queryFn: () => fetchWords(pair),
  });

  return (
    <>
      <h1>The license plate game</h1>

      <div>Pair: {pair}</div>

      <div>
        <ul>
          {data?.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>
      </div>

      <div>
        <button onClick={onRestartClicked}>Restart</button>
      </div>
    </>
  );
}

type WordsByLength = Record<number, string[]>;

function fetchWords(pair: string): Promise<string[]> {
  return fetch(`http://localhost:3000/${pair}.txt`)
    .then((res) => res.text())
    .then((text) => text.split("\n"));
}
