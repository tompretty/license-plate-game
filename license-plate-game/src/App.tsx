import { useState } from "react";
import { EnterPair } from "./EnterPair";
import { PlayGame } from "./PlayGame";
import { RevealAnswers } from "./RevealAnswers";
import { Stack } from "@fluentui/react";

function App() {
  const [page, setPage] = useState<PageKind>("ENTER");
  const [pair, setPair] = useState("");

  return (
    <Stack styles={{ root: { width: 320 } }}>
      <h1 style={{ fontSize: "1.5rem" }}>TLPG</h1>

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
        <RevealAnswers
          pair={pair}
          onRestartClicked={() => {
            setPage("ENTER");
            setPair("");
          }}
        />
      )}
    </Stack>
  );
}

export default App;

type PageKind = "ENTER" | "PLAY" | "REVEAL";
