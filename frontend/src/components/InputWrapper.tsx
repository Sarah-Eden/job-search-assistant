import React from "react";

export const inputStyle =
  "border-2 border-border bg-card px-3 py-2 text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-ring";

export default function InputWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-foreground">{label}</label>
      {children}
    </div>
  );
}
