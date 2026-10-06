import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InputWrapper from "@/components/InputWrapper";

describe("InputWrapper", () => {
  it("renders its label and child", () => {
    render(
      <InputWrapper label="Search terms">
        <input />
      </InputWrapper>,
    );

    expect(screen.getByText("Search terms")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
