type FluentUiHandler = (
  event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  newValue?: string
) => void;

type SimplifiedHandler = (value: string) => void;

export function onChangeHandler(handler: SimplifiedHandler): FluentUiHandler {
  const wrapped: FluentUiHandler = (_event, newValue) => {
    handler(newValue ?? "");
  };

  return wrapped;
}
