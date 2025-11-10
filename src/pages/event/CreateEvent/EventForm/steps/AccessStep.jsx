import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "../../../../../component/form/SelectField";

const schema = z.object({
  visibility: z.string().min(1, "Please select visibility"),
  matureContent: z.boolean().default(false),
});

const VIS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "unlisted", label: "Unlisted" },
];

export default function AccessStep({ defaultValues = {}, onBack, onNext }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { matureContent: false, ...defaultValues },
  });

  const visibility = watch("visibility");

  const submit = (v) => onNext(v);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="tw:bg-white tw:rounded-2xl tw:p-5 tw:sm:p-7 tw:border tw:border-gray-100"
    >
      <h2 className="tw:text-[18px] tw:sm:text-lg tw:font-semibold tw:mb-5">
        Access & Visibility
      </h2>

      <div className="tw:space-y-5">
        <SelectField
          label="Visibility*"
          value={visibility}
          onChange={(v) => setValue("visibility", v, { shouldValidate: true })}
          options={VIS}
          error={errors?.visibility?.message}
        />

        <div className="tw:flex tw:items-center tw:justify-between">
          <label className="tw:text-[15px]">
            This event contains mature content
          </label>
          <input
            type="checkbox"
            {...register("matureContent")}
            className="tw:accent-primary"
          />
        </div>
      </div>

      <div className="tw:flex tw:justify-between tw:mt-6">
        <button
          style={{
            borderRadius: 20,
          }}
          type="button"
          onClick={onBack}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:bg-gray-50"
        >
          Back
        </button>
        <button
          style={{
            borderRadius: 20,
          }}
          type="submit"
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white hover:tw:bg-primarySecond"
        >
          Next
        </button>
      </div>
    </form>
  );
}
