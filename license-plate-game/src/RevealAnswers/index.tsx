import { PrimaryButton } from "@fluentui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchWords } from "../fetchWords";

type RevealAnswersProps = {
  pair: string;
  onRestartClicked: () => void;
};

export function RevealAnswers({ pair, onRestartClicked }: RevealAnswersProps) {
  const { data } = useQuery({
    queryKey: [pair],
    queryFn: () => fetchWords(pair),
  });

  return (
    <>
      <div>
        <PrimaryButton onClick={onRestartClicked} text="Restart" />
      </div>

      <div>
        <ul>
          {data?.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
