import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function OrganiserCountryStep({
  countries,
  countriesLoading,
  countriesError,
  selectedCountry,
  countryAutoDetected,
  onCountryChange,
}) {
  return (
    <div className="tw:w-full tw:min-h-[260px] tw:flex tw:flex-col tw:gap-6">
      <div>
        <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-gray-500 tw:bg-lightPurple/60 tw:px-3 tw:py-1 tw:rounded-full">
          <span className="tw:w-1.5 tw:h-1.5 tw:rounded-full tw:bg-primary" />
          Organiser onboarding
        </span>
        <span className="tw:block tw:mt-3 tw:text-2xl tw:md:text-3xl tw:font-semibold tw:text-[#111827]">
          Where are you streaming from?
        </span>
      </div>

      <div className="tw:max-w-2xl">
        <Autocomplete
          options={countries}
          loading={countriesLoading}
          value={selectedCountry}
          onChange={onCountryChange}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          getOptionLabel={(option) => option?.name || ""}
          noOptionsText={
            countriesLoading ? "Loading countries..." : "No countries found"
          }
          renderOption={(props, option) => (
            <li {...props} key={option.code}>
              <div className="tw:flex tw:items-center tw:gap-3">
                {option.flag ? (
                  <img
                    src={option.flag}
                    alt=""
                    className="tw:h-5 tw:w-7 tw:rounded-sm tw:object-cover"
                  />
                ) : (
                  <span className="tw:text-base">{option.flagEmoji || ""}</span>
                )}
                <span>{option.name}</span>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              helperText={
                countriesError ||
                (countryAutoDetected
                  ? "We prefilled this from your connection. You can change it if it looks wrong."
                  : "Search and select the country you are streaming from")
              }
              error={Boolean(countriesError)}
            />
          )}
        />
      </div>

      {selectedCountry && (
        <div className="tw:inline-flex tw:w-fit tw:items-center tw:gap-2 tw:rounded-full tw:bg-slate-100 tw:px-3 tw:py-2 tw:text-xs tw:text-slate-700">
          <span>{selectedCountry.flagEmoji || ""}</span>
          <span>{selectedCountry.name}</span>
          {countryAutoDetected && (
            <span className="tw:rounded-full tw:bg-white tw:px-2 tw:py-1 tw:text-[10px] tw:font-medium tw:text-slate-600">
              Auto-detected
            </span>
          )}
        </div>
      )}
    </div>
  );
}
