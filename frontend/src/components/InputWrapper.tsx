import React from "react";

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
