import HimalayasForm from "@/components/settings/HimalayasForm";
import { render, screen, waitFor } from "@testing-library/react";
import type { ApiSearchParams } from "@/types";
import { vi, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { updateApiSearchParams } from "@/api";

const sampleParams: ApiSearchParams[] = [
  {
    source: "himalayas",
    param_name: "country",
    param_value: ["US", "CA"],
    accepted_values: null,
  },
  {
    source: "himalayas",
    param_name: "seniority",
    param_value: ["Entry-level", "Mid-level"],
    accepted_values: [
      "Entry-level",
      "Mid-level",
      "Senior",
      "Manager",
      "Director",
      "Executive",
    ],
  },
  {
    source: "himalayas",
    param_name: "employment_type",
    param_value: ["Full Time", "Contractor"],
    accepted_values: [
      "Full Time",
      "Part Time",
      "Contractor",
      "Temporary",
      "Intern",
      "Volunteer",
      "Other",
    ],
  },
  {
    source: "himalayas",
    param_name: "timezone",
    param_value: ["America/Los_Angeles"],
    accepted_values: ["UTC+", "UTC-"],
  },
  {
    source: "himalayas",
    param_name: "sort",
    param_value: null,
    accepted_values: [
      "relevant",
      "recent",
      "salaryAsc",
      "salaryDesc",
      "nameAToZ",
      "nameZToA",
      "jobs",
    ],
  },
];

vi.mock("@/api", () => ({
  updateApiSearchParams: vi.fn(),
}));

test("displays saved values", async () => {
  render(
    <HimalayasForm
      settings={sampleParams}
      onSettingsUpdate={vi.fn().mockResolvedValue(undefined)}
    />,
  );
  expect(screen.getByText("Entry-level")).toBeInTheDocument();
  expect(screen.getByText(/United States/)).toBeInTheDocument();
  expect(screen.getByText("Canada")).toBeInTheDocument();
  expect(screen.getByText("Pacific Time - Los Angeles")).toBeInTheDocument();
});

test("changes selected settings and submits correct values", async () => {
  const user = userEvent.setup();
  const onSettingsUpdate = vi.fn().mockResolvedValue(undefined);
  render(
    <HimalayasForm
      settings={sampleParams}
      onSettingsUpdate={onSettingsUpdate}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Remove Mid-level" }));
  await user.click(screen.getByRole("combobox", { name: "Seniority" }));
  await user.click(screen.getByRole("option", { name: "Senior" }));

  expect(screen.getByText("Senior")).toBeInTheDocument();
  expect(screen.queryByText("Mid-level")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => {
    expect(updateApiSearchParams).toHaveBeenCalledWith(
      "himalayas",
      expect.objectContaining({ seniority: ["Entry-level", "Senior"] }),
    );
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(onSettingsUpdate).toHaveBeenCalled();
  });
});

test("submitting form with blank field submits null for the value", async () => {
  const user = userEvent.setup();
  render(
    <HimalayasForm
      settings={sampleParams}
      onSettingsUpdate={vi.fn().mockResolvedValue(undefined)}
    />,
  );
  await user.click(screen.getByRole("combobox", { name: "Timezone" }));
  await user.keyboard("{Backspace}");
  await user.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => {
    expect(updateApiSearchParams).toHaveBeenCalledWith(
      "himalayas",
      expect.objectContaining({ timezone: null }),
    );
  });
});
