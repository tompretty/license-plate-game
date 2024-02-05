import { PrimaryButton } from "@fluentui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchWords } from "../fetchWords";
import { AnswersList } from "../AnswersList";
import { WordsByLength } from "../wordsByLength";

type RevealAnswersProps = {
  pair: string;
  onRestartClicked: () => void;
};

export function RevealAnswers({ pair, onRestartClicked }: RevealAnswersProps) {
  const { data: wordList, isSuccess } = useQuery({
    queryKey: [pair],
    queryFn: () => fetchWords(pair),
  });

  const wordsByLength: WordsByLength = isSuccess
    ? wordList.getWordsByLength()
    : {};

  return (
    <>
      <h2>Answers</h2>

      <div>
        <PrimaryButton onClick={onRestartClicked} text="Restart" />
      </div>

      <AnswersList wordsByLength={wordsByLength} label="All words" />
    </>
  );
}
