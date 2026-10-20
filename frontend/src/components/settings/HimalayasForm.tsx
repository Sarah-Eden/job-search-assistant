import type { ApiSearchParams } from "@/types";
import { getData } from "country-list";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { updateApiSearchParams } from "@/api";
import { useState } from "react";
import { reactSelectInputStyle } from "./SharedStyles";
import { getTimeZones } from "@vvo/tzdb";
import { Button } from "@base-ui/react";
import { Check, X } from "lucide-react";

type HimalayasValues = {
  country: string[] | null;
  seniority: string[] | null;
  employment_type: string[] | null;
  timezone: string[] | null;
  sort: string[] | null;
};

export default function HimalayasForm({
  settings,
  onSettingsUpdate,
}: {
  settings: ApiSearchParams[];
  onSettingsUpdate: () => Promise<void>;
}) {
  const countries = getData();
  const timezones = getTimeZones();
  const timezoneOptions = timezones.map((zone) => ({
    label: `${zone.alternativeName} - ${zone.mainCities[0]}`,
    value: zone.name,
  }));
  const settingsDict = Object.fromEntries(
    settings.map((setting) => [setting.param_name, setting]),
  );
  const { control, handleSubmit } = useForm<HimalayasValues>({
    defaultValues: {
      country: settingsDict["country"].param_value,
      seniority: settingsDict["seniority"].param_value,
      employment_type: settingsDict["employment_type"].param_value,
      timezone: settingsDict["timezone"].param_value,
      sort: settingsDict["sort"].param_value,
    },
  });

  const [status, setStatus] = useState<"success" | "error" | null>(null);

  async function onSubmit(data: HimalayasValues) {
    try {
      setStatus(null);
      await updateApiSearchParams("himalayas", data);
      setStatus("success");
      await onSettingsUpdate();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center">Himalayas API Settings</p>
      <InputWrapper label="Country" htmlFor="country">
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select
              options={countries}
              getOptionLabel={(countries) => countries.name}
              getOptionValue={(countries) => countries.code}
              isMulti
              isClearable
              inputId="country"
              unstyled
              classNames={reactSelectInputStyle}
              value={countries.filter((country) =>
                field.value?.includes(country.code),
              )}
              onChange={(selected) => {
                setStatus(null);
                const codes = selected.map((country) => country.code);
                field.onChange(codes.length > 0 ? codes : null);
              }}
            />
          )}
        />
      </InputWrapper>

      <InputWrapper label="Seniority" htmlFor="seniority">
        <Controller
          name="seniority"
          control={control}
          render={({ field }) => (
            <Select
              isMulti
              isClearable
              inputId="seniority"
              unstyled
              classNames={reactSelectInputStyle}
              options={Object.entries(
                settingsDict.seniority.accepted_values ?? {},
              ).map(([label, value]) => ({ label: label, value: value }))}

              value={(field.value ?? []).map((value) => ({
                label: value,
                value: value,
              }))}

              onChange={(selected) => {
                setStatus(null);
                const options = selected.map((select) => select.value);
                field.onChange(options.length > 0 ? options : null);
              }}
            />
          )}
        />
      </InputWrapper>

      <InputWrapper label="Employment Type" htmlFor="employmentType">
        <Controller
          name="employment_type"
          control={control}
          render={({ field }) => (
            <Select
              isMulti
              isClearable
              inputId="employmentType"
              unstyled
              classNames={reactSelectInputStyle}
              options={Object.entries(
                settingsDict.employment_type.accepted_values ?? {},
              ).map(([label, value]) => ({ label: label, value: value }))}
              value={(field.value ?? []).map((value) => ({
                label: value,
                value: value,
              }))}
              onChange={(selected) => {
                setStatus(null);
                const options = selected.map((select) => select.value);
                field.onChange(options.length > 0 ? options : null);
              }}
            />
          )}
        />
      </InputWrapper>

      <InputWrapper label="Timezone" htmlFor="timezone">
        <Controller
          name="timezone"
          control={control}
          render={({ field }) => (
            <Select
              isClearable
              inputId="timezone"
              unstyled
              classNames={reactSelectInputStyle}
              options={timezoneOptions}
              value={
                timezoneOptions.find(
                  (option) => option.value === field.value?.[0],
                ) ?? null
              }
              onChange={(selected) => {
                setStatus(null);
                field.onChange(selected ? [selected.value] : null);
              }}
            />
          )}
        />
      </InputWrapper>

      <InputWrapper label="Sort Direction" htmlFor="sort">
        <Controller
          name="sort"
          control={control}
          render={({ field }) => (
            <Select
              isClearable
              inputId="sort"
              unstyled
              classNames={reactSelectInputStyle}
              options={Object.entries(
                settingsDict.sort.accepted_values ?? {},
              ).map(([label, value]) => ({ label: label, value: value }))}
              value={
                field.value?.[0]
                  ? { label: field.value[0], value: field.value[0] }
                  : null
              }
              onChange={(selected) => {
                setStatus(null);
                field.onChange(selected ? [selected.value] : null);
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
