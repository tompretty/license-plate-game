import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";

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
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    onPairSelected(first + last);
  }

  return (
    <>
      <h1>The license plate game</h1>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />
        <input
          type="text"
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />

        <button type="submit">Go</button>
      </form>
    </>
  );
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
  const [guessedWords, setGuessedWords] = useState<WordsByLength>([]);

  function onGuessSubmitted(event: React.FormEvent) {
    event.preventDefault();

    if (isPending || error) {
      // TODO: something better
      return;
    }

    const index = data.indexOf(guess);

    if (index === -1) {
      // TODO: something better
      return;
    }

    let updatedWords: string[] = [];
    if (!guessedWords[guess.length]) {
      updatedWords = [guess];
    } else {
      updatedWords = [...guessedWords[guess.length], guess];
    }

    setGuessedWords({
      ...guessedWords,
      [guess.length]: updatedWords,
    });
    setGuess("");
  }

  return (
    <>
      <h1>The license plate game</h1>

      <div>Pair: {pair}</div>

      <form onSubmit={onGuessSubmitted}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>Answers</h2>

        <div>
          {Object.entries(guessedWords)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([length, words]) => (
              <div>
                <h3>{length} letter words</h3>

                <ul key={length}>
                  {words.map((word) => (
                    <li key={word}>{word}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>

      <div>
        <button onClick={onRevealClicked}>Reveal</button>
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
