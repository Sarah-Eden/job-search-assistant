import { render, screen, waitFor } from "@testing-library/react";
import SearchTermsForm from "@/components/settings/SearchTermsForm";
import type { ApiSearchParams } from "@/types";
import { test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { updateApiSearchParams } from "@/api";

const sampleParams: ApiSearchParams = {
  source: "query",
  param_name: "search_terms",
  param_value: ["software developer", "Python Developer"],
  accepted_values: null,
};

const sampleNullParams: ApiSearchParams = {
  source: "query",
  param_name: "search_terms",
  param_value: null,
  accepted_values: null,
};

vi.mock("@/api", () => ({
  updateApiSearchParams: vi.fn(),
}));

test("displays saved search terms", () => {
  render(
    <SearchTermsForm
      settings={sampleParams}
      onSettingsUpdate={vi.fn().mockResolvedValue(undefined)}
    />,
  );
  expect(screen.getByText("software developer")).toBeInTheDocument();
  expect(screen.getByText("Python Developer")).toBeInTheDocument();
});

test("adding new search terms to the display", async () => {
  render(
    <SearchTermsForm
      settings={sampleNullParams}
      onSettingsUpdate={vi.fn().mockResolvedValue(undefined)}
    />,
  );
  const user = userEvent.setup();
  const input = screen.getByRole("combobox", { name: "Search Terms" });
  await user.click(input);
  await user.type(input, "backend developer");
  await user.keyboard("{Enter}");
  expect(screen.getByText("backend developer")).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Remove backend developer" }),
  );
  expect(screen.queryByText("backend developer")).not.toBeInTheDocument();
});

test("submit new search terms", async () => {
  render(
    <SearchTermsForm
      settings={sampleNullParams}
      onSettingsUpdate={vi.fn().mockResolvedValue(undefined)}
    />,
  );
  const user = userEvent.setup();
  const input = screen.getByRole("combobox", { name: "Search Terms" });
  await user.click(input);
  await user.type(input, "backend developer");
  await user.keyboard("{Enter}");
  await user.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    expect(updateApiSearchParams).toHaveBeenCalledWith("query", {
      search_terms: ["backend developer"],
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  await user.click(input);
  await user.type(input, "python developer");
  await user.keyboard("{Enter}");
  expect(screen.queryByText("Saved")).not.toBeInTheDocument();
});

test("Failed save message appears", async () => {
  vi.mocked(updateApiSearchParams).mockRejectedValueOnce(
    new Error("Request failed"),
  );
  render(
    <SearchTermsForm
      settings={sampleNullParams}
      onSettingsUpdate={vi.fn().mockResolvedValue(undefined)}
    />,
  );
  const user = userEvent.setup();
  const input = screen.getByRole("combobox", { name: "Search Terms" });
  await user.click(input);
  await user.type(input, "backend developer");
  await user.keyboard("{Enter}");
  await user.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => {
    expect(screen.getByText("Save Failed")).toBeInTheDocument();
  });
});
