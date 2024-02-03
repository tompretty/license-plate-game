import { ITextField, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { useEffect, useRef, useState } from "react";
import { onChangeHandler } from "../fluentUiHelpers";

type EnterPairPageProps = {
  onPairSelected: (pair: string) => void;
};

export function EnterPair({ onPairSelected }: EnterPairPageProps) {
  const [firstLetter, setFirstLetter] = useState("");
  const [lastLetter, setLastLetter] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const firstRef = useRef<ITextField>(null);
  const lastRef = useRef<ITextField>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (firstLetter.length === 0 || lastLetter.length === 0) {
      setShowErrors(true);
      return;
    }

    onPairSelected(firstLetter + lastLetter);
  }

  const onLetterChangeHandler = (handler: (value: string) => void) =>
    onChangeHandler((value: string) => {
      if (!isValidLetterInput(value)) {
        return;
      }

      setShowErrors(false);

      handler(value.toUpperCase());
    });

  const onFirstLetterChange = onLetterChangeHandler((value) => {
    setFirstLetter(value);

    if (value.length > 0) {
      lastRef.current?.focus();
    }
  });

  const onLastLetterChange = onLetterChangeHandler((value) => {
    setLastLetter(value);
  });

  const onLastLetterKeydown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Backspace") {
      if (lastLetter.length === 0) {
        firstRef?.current?.focus();
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack tokens={{ childrenGap: "16" }}>
        <Stack
          styles={{ root: { maxWidth: 500 } }}
          tokens={{ childrenGap: "16" }}
          horizontal
        >
          <TextField
            componentRef={firstRef}
            label="First"
            value={firstLetter}
            onChange={onFirstLetterChange}
            errorMessage={
              showErrors && firstLetter.length === 0 ? "Enter a letter" : ""
            }
            maxLength={1}
            styles={{ fieldGroup: { width: 60 } }}
          />

          <TextField
            componentRef={lastRef}
            label="Last"
            value={lastLetter}
            onChange={onLastLetterChange}
            onKeyDown={onLastLetterKeydown}
            errorMessage={
              showErrors && lastLetter.length === 0 ? "Enter a letter" : ""
            }
            maxLength={1}
            styles={{ fieldGroup: { width: 60 } }}
          />
        </Stack>

        <Stack.Item>
          <PrimaryButton type="submit" text="Go" />
        </Stack.Item>
      </Stack>
    </form>
  );
}

// ---- Helpers ---- //

function isValidLetterInput(value: string): boolean {
  return value.length === 0 || isLetter(value);
}

function isLetter(value: string): boolean {
  return /^[a-zA-Z]$/.test(value);
}
