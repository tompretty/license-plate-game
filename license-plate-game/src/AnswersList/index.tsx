import { DetailsList, IColumn, IGroup, SelectionMode } from "@fluentui/react";
import { WordsByLength } from "../wordsByLength";

type AnswersListProps = {
  wordsByLength: WordsByLength;
};

export function AnswersList({ wordsByLength }: AnswersListProps) {
  const { items, groups } = getGroupedItems(wordsByLength);

  return (
    <DetailsList
      items={items}
      groups={groups}
      columns={COLUMNS}
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

// ---- Constants ---- //

const COLUMNS: IColumn[] = [
  {
    key: "word",
    name: "Guessed words",
    minWidth: 50,
    onRender: (word: string) => word,
  },
];
