import type { ApiSearchParams } from "@/types";
import { useForm, Controller } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import CreatableSelect from "react-select/creatable";
import { updateApiSearchParams } from "@/api";
import { Button } from "@base-ui/react";
import { useState } from "react";
import { Check, X } from "lucide-react";

type SearchTermValues = { searchTerms: string[] | null };

export default function SearchTermsForm({
  settings,
}: {
  settings: ApiSearchParams;
}) {
  const { control, handleSubmit } = useForm<SearchTermValues>({
    defaultValues: { searchTerms: settings.param_value },
  });
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  async function onSubmit(data: SearchTermValues) {
    try {
      setStatus(null);
      await updateApiSearchParams("query", { search_terms: data.searchTerms });
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <InputWrapper label="Search Terms" htmlFor="searchTerms">
        <Controller
          name="searchTerms"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              isMulti
              inputId="searchTerms"
              unstyled
              classNames={{
                control: ({ isFocused }) =>
                  `border-2 border-border bg-card rounded-md px-3 py-2 text-foreground-secondary ${isFocused ? "ring-2 ring-ring" : ""}`,
                menu: () =>
                  "mt-1 rounded-md border border-border bg-card shadow-md z-10",
                option: ({ isFocused }) =>
                  `px-3 py-2 text-foreground cursor-pointer ${
                    isFocused ? "bg-muted" : ""
                  }`,
                multiValue: () =>
                  "flex items-center gap-1 rounded-md bg-muted mr-1 px-2 py-1",

                multiValueLabel: () => "text-sm text-foreground",

                multiValueRemove: () =>
                  "cursor-pointer rounded-sm hover:bg-border",
              }}
              value={(field.value ?? []).map((value) => ({
                label: value,
                value: value,
              }))}
              onChange={(selected) => {
                setStatus(null);
                const options = selected.map((select) => select.value);
                field.onChange(options);
              }}
            />
          )}
        />
      </InputWrapper>
      <span className="flex items-center gap-2">
        <Button
          className="bg-primary hover:bg-secondary-foreground text-background rounded-md px-3 py-2"
          type="submit"
        >
          Save
        </Button>
        {status === "success" && (
          <span className="flex items-center gap-1">
            <Check className="flex items-center gap-1 text-success" />
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1">
            <X className="text-error" /> Save Failed
          </span>
        )}
      </span>
    </form>
  );
}
