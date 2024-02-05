import { DetailsList, IColumn, IGroup, SelectionMode } from "@fluentui/react";
import { WordsByLength } from "../wordsByLength";

type AnswersListProps = {
  wordsByLength: WordsByLength;
  label: string;
};

export function AnswersList({ wordsByLength, label }: AnswersListProps) {
  const { items, groups } = getGroupedItems(wordsByLength);

  const columns: IColumn[] = [
    {
      key: "word",
      name: label,
      minWidth: 50,
      onRender: (word: string) => word,
    },
  ];

  return (
    <DetailsList
      items={items}
      groups={groups}
      columns={columns}
      selectionMode={SelectionMode.none}
    />
  );
}

// ---- Helpers ---- //

type GroupedItems = {
  items: string[];
  groups: IGroup[];
};

function getGroupedItems(wordsByLength: WordsByLength): GroupedItems {
  const ordered = Object.entries(wordsByLength).sort(
    ([a], [b]) => parseInt(b) - parseInt(a)
  );

  const groups: IGroup[] = [];

  let total = 0;
  ordered.forEach(([length, words]) => {
    groups.push({
      key: length,
      name: `${length} letter words`,
      count: words.length,
      startIndex: total,
    });
    total += words.length;
  });

  const items = ordered.map(([, words]) => words).flat();

  return { items, groups };
}
