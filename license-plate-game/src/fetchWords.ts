export function fetchWords(pair: string): Promise<string[]> {
  return fetch(`http://localhost:3000/${pair}.txt`)
    .then((res) => res.text())
    .then((text) => text.split("\n"));
}
