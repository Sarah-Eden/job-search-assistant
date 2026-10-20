import type { ApiSearchParams } from "@/types";
import { updateApiSearchParams } from "@/api";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import InputWrapper from "../InputWrapper";
import Select from "react-select";
import { reactSelectInputStyle } from "./SharedStyles";
import { Button } from "@base-ui/react";
import { Check, X } from "lucide-react";

type JobicyValues = {
  geo: string[] | null;
  industry: string[] | null;
};

export default function JobicyForm({
  settings,
  onSettingsUpdate,
}: {
  settings: ApiSearchParams[];
  onSettingsUpdate: () => Promise<void>;
}) {
  const settingsDict = Object.fromEntries(
    settings.map((setting) => [setting.param_name, setting]),
  );
  const geoOptions = Object.entries(settingsDict.geo.accepted_values ?? {}).map(
    ([label, value]) => ({ label, value }),
  );

  const industryOptions = Object.entries(
    settingsDict.industry.accepted_values ?? {},
  ).map(([label, value]) => ({ label, value }));

  const { control, handleSubmit } = useForm<JobicyValues>({
    defaultValues: {
      geo: settingsDict["geo"].param_value,
      industry: settingsDict["industry"].param_value,
    },
  });

  const [status, setStatus] = useState<"success" | "error" | null>(null);

  async function onSubmit(data: JobicyValues) {
    try {
      setStatus(null);
      await updateApiSearchParams("jobicy", data);
      setStatus("success");
      await onSettingsUpdate();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center">Jobicy Settings</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputWrapper label="Location" htmlFor="geo">
          <Controller
            name="geo"
            control={control}
            render={({ field }) => (
              <Select
                inputId="geo"
                isMulti
                isClearable
                unstyled
                classNames={reactSelectInputStyle}
                options={geoOptions}
                value={geoOptions.filter((option) =>
                  (field.value ?? []).includes(option.value),
                )}
                onChange={(selected) => {
                  setStatus(null);
                  const options = selected.map((select) => select.value);
                  field.onChange(options.length > 0 ? options : null);
                }}
              />
            )}
          />
        </InputWrapper>

        <InputWrapper label="Industry" htmlFor="industry">
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select
                inputId="industry"
                isMulti
                isClearable
                unstyled
                classNames={reactSelectInputStyle}
                options={industryOptions}
                value={industryOptions.filter((option) =>
                  (field.value ?? []).includes(option.value),
                )}
                onChange={(selected) => {
                  setStatus(null);
                  const options = selected.map((select) => select.value);
                  field.onChange(options.length > 0 ? options : null);
                }}
              />
            )}
          />
        </InputWrapper>
      </div>
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
