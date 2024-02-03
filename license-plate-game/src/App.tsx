import { useState } from "react";
import { EnterPair } from "./EnterPair";
import { PlayGame } from "./PlayGame";
import { RevealAnswers } from "./RevealAnswers";

function App() {
  const [page, setPage] = useState<PageKind>("ENTER");
  const [pair, setPair] = useState("");

  if (page === "ENTER") {
    return (
      <EnterPair
        onPairSelected={(pair) => {
          setPage("PLAY");
          setPair(pair);
        }}
      />
    );
  } else if (page === "PLAY") {
    return <PlayGame pair={pair} onRevealClicked={() => setPage("REVEAL")} />;
  } else if (page === "REVEAL") {
    return (
      <RevealAnswers pair={pair} onRestartClicked={() => setPage("ENTER")} />
    );
  }
}

export default App;

type PageKind = "ENTER" | "PLAY" | "REVEAL";
