import { DetailsList, IColumn, SelectionMode } from "@fluentui/react";

type AnswersSummaryListProps = {
  wordsByLengthSummary: Record<number, number>;
};

export function AnswersSummaryList({
  wordsByLengthSummary,
}: AnswersSummaryListProps) {
  const ordered = Object.entries(wordsByLengthSummary).sort(
    ([a], [b]) => parseInt(a) - parseInt(b)
  );

  const columns: IColumn[] = ordered.map(([length]) => ({
    key: length,
    name: length,
    fieldName: length,
    minWidth: 50,
  }));

  return (
    <DetailsList
      items={[wordsByLengthSummary]}
      columns={columns}
      selectionMode={SelectionMode.none}
    />
  );
}
