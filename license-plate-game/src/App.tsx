import { useState } from "react";
import { EnterPair } from "./EnterPair";
import { PlayGame } from "./PlayGame";
import { RevealAnswers } from "./RevealAnswers";

function App() {
  const [page, setPage] = useState<PageKind>("ENTER");
  const [pair, setPair] = useState("");

  return (
    <>
      <h1>The license plate game</h1>

      {pair && <div>Pair: {pair}</div>}

      {page === "ENTER" && (
        <EnterPair
          onPairSelected={(pair) => {
            setPage("PLAY");
            setPair(pair);
          }}
        />
      )}

      {page === "PLAY" && (
        <PlayGame pair={pair} onRevealClicked={() => setPage("REVEAL")} />
      )}

      {page === "REVEAL" && (
        <RevealAnswers pair={pair} onRestartClicked={() => setPage("ENTER")} />
      )}
    </>
  );
}

export default App;

type PageKind = "ENTER" | "PLAY" | "REVEAL";
