export const reactSelectInputStyle = {
  control: ({ isFocused }: { isFocused: boolean }) =>
    `border-2 border-border bg-card rounded-md px-3 py-2 text-foreground-secondary ${isFocused ? "ring-2 ring-ring" : ""}`,
  menu: () => "mt-1 rounded-md border border-border bg-card shadow-md z-10",
  option: ({ isFocused }: { isFocused: boolean }) =>
    `px-3 py-2 text-foreground cursor-pointer ${isFocused ? "bg-muted" : ""}`,
  multiValue: () =>
    "flex items-center gap-1 rounded-md bg-muted mr-1 px-2 py-1",

  multiValueLabel: () => "text-sm text-foreground",

  multiValueRemove: () => "cursor-pointer rounded-sm hover:bg-border",
};
